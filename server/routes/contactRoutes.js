const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');
const { authenticateUser, authorizeRole } = require('../middleware/auth');

// 1. PUBLIC: POST /api/contact (Submit Contact Form)
router.post('/contact', async (req, res) => {
  try {
    const { name, phone, email, message, assignedTherapist } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please enter name, email, and message.' });
    }

    const newMessage = await ContactMessage.create({
      name,
      phone: phone || '',
      email,
      message,
      assignedTherapist: assignedTherapist || null,
      status: 'New'
    });

    return res.status(201).json({
      success: true,
      message: 'Contact message submitted and saved in MongoDB.',
      contact: newMessage
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error submitting contact form: ' + err.message });
  }
});

// 2. GET /api/contact (Admin & Receptionist view all messages)
router.get('/contact', authenticateUser, authorizeRole('admin', 'receptionist'), async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    return res.json({ success: true, messages });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching messages: ' + err.message });
  }
});

// 3. THERAPIST API: GET /api/therapist/messages (Only messages assigned to logged-in therapist)
router.get('/therapist/messages', authenticateUser, authorizeRole('therapist', 'admin'), async (req, res) => {
  try {
    let targetTherapistId = req.user.therapistId;

    if (req.user.role === 'therapist') {
      if (!targetTherapistId) {
        return res.status(403).json({ success: false, message: 'No therapist profile linked to user.' });
      }
    } else if (req.user.role === 'admin' && req.query.therapistId) {
      targetTherapistId = req.query.therapistId;
    }

    const messages = await ContactMessage.find({ assignedTherapist: targetTherapistId }).sort({ createdAt: -1 });
    return res.json({ success: true, therapistId: targetTherapistId, messages });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching therapist messages: ' + err.message });
  }
});

// 4. PUT /api/contact/:id/assign (Admin assigns message to therapist)
router.put('/contact/:id/assign', authenticateUser, authorizeRole('admin', 'receptionist'), async (req, res) => {
  try {
    const { therapistId } = req.body;
    const msg = await ContactMessage.findById(req.params.id);

    if (!msg) {
      return res.status(404).json({ success: false, message: 'Contact message not found.' });
    }

    msg.assignedTherapist = therapistId || null;
    await msg.save();

    return res.json({ success: true, message: 'Message assigned to therapist successfully.', contact: msg });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error assigning message: ' + err.message });
  }
});

// 5. PUT /api/contact/:id/status (Mark Read or Responded)
router.put('/contact/:id/status', authenticateUser, authorizeRole('admin', 'receptionist', 'therapist'), async (req, res) => {
  try {
    const { status } = req.body;
    const msg = await ContactMessage.findById(req.params.id);

    if (!msg) {
      return res.status(404).json({ success: false, message: 'Contact message not found.' });
    }

    // Role check for therapist
    if (req.user.role === 'therapist' && msg.assignedTherapist !== req.user.therapistId) {
      return res.status(403).json({ success: false, message: 'Forbidden. Message is assigned to another therapist.' });
    }

    if (status) msg.status = status;
    await msg.save();

    return res.json({ success: true, message: `Message status updated to ${status}.`, contact: msg });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error updating message status: ' + err.message });
  }
});

// 6. DELETE /api/contact/:id (Admin protected)
router.delete('/contact/:id', authenticateUser, authorizeRole('admin'), async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!msg) {
      return res.status(404).json({ success: false, message: 'Contact message not found.' });
    }
    return res.json({ success: true, message: 'Contact message deleted.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error deleting message: ' + err.message });
  }
});

module.exports = router;
