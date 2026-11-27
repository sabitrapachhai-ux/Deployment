import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import Message from '../models/Message.js';
import { requireAuth } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

const router = Router();
const schema = z.object({
  name: z.string().trim().min(1), phone: z.string().trim().min(1),
  email: z.email().optional().or(z.literal('')), message: z.string().trim().min(1),
});
const contactLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: 'draft-7', legacyHeaders: false });
router.post('/', contactLimit, validate(schema), asyncHandler(async (req, res) => {
  const item = await Message.create(req.validatedBody);
  res.status(201).json({ success: true, data: { id: item.id }, message: 'Message sent' });
}));
router.use(requireAuth);
router.get('/', asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  const [items, total] = await Promise.all([Message.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit), Message.countDocuments()]);
  res.json({ success: true, data: { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } }, message: 'Messages retrieved' });
}));
router.patch('/:id/read', asyncHandler(async (req, res) => {
  const item = await Message.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
  if (!item) throw new ApiError(404, 'Message not found');
  res.json({ success: true, data: item, message: 'Message marked read' });
}));
router.delete('/:id', asyncHandler(async (req, res) => {
  const item = await Message.findByIdAndDelete(req.params.id);
  if (!item) throw new ApiError(404, 'Message not found');
  res.json({ success: true, data: null, message: 'Message deleted' });
}));
export default router;
