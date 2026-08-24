const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { authenticateUser } = require('../middleware/auth');

// Helper login handler
const handleUserLogin = async (req, res, targetRole = null) => {
  try {
    const inputIdentifier = req.body.userId || req.body.email || req.body.username;
    const { password } = req.body;

    if (!inputIdentifier || !password) {
      return res.status(400).json({ success: false, message: 'Please provide User ID / Email and password.' });
    }

    const cleanInput = inputIdentifier.trim();
    const user = await User.findOne({
      $or: [
        { userId: cleanInput },
        { email: cleanInput.toLowerCase() }
      ]
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid User ID or password.' });
    }

    if (targetRole && user.role.toLowerCase() !== targetRole.toLowerCase()) {
      return res.status(403).json({ success: false, message: `Access denied. Account is not registered as ${targetRole}.` });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid User ID or password.' });
    }

    const token = generateToken({
      id: user._id.toString(),
      role: user.role,
      therapistId: user.therapistId || null
    });

    return res.json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        userId: user.userId || user.email,
        name: user.name,
        email: user.email,
        role: user.role,
        therapistId: user.therapistId || null,
        avatar: user.avatar
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Login error: ' + err.message });
  }
};

// POST /api/auth/login
router.post('/login', (req, res) => handleUserLogin(req, res));

// POST /api/auth/admin/login
router.post('/admin/login', (req, res) => handleUserLogin(req, res, 'admin'));

// POST /api/auth/therapist/login
router.post('/therapist/login', (req, res) => handleUserLogin(req, res, 'therapist'));

// GET /api/auth/me
router.get('/me', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    return res.json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching profile: ' + err.message });
  }
});

module.exports = router;
