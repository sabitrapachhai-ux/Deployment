import { Router } from 'express';
import { z } from 'zod';
import InventoryItem from '../models/InventoryItem.js';
import { requireAuth } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

const router = Router();
const categories = z.enum(['screen','battery','charger','cable','case','strap','spare_part','accessory','other']);
const schema = z.object({
  name: z.string().trim().min(1), category: categories, brand: z.string().optional(),
  compatibleWith: z.string().optional(), sku: z.string().trim().min(1),
  price: z.coerce.number().min(0), quantity: z.coerce.number().int().min(0),
  lowStockThreshold: z.coerce.number().int().min(0).default(3), image: z.string().optional(),
  description: z.string().optional(), isPublished: z.boolean().optional(),
});

router.get('/', asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 12));
  let isAdmin = false;
  const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null;
  if (token) {
    try { isAdmin = jwt.verify(token, env.jwtSecret).role === 'admin'; } catch {}
  }
  const filter = isAdmin ? {} : { isPublished: true };
  if (req.query.category) filter.category = req.query.category;
  if (req.query.search) filter.$or = [{ name: { $regex: req.query.search, $options: 'i' } }, { brand: { $regex: req.query.search, $options: 'i' } }];
  let items = await InventoryItem.find(filter);
  if (req.query.stockStatus) items = items.filter((item) => item.stockStatus === req.query.stockStatus);
  const total = items.length;
  const paged = items.sort((a, b) => a.name.localeCompare(b.name)).slice((page - 1) * limit, page * limit);
  res.json({ success: true, data: { items: paged, pagination: { page, limit, total, pages: Math.ceil(total / limit) } }, message: 'Inventory retrieved' });
}));
router.get('/:id', asyncHandler(async (req, res) => {
  const item = await InventoryItem.findOne({ _id: req.params.id, isPublished: true });
  if (!item) throw new ApiError(404, 'Inventory item not found');
  res.json({ success: true, data: item, message: 'Inventory item retrieved' });
}));
router.use(requireAuth);
router.post('/', validate(schema), asyncHandler(async (req, res) => {
  const item = await InventoryItem.create(req.validatedBody);
  res.status(201).json({ success: true, data: item, message: 'Inventory item created' });
}));
router.put('/:id', validate(schema), asyncHandler(async (req, res) => {
  const item = await InventoryItem.findByIdAndUpdate(req.params.id, req.validatedBody, { new: true, runValidators: true });
  if (!item) throw new ApiError(404, 'Inventory item not found');
  res.json({ success: true, data: item, message: 'Inventory item updated' });
}));
router.patch('/:id/stock', validate(z.object({ quantity: z.coerce.number().int().min(0) })), asyncHandler(async (req, res) => {
  const item = await InventoryItem.findByIdAndUpdate(req.params.id, { quantity: req.validatedBody.quantity }, { new: true, runValidators: true });
  if (!item) throw new ApiError(404, 'Inventory item not found');
  res.json({ success: true, data: item, message: 'Stock updated' });
}));
router.delete('/:id', asyncHandler(async (req, res) => {
  const item = await InventoryItem.findByIdAndDelete(req.params.id);
  if (!item) throw new ApiError(404, 'Inventory item not found');
  res.json({ success: true, data: null, message: 'Inventory item deleted' });
}));
export default router;
