const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error('❌ MONGO_URI is not configured in environment variables.');
    process.exit(1);
  }

  const dbName = process.env.DB_NAME || 'physiocare';

  try {
    const conn = await mongoose.connect(mongoUri, {
      dbName,
      serverSelectionTimeoutMS: 10000
    });

    console.log(`✅ MongoDB Connected successfully to database: '${conn.connection.name}' on host: '${conn.connection.host}'`);
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;