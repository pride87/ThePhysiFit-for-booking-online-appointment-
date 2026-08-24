const mongoose = require('mongoose');

const TherapistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    qualification: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
    experience: { type: Number, default: 5 },
    specialization: { type: String, required: true },
    about: { type: String },
    certifications: [{ type: String }],
    languages: [{ type: String }],
    consultationFee: { type: Number, default: 70 },
    rating: { type: Number, default: 5.0 },
    reviewsCount: { type: Number, default: 0 },
    photo: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    phone: { type: String },
    email: { type: String },
    availableDays: [{ type: String }],
    availableTime: { type: String, default: '9:00 AM - 5:00 PM' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Therapist', TherapistSchema);
