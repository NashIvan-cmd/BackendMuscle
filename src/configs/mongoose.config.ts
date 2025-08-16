import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) throw new Error('MONGO_URI env var is not defined');

  await mongoose.connect(mongoUri);
  console.log('✅ MongoDB connected');
}

export const localConnectDB = async () => {
  try {
    const mongoUri = process.env.LOCAL_MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI environment variable is not defined');
    }
    
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

export const closeDB = async () => {
  await mongoose.connection.close();
  console.log('✅ Database connection closed');
};

// Mongoose DB will automatically try to establish connection
// Mongoose will automatically create your table if not existed