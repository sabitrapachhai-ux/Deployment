import multer from 'multer';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ApiError from '../utils/ApiError.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const storage = multer.diskStorage({
  destination: path.resolve(__dirname, '../../uploads'),
  filename: (req, file, done) => {
    const safe = path.extname(file.originalname).toLowerCase();
    done(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${safe}`);
  },
});
const allowed = new Map([['.jpg', 'image/jpeg'], ['.jpeg', 'image/jpeg'], ['.png', 'image/png'], ['.webp', 'image/webp']]);

export default multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, done) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.has(ext) || allowed.get(ext) !== file.mimetype) {
      return done(new ApiError(400, 'Only JPG, PNG, or WebP images are allowed'));
    }
    done(null, true);
  },
}).single('image');
