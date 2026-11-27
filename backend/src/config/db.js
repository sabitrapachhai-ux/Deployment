import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDatabase() {
  mongoose.set('strictQuery', true);
  let uri = env.mongoUri;
  if (process.env.NODE_ENV !== 'production' && (!process.env.MONGODB_URI || process.env.MONGODB_URI === 'mongodb://127.0.0.1:27017/repair_shop')) {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const memory = await MongoMemoryServer.create();
    uri = memory.getUri();
  }
  await mongoose.connect(uri);
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
}
