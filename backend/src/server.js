import app from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/db.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';
import Repair from './models/Repair.js';
import InventoryItem from './models/InventoryItem.js';
import Service from './models/Service.js';
import Certificate from './models/Certificate.js';
import Experience from './models/Experience.js';
import Appreciation from './models/Appreciation.js';

async function start() {
  await connectDatabase();
  if (await User.countDocuments() === 0) {
    await User.create({ name: env.adminName, email: env.adminEmail, passwordHash: await bcrypt.hash(env.adminPassword, 12), role: 'admin' });
  }
  if (await Service.countDocuments() === 0) {
    await Service.insertMany([
      ['Mobile Phone Repair','[EDIT ME: Placeholder mobile repair service.]','mobile'],
      ['Smartwatch Repair','[EDIT ME: Placeholder smartwatch repair service.]','watch'],
      ['Rice Cooker Repair','[EDIT ME: Placeholder rice cooker repair service.]','rice-cooker'],
      ['Laptop Repair','[EDIT ME: Placeholder laptop repair service.]','laptop'],
      ['TV Repair','[EDIT ME: Placeholder television repair service.]','tv'],
      ['Accessories and Spare Parts','[EDIT ME: Placeholder parts and accessories service.]','parts'],
    ].map(([title, description, icon], order) => ({ title, description, icon, isActive: true, order })));
  }
  if (await Certificate.countDocuments() === 0) await Certificate.insertMany([1,2,3].map(order => ({ title:`[EDIT ME: Certificate title ${order}]`, issuedBy:'[EDIT ME: Issuing organization]', description:'[EDIT ME: Placeholder certificate description.]', image:'', order })));
  if (await Experience.countDocuments() === 0) await Experience.insertMany([1,2,3].map(order => ({ role:'[EDIT ME: Experience role]', organization:'[EDIT ME: Organization name]', startYear:2020+order, endYear:null, description:'[EDIT ME: Placeholder experience description.]', order })));
  if (await Appreciation.countDocuments() === 0) await Appreciation.insertMany([1,2,3].map(order => ({ authorName:`[EDIT ME: Customer ${order}]`, authorRole:'customer', message:'[EDIT ME: Placeholder appreciation message.]', rating:5, image:'', date:new Date(), isFeatured:order===1 })));
  const placeholderInventory = await InventoryItem.countDocuments({ sku: /^PLACEHOLDER-/ });
  if (placeholderInventory > 0) await InventoryItem.deleteMany({ sku: /^PLACEHOLDER-/ });
  if (await InventoryItem.countDocuments() === 0) {
    await InventoryItem.insertMany([
      { name:'TYCOON Smart Watch', category:'strap', brand:'TYCOON', sku:'WATCH-TYCOON-001', price:2500, quantity:8, lowStockThreshold:3, image:'/images/products/smart-watch.png', description:'Smart wearable watch for everyday use.', isPublished:true },
      { name:'Six Socket Extension Cable', category:'cable', brand:'SK GOLD', sku:'CABLE-SKGOLD-001', price:1800, quantity:6, lowStockThreshold:3, image:'/images/products/extension-cable.png', description:'Six-socket extension cable with individual switches.', isPublished:true },
      { name:'Charging Cable and Plug', category:'charger', brand:'Universal', sku:'CHARGER-CABLE-001', price:800, quantity:12, lowStockThreshold:3, image:'/images/products/charging-cable.png', description:'Charging cable and wall plug set.', isPublished:true },
      { name:'Power Adapter Set', category:'charger', brand:'Universal', sku:'ADAPTER-SET-001', price:1200, quantity:7, lowStockThreshold:3, image:'/images/products/adapters.png', description:'White and black wall power adapters.', isPublished:true },
      { name:'Wired Earphones', category:'accessory', brand:'Universal', sku:'EARPHONES-001', price:500, quantity:10, lowStockThreshold:3, image:'/images/products/wired-earphones.png', description:'Wired earphones with inline controls.', isPublished:true },
      { name:'Duracell Batteries', category:'battery', brand:'Duracell', sku:'BATTERY-DURACELL-001', price:900, quantity:15, lowStockThreshold:3, image:'/images/products/batteries.png', description:'Duracell Plus AA batteries.', isPublished:true },
      { name:'Classic Watch', category:'strap', brand:'Quartz', sku:'WATCH-CLASSIC-001', price:3200, quantity:5, lowStockThreshold:3, image:'/images/products/watch.png', description:'Classic wristwatch with metal strap.', isPublished:true },
      { name:'LED Bulb Pair', category:'other', brand:'Universal', sku:'BULB-PAIR-001', price:600, quantity:20, lowStockThreshold:3, image:'/images/products/bulbs.png', description:'Pair of standard LED bulbs.', isPublished:true },
    ]);
  }
  if (await Repair.countDocuments() === 0) {
    const statuses=['received','diagnosing','in_repair','waiting_for_parts','repaired','delivered','not_repairable'];
    const devices=['mobile','watch','rice_cooker','laptop','tv','other'];
    await Repair.insertMany(Array.from({length:10},(_,i)=>({ customerName:`[EDIT ME: Customer ${i+1}]`, customerPhone:'[EDIT ME: Phone]', deviceType:devices[i%devices.length], brand:'[EDIT ME: Brand]', model:'[EDIT ME: Model]', issueDescription:'[EDIT ME: Placeholder repair issue.]', repairStatus:statuses[i%statuses.length], estimatedCost:0, finalCost:0, advancePaid:0, receivedDate:new Date(), expectedDate:new Date(Date.now()+7*86400000), images:[], internalNotes:'[EDIT ME: Placeholder private notes.]' })));
  }
  app.listen(env.port, () => {
    console.log(`API listening on http://localhost:${env.port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start API:', error.message);
  process.exit(1);
});
