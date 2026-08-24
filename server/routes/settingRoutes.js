const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const { authenticateUser, authorizeRole } = require('../middleware/auth');

// GET /api/settings
router.get('/settings', async (req, res) => {
  try {
    let setting = await Setting.findOne();
    if (!setting) {
      setting = await Setting.create({});
    }
    return res.json({ success: true, settings: setting });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching settings: ' + err.message });
  }
});

// PUT /api/settings (Admin)
router.put('/settings', authenticateUser, authorizeRole('admin'), async (req, res) => {
  try {
    let setting = await Setting.findOne();
    if (!setting) {
      setting = new Setting(req.body);
    } else {
      Object.assign(setting, req.body);
    }
    await setting.save();
    return res.json({ success: true, message: 'Settings updated.', settings: setting });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error updating settings: ' + err.message });
  }
});

module.exports = router;
