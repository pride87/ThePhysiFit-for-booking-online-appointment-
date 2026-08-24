const express = require('express');
const router = express.Router();
const Therapist = require('../models/Therapist');
const User = require('../models/User');
const { authenticateUser, authorizeRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

// POST /api/upload (Upload single image file -> returns URL path)
router.post('/upload', authenticateUser, authorizeRole('admin', 'therapist'), upload.single('photo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded.' });
    }
    const photoUrl = `/uploads/${req.file.filename}`;
    return res.json({ success: true, photoUrl });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Upload error: ' + err.message });
  }
});

// GET /api/therapist/profile (Authenticated Therapist Profile)
router.get('/therapist/profile', authenticateUser, authorizeRole('therapist', 'admin'), async (req, res) => {
  try {
    const therapistId = req.user.therapistId;
    if (!therapistId) {
      return res.status(403).json({ success: false, message: 'No therapist profile linked to this account.' });
    }
    const therapist = await Therapist.findById(therapistId);
    if (!therapist) return res.status(404).json({ success: false, message: 'Therapist profile not found.' });
    return res.json({ success: true, therapist });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching therapist profile: ' + err.message });
  }
});

// GET /api/therapists (Public - return active/all)
router.get('/therapists', async (req, res) => {
  try {
    const therapists = await Therapist.find().sort({ createdAt: -1 });
    return res.json({ success: true, therapists });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching therapists: ' + err.message });
  }
});

// GET /api/therapists/:id (Public)
router.get('/therapists/:id', async (req, res) => {
  try {
    const therapist = await Therapist.findById(req.params.id);
    if (!therapist) return res.status(404).json({ success: false, message: 'Therapist not found.' });
    return res.json({ success: true, therapist });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching therapist profile: ' + err.message });
  }
});

// POST /api/therapists (Admin: Create therapist + linked User login account, supports photo upload or body photo string)
router.post('/therapists', authenticateUser, authorizeRole('admin'), upload.single('photoFile'), async (req, res) => {
  try {
    const { name, email, password, qualification, gender, experience, specialization, about, certifications, languages, consultationFee, photo, availableDays, availableTime, status, phone } = req.body;

    if (!name || !qualification || !specialization) {
      return res.status(400).json({ success: false, message: 'Required therapist fields missing.' });
    }

    let finalPhoto = photo || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80';
    if (req.file) {
      finalPhoto = `/uploads/${req.file.filename}`;
    }

    const therapistDoc = await Therapist.create({
      name,
      qualification,
      gender: gender || 'Male',
      experience: parseInt(experience, 10) || 5,
      specialization,
      about: about || '',
      certifications: Array.isArray(certifications) ? certifications : (certifications || '').split(',').map(s => s.trim()).filter(Boolean),
      languages: Array.isArray(languages) ? languages : (languages || '').split(',').map(s => s.trim()).filter(Boolean),
      consultationFee: parseInt(consultationFee, 10) || 70,
      photo: finalPhoto,
      phone: phone || '+1 (555) 000-0000',
      email: email || `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@physiocare.com`,
      availableDays: Array.isArray(availableDays) ? availableDays : (availableDays || '').split(',').map(s => s.trim()).filter(Boolean),
      availableTime: availableTime || '9:00 AM - 5:00 PM',
      status: status || 'active'
    });

    // Create therapist user account for therapist login
    const userEmail = (email || `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@physiocare.com`).toLowerCase();
    const therapistUserIdVal = req.body.therapistUserId || req.body.userId || userEmail.split('@')[0];

    let existingUser = await User.findOne({
      $or: [{ email: userEmail }, { userId: therapistUserIdVal }]
    });

    if (!existingUser) {
      const userDoc = await User.create({
        name,
        userId: therapistUserIdVal,
        email: userEmail,
        password: password || 'doctor123',
        role: 'therapist',
        therapistId: therapistDoc._id.toString(),
        avatar: therapistDoc.photo
      });
      therapistDoc.userId = userDoc._id;
      await therapistDoc.save();
    } else {
      existingUser.therapistId = therapistDoc._id.toString();
      existingUser.userId = therapistUserIdVal;
      if (password) existingUser.password = password;
      await existingUser.save();
      therapistDoc.userId = existingUser._id;
      await therapistDoc.save();
    }

    return res.status(201).json({ success: true, message: 'Therapist created successfully.', therapist: therapistDoc });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error creating therapist: ' + err.message });
  }
});

// PUT /api/therapists/:id (Admin or Therapist updating own profile)
router.put('/therapists/:id', authenticateUser, authorizeRole('admin', 'therapist'), upload.single('photoFile'), async (req, res) => {
  try {
    const therapistId = req.params.id;

    if (req.user.role === 'therapist' && req.user.therapistId !== therapistId) {
      return res.status(403).json({ success: false, message: 'Forbidden. You can only edit your own profile.' });
    }

    const therapist = await Therapist.findById(therapistId);
    if (!therapist) return res.status(404).json({ success: false, message: 'Therapist not found.' });

    const updates = { ...req.body };
    if (req.file) {
      updates.photo = `/uploads/${req.file.filename}`;
    }

    if (updates.certifications && !Array.isArray(updates.certifications)) {
      updates.certifications = updates.certifications.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (updates.languages && !Array.isArray(updates.languages)) {
      updates.languages = updates.languages.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (updates.availableDays && !Array.isArray(updates.availableDays)) {
      updates.availableDays = updates.availableDays.split(',').map(s => s.trim()).filter(Boolean);
    }

    if (req.user.role === 'therapist') {
      delete updates.qualification;
      delete updates.consultationFee;
      delete updates.status;
    }

    Object.assign(therapist, updates);
    await therapist.save();

    return res.json({ success: true, message: 'Therapist profile updated.', therapist });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error updating therapist: ' + err.message });
  }
});

// PUT /api/therapists/:id/availability (Update availability days/time)
router.put('/therapists/:id/availability', authenticateUser, authorizeRole('admin', 'therapist'), async (req, res) => {
  try {
    const { availableDays, availableTime } = req.body;
    const therapist = await Therapist.findById(req.params.id);

    if (!therapist) return res.status(404).json({ success: false, message: 'Therapist not found.' });

    if (req.user.role === 'therapist' && req.user.therapistId !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Forbidden. Cannot edit another therapist\'s availability.' });
    }

    if (availableDays) {
      therapist.availableDays = Array.isArray(availableDays) ? availableDays : availableDays.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (availableTime) therapist.availableTime = availableTime;

    await therapist.save();
    return res.json({ success: true, message: 'Availability schedule updated.', therapist });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error updating availability: ' + err.message });
  }
});

// DELETE /api/therapists/:id (Admin protected)
router.delete('/therapists/:id', authenticateUser, authorizeRole('admin'), async (req, res) => {
  try {
    const therapist = await Therapist.findByIdAndDelete(req.params.id);
    if (!therapist) return res.status(404).json({ success: false, message: 'Therapist not found.' });

    if (therapist.userId) {
      await User.findByIdAndDelete(therapist.userId);
    }

    return res.json({ success: true, message: 'Therapist deleted.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error deleting therapist: ' + err.message });
  }
});

module.exports = router;
