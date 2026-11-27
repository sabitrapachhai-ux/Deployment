import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  role: { type: String, required: true, trim: true },
  organization: { type: String, required: true, trim: true },
  startYear: { type: Number, required: true },
  endYear: { type: Number, default: null },
  description: { type: String, trim: true, default: '' },
  order: { type: Number, default: 0 },
}, { timestamps: true });
export default mongoose.model('Experience', schema);
