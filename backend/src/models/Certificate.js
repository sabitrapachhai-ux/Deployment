import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  issuedBy: { type: String, required: true, trim: true },
  issueDate: { type: Date },
  description: { type: String, trim: true, default: '' },
  image: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { timestamps: true });
export default mongoose.model('Certificate', schema);
