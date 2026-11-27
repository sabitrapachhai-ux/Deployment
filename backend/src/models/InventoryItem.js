import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, enum: ['screen', 'battery', 'charger', 'cable', 'case', 'strap', 'spare_part', 'accessory', 'other'] },
  brand: { type: String, trim: true, default: '' },
  compatibleWith: { type: String, trim: true, default: '' },
  sku: { type: String, required: true, unique: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 0, default: 0 },
  lowStockThreshold: { type: Number, min: 0, default: 3 },
  image: { type: String, default: '' },
  description: { type: String, trim: true, default: '' },
  isPublished: { type: Boolean, default: true },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

inventorySchema.virtual('stockStatus').get(function stockStatus() {
  if (this.quantity === 0) return 'out_of_stock';
  if (this.quantity <= this.lowStockThreshold) return 'low_stock';
  return 'in_stock';
});
export default mongoose.model('InventoryItem', inventorySchema);
