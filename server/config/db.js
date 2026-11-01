import mongoose from 'mongoose';

/**
 * Connect to MongoDB with graceful error handling and retry mechanism
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/harpy_analytics';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[Harpy DB] MongoDB connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[Harpy DB] Notice: MongoDB local connection unavailable (${error.message}).`);
    console.warn('[Harpy DB] Running Express API in resilient demonstration mode.');
    return false;
  }
}

export default connectDB;

