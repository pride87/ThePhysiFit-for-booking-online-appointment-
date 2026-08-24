const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema(
  {
    clinicName: { type: String, default: 'PhysioCare Clinic' },
    logoText: { type: String, default: 'PhysioCare' },
    phone: { type: String, default: '+1 (800) 555-7497' },
    email: { type: String, default: 'care@physiocareclinic.com' },
    address: { type: String, default: '104 Healthcare Boulevard, Suite 300, Medical District, NY 10001' },
    hours: { type: String, default: 'Mon - Sat: 8:00 AM - 8:00 PM | Sun: 9:00 AM - 2:00 PM' },
    whatsapp: { type: String, default: '+18005557497' },
    heroHeading: { type: String, default: 'Move Better. Feel Better. Live Better.' },
    heroSubtitle: { type: String, default: 'Personalized physiotherapy care from qualified and experienced professionals.' },
    aboutText: { type: String },
    footerTagline: { type: String, default: 'Restoring movement, strength, and confidence with personalized evidence-based physical therapy.' },
    socials: {
      instagram: { type: String, default: 'https://instagram.com/physiocare' },
      facebook: { type: String, default: 'https://facebook.com/physiocare' },
      linkedin: { type: String, default: 'https://linkedin.com/company/physiocare' },
      youtube: { type: String, default: 'https://youtube.com/c/physiocare' }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Setting', SettingSchema);
