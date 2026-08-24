const express = require('express');
const router = express.Router();
const Therapy = require('../models/Therapy');
const { authenticateUser, authorizeRole } = require('../middleware/auth');

// GET /api/therapies
router.get('/therapies', async (req, res) => {
  try {
    const therapies = await Therapy.find().sort({ createdAt: -1 });
    return res.json({ success: true, therapies });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching therapies: ' + err.message });
  }
});

// POST /api/therapies (Admin)
router.post('/therapies', authenticateUser, authorizeRole('admin'), async (req, res) => {
  try {
    const therapy = await Therapy.create(req.body);
    return res.status(201).json({ success: true, therapy });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error creating therapy: ' + err.message });
  }
});

// PUT /api/therapies/:id (Admin)
router.put('/therapies/:id', authenticateUser, authorizeRole('admin'), async (req, res) => {
  try {
    const therapy = await Therapy.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json({ success: true, therapy });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error updating therapy: ' + err.message });
  }
});

// DELETE /api/therapies/:id (Admin)
router.delete('/therapies/:id', authenticateUser, authorizeRole('admin'), async (req, res) => {
  try {
    await Therapy.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Therapy deleted.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error deleting therapy: ' + err.message });
  }
});

module.exports = router;
