import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import ApiError from '../utils/ApiError.js';

const router = Router();
router.post('/', requireAuth, (req, res, next) => {
  upload(req, res, (error) => {
    if (error) return next(error);
    if (!req.file) return next(new ApiError(400, 'An image file is required'));
    res.status(201).json({ success: true, data: { url: `/uploads/${req.file.filename}` }, message: 'Image uploaded' });
  });
});
export default router;
