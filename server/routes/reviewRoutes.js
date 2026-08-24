const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { authenticateUser, authorizeRole } = require('../middleware/auth');

// GET /api/reviews
router.get('/reviews', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    return res.json({ success: true, reviews });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching reviews: ' + err.message });
  }
});

// POST /api/reviews (Public Patient Submission)
router.post('/reviews', async (req, res) => {
  try {
    const review = await Review.create(req.body);
    return res.status(201).json({ success: true, message: 'Review submitted for moderation.', review });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error submitting review: ' + err.message });
  }
});

// PUT /api/reviews/:id/approve
router.put('/reviews/:id/approve', authenticateUser, authorizeRole('admin', 'receptionist'), async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    return res.json({ success: true, message: 'Review approved.', review });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error approving review: ' + err.message });
  }
});

// PUT /api/reviews/:id/feature
router.put('/reviews/:id/feature', authenticateUser, authorizeRole('admin'), async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    review.isFeatured = !review.isFeatured;
    await review.save();
    return res.json({ success: true, message: 'Review featured state updated.', review });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error updating review feature state: ' + err.message });
  }
});

// DELETE /api/reviews/:id
router.delete('/reviews/:id', authenticateUser, authorizeRole('admin'), async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Review deleted.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error deleting review: ' + err.message });
  }
});

module.exports = router;
