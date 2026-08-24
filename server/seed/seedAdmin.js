const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('../config/db');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminUserId = 'abhishek_rathor';
    const adminEmail = 'abhishek_rathor@physiocare.com';
    const adminPassword = 'Rathor@849';

    let admin = await User.findOne({
      $or: [{ userId: adminUserId }, { email: adminEmail }]
    });

    if (admin) {
      admin.name = 'Abhishek Rathor';
      admin.userId = adminUserId;
      admin.email = adminEmail;
      admin.password = adminPassword; // Triggers bcrypt pre-save hashing
      admin.role = 'admin';
      await admin.save();
      console.log('✅ Admin account (abhishek_rathor) updated in MongoDB.');
    } else {
      admin = await User.create({
        name: 'Abhishek Rathor',
        userId: adminUserId,
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      });
      console.log('🎉 Seed Admin created successfully (abhishek_rathor / Rathor@849).');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding admin user:', err.message);
    process.exit(1);
  }
};

seedAdmin();
