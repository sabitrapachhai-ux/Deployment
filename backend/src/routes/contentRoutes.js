import { Router } from 'express';
import { z } from 'zod';
import Service from '../models/Service.js';
import Certificate from '../models/Certificate.js';
import Experience from '../models/Experience.js';
import Appreciation from '../models/Appreciation.js';
import { requireAuth } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

function makeRoutes(Model, schema, publicFilter = {}) {
  const router = Router();
  router.get('/', asyncHandler(async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 100));
    const filter = { ...publicFilter };
    const [items, total] = await Promise.all([
      Model.find(filter).sort({ order: 1, date: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Model.countDocuments(filter),
    ]);
    res.json({ success: true, data: { items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } }, message: 'Records retrieved' });
  }));
  router.use(requireAuth);
  router.post('/', validate(schema), asyncHandler(async (req, res) => {
    const item = await Model.create(req.validatedBody);
    res.status(201).json({ success: true, data: item, message: 'Record created' });
  }));
  router.put('/:id', validate(schema), asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndUpdate(req.params.id, req.validatedBody, { new: true, runValidators: true });
    if (!item) throw new ApiError(404, 'Record not found');
    res.json({ success: true, data: item, message: 'Record updated' });
  }));
  router.delete('/:id', asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) throw new ApiError(404, 'Record not found');
    res.json({ success: true, data: null, message: 'Record deleted' });
  }));
  return router;
}

export default {
  service: makeRoutes(Service, z.object({
    title: z.string().trim().min(1), description: z.string().trim().min(1),
    icon: z.string().optional(), startingPrice: z.coerce.number().min(0).optional().nullable(),
    isActive: z.boolean().optional(), order: z.coerce.number().int().optional(),
  }), { isActive: true }),
  certificate: makeRoutes(Certificate, z.object({
    title: z.string().trim().min(1), issuedBy: z.string().trim().min(1),
    issueDate: z.coerce.date().optional().nullable(), description: z.string().optional(),
    image: z.string().optional(), order: z.coerce.number().int().optional(),
  })),
  experience: makeRoutes(Experience, z.object({
    role: z.string().trim().min(1), organization: z.string().trim().min(1),
    startYear: z.coerce.number().int(), endYear: z.coerce.number().int().optional().nullable(),
    description: z.string().optional(), order: z.coerce.number().int().optional(),
  })),
  appreciation: makeRoutes(Appreciation, z.object({
    authorName: z.string().trim().min(1), authorRole: z.string().optional(),
    message: z.string().trim().min(1), rating: z.coerce.number().int().min(1).max(5).optional(),
    image: z.string().optional(), date: z.coerce.date().optional(), isFeatured: z.boolean().optional(),
  })),
};
