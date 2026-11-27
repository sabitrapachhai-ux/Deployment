import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import ApiError from '../utils/ApiError.js';

export function requireAuth(req, res, next) {
  const token = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : null;
  if (!token) throw new ApiError(401, 'Authentication required');
  try {
    req.user = jwt.verify(token, env.jwtSecret);
    if (req.user.role !== 'admin') throw new Error();
    next();
  } catch {
    next(new ApiError(401, 'Invalid or expired session'));
  }
}
