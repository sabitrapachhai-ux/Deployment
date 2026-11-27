import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  authorName: { type: String, required: true, trim: true },
  authorRole: { type: String, trim: true, default: 'customer' },
  message: { type: String, required: true, trim: true },
  rating: { type: Number, min: 1, max: 5 },
  image: { type: String, default: '' },
  date: { type: Date, default: Date.now },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });
export default mongoose.model('Appreciation', schema);
