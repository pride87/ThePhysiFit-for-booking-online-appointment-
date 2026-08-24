const express = require('express');
const router = express.Router();
const Condition = require('../models/Condition');
const { authenticateUser, authorizeRole } = require('../middleware/auth');

// GET /api/conditions
router.get('/conditions', async (req, res) => {
  try {
    const conditions = await Condition.find().sort({ createdAt: -1 });
    return res.json({ success: true, conditions });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching conditions: ' + err.message });
  }
});

// POST /api/conditions (Admin)
router.post('/conditions', authenticateUser, authorizeRole('admin'), async (req, res) => {
  try {
    const condition = await Condition.create(req.body);
    return res.status(201).json({ success: true, condition });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error creating condition: ' + err.message });
  }
});

// PUT /api/conditions/:id (Admin)
router.put('/conditions/:id', authenticateUser, authorizeRole('admin'), async (req, res) => {
  try {
    const condition = await Condition.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json({ success: true, condition });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error updating condition: ' + err.message });
  }
});

// DELETE /api/conditions/:id (Admin)
router.delete('/conditions/:id', authenticateUser, authorizeRole('admin'), async (req, res) => {
  try {
    await Condition.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Condition deleted.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error deleting condition: ' + err.message });
  }
});

module.exports = router;
