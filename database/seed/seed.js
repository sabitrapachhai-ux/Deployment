import mongoose from '../../backend/node_modules/mongoose/index.js';
import bcrypt from 'bcryptjs';
import { MongoMemoryServer } from 'mongodb-memory-server';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../backend/.env') });
const uri = process.env.MONGODB_URI && process.env.MONGODB_URI !== 'mongodb://127.0.0.1:27017/repair_shop'
  ? process.env.MONGODB_URI
  : undefined;
let memory;
if (!uri) {
  memory = await MongoMemoryServer.create();
  await mongoose.connect(memory.getUri());
} else {
  await mongoose.connect(uri);
}

const { default: User } = await import('../../backend/src/models/User.js');
const { default: Repair } = await import('../../backend/src/models/Repair.js');
const { default: InventoryItem } = await import('../../backend/src/models/InventoryItem.js');
const { default: Service } = await import('../../backend/src/models/Service.js');
const { default: Certificate } = await import('../../backend/src/models/Certificate.js');
const { default: Experience } = await import('../../backend/src/models/Experience.js');
const { default: Appreciation } = await import('../../backend/src/models/Appreciation.js');
const { default: Message } = await import('../../backend/src/models/Message.js');

await Promise.all([User.deleteMany(), Repair.deleteMany(), InventoryItem.deleteMany(), Service.deleteMany(), Certificate.deleteMany(), Experience.deleteMany(), Appreciation.deleteMany(), Message.deleteMany()]);

const adminPassword = process.env.ADMIN_PASSWORD || 'change-this-password';
await User.create({
  name: process.env.ADMIN_NAME || '[EDIT ME: Owner name]',
  email: process.env.ADMIN_EMAIL || 'admin@example.com',
  passwordHash: await bcrypt.hash(adminPassword, 12),
  role: 'admin',
});

await Service.insertMany([
  ['Mobile Phone Repair','[EDIT ME: Placeholder mobile repair service.]','mobile',null],
  ['Smartwatch Repair','[EDIT ME: Placeholder smartwatch repair service.]','watch',null],
  ['Rice Cooker Repair','[EDIT ME: Placeholder rice cooker repair service.]','rice-cooker',null],
  ['Laptop Repair','[EDIT ME: Placeholder laptop repair service.]','laptop',null],
  ['TV Repair','[EDIT ME: Placeholder television repair service.]','tv',null],
  ['Accessories and Spare Parts','[EDIT ME: Placeholder parts and accessories service.]','parts',null],
].map(([title,description,icon,startingPrice],order)=>({title,description,icon,startingPrice,isActive:true,order})));

await Certificate.insertMany([1,2,3].map((n)=>({
  title:`[EDIT ME: Certificate title ${n}]`, issuedBy:'[EDIT ME: Issuing organization]',
  issueDate:null, description:'[EDIT ME: Placeholder certificate description.]',
  image:'', order:n,
})));

await Experience.insertMany([1,2,3].map((n)=>({
  role:'[EDIT ME: Experience role]', organization:'[EDIT ME: Organization name]',
  startYear:2020+n,endYear:null,description:'[EDIT ME: Placeholder experience description.]',order:n,
})));

await Appreciation.insertMany([1,2,3].map((n)=>({
  authorName:`[EDIT ME: Customer ${n}]`, authorRole:'customer',
  message:'[EDIT ME: Placeholder appreciation message.]', rating:5,
  image:'',date:new Date(),isFeatured:n===1,
})));

const categories=['screen','battery','charger','cable','case','strap','spare_part','accessory','other'];
const inventory=[];
for (let i=1;i<=12;i++) inventory.push({
  name:`[EDIT ME: Product ${i}]`, category:categories[(i-1)%categories.length],
  brand:'[EDIT ME: Brand]', compatibleWith:'[EDIT ME: Compatible model]',
  sku:`PLACEHOLDER-${String(i).padStart(3,'0')}`, price:0,
  quantity:i%4===0?0:i%3===0?2:10, lowStockThreshold:3,
  image:'',description:'[EDIT ME: Placeholder product description.]',isPublished:true,
});
await InventoryItem.insertMany(inventory);

const statuses=['received','diagnosing','in_repair','waiting_for_parts','repaired','delivered','not_repairable'];
const devices=['mobile','watch','rice_cooker','laptop','tv','other'];
for (let i=0;i<10;i++) await Repair.create({
  customerName:`[EDIT ME: Customer ${i+1}]`, customerPhone:'[EDIT ME: Phone]',
  deviceType:devices[i%devices.length],brand:'[EDIT ME: Brand]',model:'[EDIT ME: Model]',
  issueDescription:'[EDIT ME: Placeholder repair issue.]',repairStatus:statuses[i%statuses.length],
  estimatedCost:0,finalCost:0,advancePaid:0,receivedDate:new Date(),
  expectedDate:i<8?new Date(Date.now()+7*86400000):null,completedDate:['repaired','delivered'].includes(statuses[i%statuses.length])?new Date():null,
  images:[],internalNotes:'[EDIT ME: Placeholder private notes.]',
});

console.log('Seed complete');
console.log(`Admin: ${process.env.ADMIN_EMAIL || 'admin@example.com'} / ${adminPassword}`);
await mongoose.disconnect();
if (memory) await memory.stop();
