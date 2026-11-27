import { Router } from 'express';
import Repair from '../models/Repair.js';
import InventoryItem from '../models/InventoryItem.js';
import Message from '../models/Message.js';
import { requireAuth } from '../middleware/auth.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = Router();
router.use(requireAuth);
router.get('/', asyncHandler(async (req, res) => {
  const statuses = ['received','diagnosing','in_repair','waiting_for_parts','repaired','delivered','not_repairable'];
  const repairCounts = await Promise.all(statuses.map((status) => Repair.countDocuments({ repairStatus: status })));
  const inventory = await InventoryItem.find();
  const stockCounts = inventory.reduce((counts, item) => {
    counts[item.stockStatus] += 1;
    return counts;
  }, { in_stock: 0, low_stock: 0, out_of_stock: 0 });
  const unreadMessages = await Message.countDocuments({ isRead: false });
  const today = new Date(); today.setHours(0, 0, 0, 0);
  res.json({ success: true, data: {
    totalJobs: await Repair.countDocuments(),
    repairStatusCounts: Object.fromEntries(statuses.map((status, index) => [status, repairCounts[index]])),
    stockStatusCounts: stockCounts,
    unreadMessages,
    repairedToday: await Repair.countDocuments({ isRepaired: true, completedDate: { $gte: today } }),
  }, message: 'Statistics retrieved' });
}));
export default router;
