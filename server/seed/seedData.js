const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('../config/db');
const User = require('../models/User');
const Therapist = require('../models/Therapist');
const Therapy = require('../models/Therapy');
const Condition = require('../models/Condition');
const Appointment = require('../models/Appointment');
const ContactMessage = require('../models/ContactMessage');
const Review = require('../models/Review');
const Setting = require('../models/Setting');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('🌱 Seeding database collections for ThePhysiFit...');

    // Force update existing therapies to ₹700 price
    await Therapy.updateMany({}, { $set: { price: 700, discountPrice: 700 } });

    // 1. Seed Therapies if empty
    const therapyCount = await Therapy.countDocuments();
    if (therapyCount === 0) {
      const therapiesData = [
        {
          name: 'Dry Needling',
          description: 'Targeted myofascial trigger point therapy using fine acupuncture needles to release muscle tension.',
          image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
          price: 700,
          discountPrice: 700,
          duration: '45 Mins',
          status: 'active',
          specialization: 'Orthopedic & Pain Management',
          suitableFor: ['Chronic Back Tightness', 'Myofascial Trigger Points', 'Neck Muscle Spasms'],
          benefits: ['Immediate release of muscle knots', 'Enhanced blood circulation'],
          precautions: 'Not recommended for acute bleeding disorders.'
        },
        {
          name: 'Chiropractic Care',
          description: 'Precision spinal alignment and joint mobilization techniques designed to relieve nerve compression.',
          image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
          price: 700,
          discountPrice: 700,
          duration: '40 Mins',
          status: 'active',
          specialization: 'Spine & Joint Alignment',
          suitableFor: ['Spinal Misalignment', 'Sciatica Nerve Pressure', 'Joint Stiffness'],
          benefits: ['Realignment of spinal vertebrae', 'Decompression of pinched nerves'],
          precautions: 'Requires imaging for severe osteoporosis.'
        },
        {
          name: 'Cupping Therapy',
          description: 'Traditional decompressive suction cup therapy that increases localized blood flow and releases tight fascia.',
          image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=800&q=80',
          price: 700,
          discountPrice: 700,
          duration: '35 Mins',
          status: 'active',
          specialization: 'Fascial & Soft Tissue Release',
          suitableFor: ['Tight Back Muscles', 'Athletic Recovery'],
          benefits: ['Fascial release', 'Enhanced lymphatic drainage'],
          precautions: 'May cause mild temporary skin marks.'
        },
        {
          name: 'TENS (Electrotherapy)',
          description: 'Non-invasive electrotherapy using low-voltage electrical currents to block pain signals.',
          image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
          price: 700,
          discountPrice: 700,
          duration: '30 Mins',
          status: 'active',
          specialization: 'Pain Neuromodulation',
          suitableFor: ['Acute Nerve Pain', 'Post-Surgical Discomfort'],
          benefits: ['Effective drug-free pain relief'],
          precautions: 'Contraindicated for pacemakers.'
        },
        {
          name: 'Sports Rehabilitation',
          description: 'Advanced functional conditioning and return-to-sport protocols for athletes recovering from sprains.',
          image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
          price: 700,
          discountPrice: 700,
          duration: '60 Mins',
          status: 'active',
          specialization: 'Athletic Performance & Injury Recovery',
          suitableFor: ['ACL Sprains', 'Rotator Cuff Tears', 'Hamstring Strain'],
          benefits: ['Sport-specific movement retraining'],
          precautions: 'Requires clearance post-surgery.'
        }
      ];
      await Therapy.insertMany(therapiesData);
      console.log('✅ Seeded Therapies with ₹700 rate');
    }

    // 2. Seed Conditions if empty
    const conditionCount = await Condition.countDocuments();
    if (conditionCount === 0) {
      const conditionsData = [
        {
          name: 'Back Pain',
          iconName: 'Activity',
          status: 'active',
          image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
          shortDescription: 'Physiotherapy approaches that may help improve spinal mobility and core stability.',
          fullDescription: 'Lower and upper back pain can stem from poor posture or strain. Targeted physiotherapy helps reduce discomfort.',
          recommendedTherapies: ['Dry Needling', 'Chiropractic Care', 'Cupping Therapy']
        },
        {
          name: 'Neck Pain',
          iconName: 'UserCheck',
          status: 'active',
          image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
          shortDescription: 'Assessment and rehabilitation approaches for cervical stiffness and tech-neck tension.',
          fullDescription: 'Cervical spine discomfort often results from prolonged screen time. Targeted techniques focus on neck mobilization.',
          recommendedTherapies: ['TENS', 'Dry Needling', 'Manual Therapy']
        },
        {
          name: 'Sports Injuries',
          iconName: 'Award',
          status: 'active',
          image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
          shortDescription: 'Rehabilitation support for sports sprains, muscle tears, and athletic activity injuries.',
          fullDescription: 'Athletes face ligament sprains and muscle strains. Structured sports physiotherapy supports tissue healing.',
          recommendedTherapies: ['Sports Rehabilitation', 'Cupping Therapy']
        }
      ];
      await Condition.insertMany(conditionsData);
      console.log('✅ Seeded Conditions');
    }

    // 3. Seed Therapists if empty
    const therapistCount = await Therapist.countDocuments();
    if (therapistCount === 0) {
      const docData = [
        {
          name: 'Dr. Rahul Sharma',
          email: 'rahul.sharma@thephysifit.com',
          qualification: 'MPT – Orthopedic Physiotherapy',
          gender: 'Male',
          experience: 9,
          specialization: 'Orthopedic Rehabilitation & Spine Care',
          about: 'Dr. Rahul Sharma is a Senior Consultant Physiotherapist with over 9 years of clinical expertise specializing in spine alignment and chronic back pain management.',
          certifications: ['Certified Manual Therapist (CMP)', 'Dry Needling Specialist (IDN)'],
          languages: ['English', 'Hindi'],
          consultationFee: 700,
          rating: 4.9,
          reviewsCount: 48,
          status: 'active',
          photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
          availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          availableTime: '9:00 AM - 3:00 PM'
        },
        {
          name: 'Dr. Ananya Patel',
          email: 'ananya.patel@thephysifit.com',
          qualification: 'MPT – Sports Physiotherapy',
          gender: 'Female',
          experience: 7,
          specialization: 'Sports Injury & Athletic Conditioning',
          about: 'Dr. Ananya Patel has worked with elite athletes specializing in ACL reconstruction recovery and rotator cuff rehabilitation.',
          certifications: ['Certified Sports Physiotherapist (CSP)', 'Kinesiology Taping Expert'],
          languages: ['English', 'Hindi', 'Gujarati'],
          consultationFee: 700,
          rating: 4.9,
          reviewsCount: 36,
          status: 'active',
          photo: 'https://images.unsplash.com/photo-1594824813566-78853b0f2095?auto=format&fit=crop&w=600&q=80',
          availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
          availableTime: '10:00 AM - 5:00 PM'
        }
      ];

      for (const d of docData) {
        const therapistDoc = await Therapist.create({
          name: d.name,
          qualification: d.qualification,
          gender: d.gender,
          experience: d.experience,
          specialization: d.specialization,
          about: d.about,
          certifications: d.certifications,
          languages: d.languages,
          consultationFee: d.consultationFee,
          rating: d.rating,
          reviewsCount: d.reviewsCount,
          status: 'active',
          photo: d.photo,
          phone: '7065411520',
          email: d.email,
          availableDays: d.availableDays,
          availableTime: d.availableTime
        });

        const therapistUserId = d.email.split('@')[0];
        const tUser = await User.create({
          name: d.name,
          userId: therapistUserId,
          email: d.email,
          password: 'doctor123',
          role: 'therapist',
          therapistId: therapistDoc._id.toString(),
          avatar: d.photo
        });

        therapistDoc.userId = tUser._id;
        await therapistDoc.save();
      }
      console.log('✅ Seeded Therapists & User Accounts');
    }

    // 4. Seed Settings if empty
    const settingCount = await Setting.countDocuments();
    if (settingCount === 0) {
      await Setting.create({
        clinicName: 'ThePhysiFit Clinic',
        logoText: 'ThePhysiFit',
        phone: '7065411520',
        email: 'care@thephysifit.com',
        address: '104 Healthcare Boulevard, Suite 300, Medical District',
        hours: 'Mon - Sat: 8:00 AM - 8:00 PM | Sun: 9:00 AM - 2:00 PM',
        whatsapp: '7065411520'
      });
      console.log('✅ Seeded Settings');
    }

    console.log('🎉 Database setup complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err.message);
    process.exit(1);
  }
};

seedDatabase();
