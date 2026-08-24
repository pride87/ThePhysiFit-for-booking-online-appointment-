const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true },
    date: { type: String, default: () => new Date().toISOString().split('T')[0] },
    therapyName: { type: String },
    therapistName: { type: String },
    therapistId: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    isFeatured: { type: Boolean, default: false },
    avatar: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', ReviewSchema);
