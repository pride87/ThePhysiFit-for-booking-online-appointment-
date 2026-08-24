const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    recipientRole: { type: String, enum: ['admin', 'therapist', 'all'], default: 'admin' },
    therapistId: { type: String, default: null, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    patientName: { type: String },
    therapy: { type: String },
    appointmentDate: { type: String },
    appointmentTime: { type: String },
    appointmentId: { type: String },
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', NotificationSchema);
