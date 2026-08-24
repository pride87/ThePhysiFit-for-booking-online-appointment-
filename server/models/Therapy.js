const mongoose = require('mongoose');

const TherapySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    duration: { type: String, default: '45 Mins' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    specialization: { type: String },
    suitableFor: [{ type: String }],
    benefits: [{ type: String }],
    precautions: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Therapy', TherapySchema);
