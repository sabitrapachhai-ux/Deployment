import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import Repair from '../models/Repair.js';
import { requireAuth } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

const router = Router();
const statuses = z.enum(['received','diagnosing','in_repair','waiting_for_parts','repaired','delivered','not_repairable']);
const devices = z.enum(['mobile','watch','rice_cooker','laptop','tv','other']);
const repairSchema = z.object({
  customerName: z.string().trim().min(1), customerPhone: z.string().trim().min(1),
  deviceType: devices, brand: z.string().trim().min(1), model: z.string().trim().min(1),
  issueDescription: z.string().trim().min(1), repairStatus: statuses.optional(),
  estimatedCost: z.coerce.number().min(0).optional(), finalCost: z.coerce.number().min(0).optional(),
  advancePaid: z.coerce.number().min(0).optional(), receivedDate: z.coerce.date().optional(),
  expectedDate: z.coerce.date().optional().nullable(), completedDate: z.coerce.date().optional().nullable(),
  images: z.array(z.string()).optional(), internalNotes: z.string().optional(),
});

const trackLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-7', legacyHeaders: false });
router.get('/track/:trackingCode', trackLimit, asyncHandler(async (req, res) => {
  const repair = await Repair.findOne({ trackingCode: req.params.trackingCode.trim().toUpperCase() })
    .select('deviceType brand model repairStatus expectedDate');
  if (!repair) throw new ApiError(404, 'Repair not found');
  res.json({ success: true, data: {
    device: repair.deviceType, brand: repair.brand, model: repair.model,
    status: repair.repairStatus, expectedDate: repair.expectedDate,
  }, message: 'Repair status found' });
}));

router.use(requireAuth);
router.get('/', asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  const filter = {};
  if (req.query.status) filter.repairStatus = req.query.status;
  if (req.query.deviceType) filter.deviceType = req.query.deviceType;
  if (req.query.search) filter.$or = [
    { customerName: { $regex: req.query.search, $options: 'i' } },
    { customerPhone: { $regex: req.query.search, $options: 'i' } },
    { trackingCode: { $regex: req.query.search, $options: 'i' } },
  ];
  const [items, total] = await Promise.all([Repair.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit), Repair.countDocuments(filter)]);
  res.json({ success: true, data: { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } }, message: 'Repairs retrieved' });
}));
router.get('/:id', asyncHandler(async (req, res) => {
  const item = await Repair.findById(req.params.id);
  if (!item) throw new ApiError(404, 'Repair not found');
  res.json({ success: true, data: item, message: 'Repair retrieved' });
}));
router.post('/', validate(repairSchema), asyncHandler(async (req, res) => {
  const item = await Repair.create(req.validatedBody);
  res.status(201).json({ success: true, data: item, message: 'Repair created' });
}));
router.put('/:id', validate(repairSchema), asyncHandler(async (req, res) => {
  const update = { ...req.validatedBody };
  if (update.repairStatus) update.isRepaired = ['repaired', 'delivered'].includes(update.repairStatus);
  const item = await Repair.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
  if (!item) throw new ApiError(404, 'Repair not found');
  res.json({ success: true, data: item, message: 'Repair updated' });
}));
router.patch('/:id/status', validate(z.object({ repairStatus: statuses })), asyncHandler(async (req, res) => {
  const update = { repairStatus: req.validatedBody.repairStatus };
  update.isRepaired = ['repaired', 'delivered'].includes(update.repairStatus);
  if (['repaired', 'delivered'].includes(update.repairStatus)) update.completedDate = new Date();
  const item = await Repair.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
  if (!item) throw new ApiError(404, 'Repair not found');
  res.json({ success: true, data: item, message: 'Repair status updated' });
}));
router.delete('/:id', asyncHandler(async (req, res) => {
  const item = await Repair.findByIdAndDelete(req.params.id);
  if (!item) throw new ApiError(404, 'Repair not found');
  res.json({ success: true, data: null, message: 'Repair deleted' });
}));
export default router;
