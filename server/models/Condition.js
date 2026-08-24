const mongoose = require('mongoose');

const ConditionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    iconName: { type: String, default: 'Activity' },
    image: { type: String },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String },
    recommendedTherapies: [{ type: String }],
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Condition', ConditionSchema);
