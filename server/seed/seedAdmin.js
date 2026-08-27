const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('../config/db');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminUserId = process.env.ADMIN_USER_ID || process.env.ADMIN_ID || 'admin';
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@physiocare.com').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
    const adminName = process.env.ADMIN_NAME || 'Admin User';

    let admin = await User.findOne({
      $or: [
        { userId: adminUserId },
        { userId: adminUserId.toLowerCase() },
        { email: adminEmail }
      ]
    });

    if (admin) {
      admin.name = adminName;
      admin.userId = adminUserId;
      admin.email = adminEmail;
      admin.password = adminPassword; // Triggers bcrypt pre-save hashing
      admin.role = 'admin';
      await admin.save();
      console.log(`✅ Admin account (${adminUserId}) updated successfully in database.`);
    } else {
      admin = new User({
        name: adminName,
        userId: adminUserId,
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      });
      await admin.save();
      console.log(`🎉 Seed Admin created successfully (${adminUserId} / ${adminEmail}).`);
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding admin user:', err.message);
    process.exit(1);
  }
};

seedAdmin();
