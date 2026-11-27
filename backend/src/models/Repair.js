import mongoose from 'mongoose';
import generateTrackingCode from '../utils/generateTrackingCode.js';

const repairStatus = ['received', 'diagnosing', 'in_repair', 'waiting_for_parts', 'repaired', 'delivered', 'not_repairable'];
const repairSchema = new mongoose.Schema({
  trackingCode: { type: String, required: true, unique: true, default: generateTrackingCode },
  customerName: { type: String, required: true, trim: true },
  customerPhone: { type: String, required: true, trim: true },
  deviceType: { type: String, required: true, enum: ['mobile', 'watch', 'rice_cooker', 'laptop', 'tv', 'other'] },
  brand: { type: String, required: true, trim: true },
  model: { type: String, required: true, trim: true },
  issueDescription: { type: String, required: true, trim: true },
  repairStatus: { type: String, required: true, enum: repairStatus, default: 'received' },
  isRepaired: { type: Boolean, default: false },
  estimatedCost: { type: Number, default: 0, min: 0 },
  finalCost: { type: Number, default: 0, min: 0 },
  advancePaid: { type: Number, default: 0, min: 0 },
  receivedDate: { type: Date, default: Date.now },
  expectedDate: { type: Date },
  completedDate: { type: Date },
  images: [{ type: String }],
  internalNotes: { type: String, trim: true, default: '' },
}, { timestamps: true });

repairSchema.pre('validate', function deriveRepaired(next) {
  this.isRepaired = ['repaired', 'delivered'].includes(this.repairStatus);
  next();
});
repairSchema.index({ repairStatus: 1, deviceType: 1, customerName: 'text', customerPhone: 'text' });
export default mongoose.model('Repair', repairSchema);
