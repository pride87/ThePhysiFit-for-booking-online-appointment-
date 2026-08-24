const User = require('../models/User');
const Therapist = require('../models/Therapist');
const Therapy = require('../models/Therapy');
const Condition = require('../models/Condition');
const Appointment = require('../models/Appointment');
const ContactMessage = require('../models/ContactMessage');
const Review = require('../models/Review');
const Setting = require('../models/Setting');

const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('🌱 Database already populated. Skipping seed.');
      return;
    }

    console.log('🌱 Database empty. Seeding demo accounts and medical data...');

    // 1. Create Admin Account
    const adminUser = await User.create({
      name: 'ADMINISTRATOR',
      email: 'admin@physiocare.com',
      password: 'admin123',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    });

    // 2. Create Receptionist Account
    const receptionUser = await User.create({
      name: 'RECEPTION DESK',
      email: 'reception@physiocare.com',
      password: 'reception123',
      role: 'receptionist',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
    });

    // 3. Create Seed Therapists & linked Therapist User Accounts
    const docData = [
      {
        id: 'doc-1',
        name: 'Dr. Rahul Sharma',
        email: 'rahul.sharma@physiocare.com',
        qualification: 'MPT – Orthopedic Physiotherapy',
        gender: 'Male',
        experience: 9,
        specialization: 'Orthopedic Rehabilitation & Spine Care',
        about: 'Dr. Rahul Sharma is a Senior Consultant Physiotherapist with over 9 years of clinical expertise specializing in spine alignment and chronic back pain management.',
        certifications: ['Certified Manual Therapist (CMP)', 'Dry Needling Specialist (IDN)'],
        languages: ['English', 'Hindi'],
        consultationFee: 70,
        rating: 4.9,
        reviewsCount: 48,
        photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        availableTime: '9:00 AM - 3:00 PM'
      },
      {
        id: 'doc-2',
        name: 'Dr. Ananya Patel',
        email: 'ananya.patel@physiocare.com',
        qualification: 'MPT – Sports Physiotherapy',
        gender: 'Female',
        experience: 7,
        specialization: 'Sports Injury & Athletic Conditioning',
        about: 'Dr. Ananya Patel has worked with elite athletes specializing in ACL reconstruction recovery and rotator cuff rehabilitation.',
        certifications: ['Certified Sports Physiotherapist (CSP)', 'Kinesiology Taping Expert'],
        languages: ['English', 'Hindi', 'Gujarati'],
        consultationFee: 75,
        rating: 4.9,
        reviewsCount: 36,
        photo: 'https://images.unsplash.com/photo-1594824813566-78853b0f2095?auto=format&fit=crop&w=600&q=80',
        availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
        availableTime: '10:00 AM - 5:00 PM'
      },
      {
        id: 'doc-3',
        name: 'Dr. Vikramaditya Rao',
        email: 'vikram.rao@physiocare.com',
        qualification: 'MPT – Neurological Rehabilitation',
        gender: 'Male',
        experience: 11,
        specialization: 'Neurological & Post-Stroke Rehab',
        about: 'Dr. Vikramaditya Rao possesses over a decade of experience treating nerve compression, sciatica, and stroke recovery.',
        certifications: ['Bobath Trained Therapist', 'PNF Rehabilitation Specialist'],
        languages: ['English', 'Hindi', 'Telugu'],
        consultationFee: 80,
        rating: 4.8,
        reviewsCount: 52,
        photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80',
        availableDays: ['Tuesday', 'Thursday', 'Friday', 'Saturday'],
        availableTime: '11:00 AM - 6:00 PM'
      }
    ];

    const createdTherapists = [];

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
        photo: d.photo,
        phone: '+1 (555) 234-5678',
        email: d.email,
        availableDays: d.availableDays,
        availableTime: d.availableTime
      });

      // Create linked User account for therapist login
      const tUser = await User.create({
        name: d.name,
        email: d.email,
        password: 'doctor123',
        role: 'therapist',
        therapistId: therapistDoc._id.toString(),
        avatar: d.photo
      });

      therapistDoc.userId = tUser._id;
      await therapistDoc.save();

      createdTherapists.push(therapistDoc);
    }

    console.log(`✅ Created ${createdTherapists.length} doctors with user login accounts.`);

    // 4. Seed Therapies
    const therapiesData = [
      {
        name: 'Dry Needling',
        description: 'Targeted myofascial trigger point therapy using fine acupuncture needles to release muscle tension.',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
        price: 75,
        discountPrice: 65,
        duration: '45 Mins',
        specialization: 'Orthopedic & Pain Management',
        suitableFor: ['Chronic Back Tightness', 'Myofascial Trigger Points', 'Neck Muscle Spasms'],
        benefits: ['Immediate release of muscle knots', 'Enhanced blood circulation'],
        precautions: 'Not recommended for acute bleeding disorders.'
      },
      {
        name: 'Chiropractic Care',
        description: 'Precision spinal alignment and joint mobilization techniques designed to relieve nerve compression.',
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
        price: 90,
        discountPrice: 80,
        duration: '40 Mins',
        specialization: 'Spine & Joint Alignment',
        suitableFor: ['Spinal Misalignment', 'Sciatica Nerve Pressure', 'Joint Stiffness'],
        benefits: ['Realignment of spinal vertebrae', 'Decompression of pinched nerves'],
        precautions: 'Requires imaging for severe osteoporosis.'
      },
      {
        name: 'Cupping Therapy',
        description: 'Traditional decompressive suction cup therapy that increases localized blood flow and releases tight fascia.',
        image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=800&q=80',
        price: 60,
        discountPrice: 50,
        duration: '35 Mins',
        specialization: 'Fascial & Soft Tissue Release',
        suitableFor: ['Tight Back Muscles', 'Athletic Recovery'],
        benefits: ['Fascial release', 'Enhanced lymphatic drainage'],
        precautions: 'May cause mild temporary skin marks.'
      },
      {
        name: 'TENS (Electrotherapy)',
        description: 'Non-invasive electrotherapy using low-voltage electrical currents to block pain signals.',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
        price: 50,
        discountPrice: 45,
        duration: '30 Mins',
        specialization: 'Pain Neuromodulation',
        suitableFor: ['Acute Nerve Pain', 'Post-Surgical Discomfort'],
        benefits: ['Effective drug-free pain relief'],
        precautions: 'Contraindicated for pacemakers.'
      },
      {
        name: 'Sports Rehabilitation',
        description: 'Advanced functional conditioning and return-to-sport protocols for athletes recovering from sprains.',
        image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
        price: 85,
        discountPrice: 75,
        duration: '60 Mins',
        specialization: 'Athletic Performance & Injury Recovery',
        suitableFor: ['ACL Sprains', 'Rotator Cuff Tears', 'Hamstring Strain'],
        benefits: ['Sport-specific movement retraining'],
        precautions: 'Requires clearance post-surgery.'
      }
    ];

    await Therapy.insertMany(therapiesData);

    // 5. Seed Conditions
    const conditionsData = [
      {
        name: 'Back Pain',
        iconName: 'Activity',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
        shortDescription: 'Physiotherapy approaches that may help improve spinal mobility and core stability.',
        fullDescription: 'Lower and upper back pain can stem from poor posture or strain. Targeted physiotherapy helps reduce discomfort.',
        recommendedTherapies: ['Dry Needling', 'Chiropractic Care', 'Cupping Therapy']
      },
      {
        name: 'Neck Pain',
        iconName: 'UserCheck',
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80',
        shortDescription: 'Assessment and rehabilitation approaches for cervical stiffness and tech-neck tension.',
        fullDescription: 'Cervical spine discomfort often results from prolonged screen time. Targeted techniques focus on neck mobilization.',
        recommendedTherapies: ['TENS', 'Dry Needling', 'Manual Therapy']
      },
      {
        name: 'Sports Injuries',
        iconName: 'Award',
        image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
        shortDescription: 'Rehabilitation support for sports sprains, muscle tears, and athletic activity injuries.',
        fullDescription: 'Athletes face ligament sprains and muscle strains. Structured sports physiotherapy supports tissue healing.',
        recommendedTherapies: ['Sports Rehabilitation', 'Cupping Therapy']
      }
    ];

    await Condition.insertMany(conditionsData);

    // 6. Seed Appointments (Linked to Dr. Rahul Sharma & Dr. Ananya Patel)
    const t1Id = createdTherapists[0]._id.toString();
    const t2Id = createdTherapists[1]._id.toString();

    await Appointment.create([
      {
        bookingId: 'PHY-2026-8901',
        patientName: 'Robert Taylor',
        phone: '+1 (555) 987-6543',
        email: 'robert.taylor@example.com',
        age: 42,
        gender: 'Male',
        condition: 'Back Pain',
        therapy: 'Dry Needling',
        therapistId: t1Id,
        therapistName: createdTherapists[0].name,
        appointmentDate: '2026-08-20',
        appointmentTime: '10:00 AM',
        status: 'Confirmed',
        notes: 'Chronic lower back stiffness post desk work.'
      },
      {
        bookingId: 'PHY-2026-8902',
        patientName: 'Amanda White',
        phone: '+1 (555) 876-5432',
        email: 'amanda.w@example.com',
        age: 29,
        gender: 'Female',
        condition: 'Sports Injuries',
        therapy: 'Sports Rehabilitation',
        therapistId: t2Id,
        therapistName: createdTherapists[1].name,
        appointmentDate: '2026-08-20',
        appointmentTime: '02:00 PM',
        status: 'Pending',
        notes: 'Hamstring strain during sprinting.'
      },
      {
        bookingId: 'PHY-2026-8903',
        patientName: 'Samuel Jackson',
        phone: '+1 (555) 765-4321',
        email: 'samuel.j@example.com',
        age: 58,
        gender: 'Male',
        condition: 'Back Pain',
        therapy: 'Chiropractic Care',
        therapistId: t1Id,
        therapistName: createdTherapists[0].name,
        appointmentDate: '2026-08-21',
        appointmentTime: '11:00 AM',
        status: 'Confirmed',
        notes: 'Spinal alignment consultation.'
      }
    ]);

    // 7. Seed Contact Messages (Assigned to Dr. Rahul Sharma & Unassigned)
    await ContactMessage.create([
      {
        name: 'Clara Benson',
        phone: '+1 (555) 432-1098',
        email: 'clara.b@example.com',
        message: 'I would like to discuss my chronic lower back pain with Dr. Rahul Sharma before booking my session.',
        assignedTherapist: t1Id,
        status: 'New'
      },
      {
        name: 'Marcus Vance',
        phone: '+1 (555) 321-0987',
        email: 'marcus.v@example.com',
        message: 'Do you accept health insurance for post-op knee physical therapy?',
        assignedTherapist: null,
        status: 'New'
      }
    ]);

    // 8. Seed Setting
    await Setting.create({
      clinicName: 'PhysioCare Clinic',
      logoText: 'PhysioCare',
      phone: '+1 (800) 555-7497',
      email: 'care@physiocareclinic.com',
      address: '104 Healthcare Boulevard, Suite 300, Medical District',
      hours: 'Mon - Sat: 8:00 AM - 8:00 PM | Sun: 9:00 AM - 2:00 PM',
      whatsapp: '+18005557497'
    });

    console.log('🎉 Database successfully seeded with demo accounts & medical data!');
  } catch (err) {
    console.error('❌ Error seeding database:', err.message);
  }
};

module.exports = seedDatabase;
