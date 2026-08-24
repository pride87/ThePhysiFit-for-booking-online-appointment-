const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { authenticateUser } = require('../middleware/auth');

// GET /api/notifications
router.get('/notifications', authenticateUser, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'therapist') {
      query = { $or: [{ therapistId: req.user.therapistId }, { recipientRole: 'all' }] };
    } else if (req.user.role === 'admin') {
      query = { $or: [{ recipientRole: 'admin' }, { recipientRole: 'all' }] };
    }

    const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(20);
    return res.json({ success: true, notifications });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching notifications: ' + err.message });
  }
});

// PUT /api/notifications/:id/read
router.put('/notifications/:id/read', authenticateUser, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    return res.json({ success: true, notification });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error updating notification: ' + err.message });
  }
});

module.exports = router;
