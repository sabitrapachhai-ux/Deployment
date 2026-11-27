import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import User from '../models/User.js';
import validate from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { env } from '../config/env.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';

const router = Router();
const loginLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-7', legacyHeaders: false });
const loginSchema = z.object({ email: z.email(), password: z.string().min(1) });

router.post('/login', loginLimit, validate(loginSchema), asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.validatedBody.email }).select('+passwordHash');
  if (!user || !(await bcrypt.compare(req.validatedBody.password, user.passwordHash))) {
    throw new ApiError(401, 'Invalid email or password');
  }
  const token = jwt.sign({ sub: user.id, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
  res.json({ success: true, data: { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } }, message: 'Login successful' });
}));

router.get('/me', requireAuth, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.sub);
  if (!user) throw new ApiError(401, 'Invalid or expired session');
  res.json({ success: true, data: { id: user.id, name: user.name, email: user.email, role: user.role }, message: 'Authenticated user' });
}));

export default router;
