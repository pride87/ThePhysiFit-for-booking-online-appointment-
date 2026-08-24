const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/physiocare';
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log('MongoDB Connected: physiocare');
  } catch (err) {
    console.warn('⚠️ Local MongoDB daemon not reachable on 27017, attempting MongoMemoryServer fallback...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log('MongoDB Connected: physiocare (in-memory fallback)');
    } catch (fallbackErr) {
      console.error('❌ Failed to connect to MongoDB:', fallbackErr.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
