const mongoose = require('mongoose');

const ContactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String, required: true },
    message: { type: String, required: true },
    assignedTherapist: { type: String, default: null, index: true }, // therapistId or null
    status: {
      type: String,
      enum: ['New', 'Read', 'Responded'],
      default: 'New'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ContactMessage', ContactMessageSchema);
