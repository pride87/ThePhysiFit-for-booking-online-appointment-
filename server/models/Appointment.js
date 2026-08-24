const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    patientName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, default: 'Male' },
    condition: { type: String, required: true },
    therapy: { type: String, required: true },
    therapistId: { type: String, default: 'unassigned', index: true },
    therapistName: { type: String, default: 'Unassigned' },
    appointmentDate: { type: String, required: true, index: true }, // Format: YYYY-MM-DD
    appointmentTime: { type: String, required: true },
    message: { type: String, default: '' },
    notes: { type: String, default: '' },
    therapyNotes: { type: String, default: '' },
    treatmentNotes: { type: String, default: '' },
    followUpDate: { type: String, default: '' },
    paymentMethod: {
      type: String,
      enum: ['RAZORPAY', 'PAY_AFTER_THERAPY', 'UPI', 'CASH', 'OTHER'],
      default: 'PAY_AFTER_THERAPY'
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED', 'CANCELLED', 'PAY_AFTER_THERAPY', 'pending', 'verification_pending', 'paid', 'failed'],
      default: 'PAY_AFTER_THERAPY',
      index: true
    },
    amount: { type: Number, default: 700 },
    currency: { type: String, default: 'INR' },
    paymentAmount: { type: Number, default: 700 },
    paymentTransactionId: { type: String, default: '' },
    razorpayOrderId: { type: String, default: '' },
    razorpayPaymentId: { type: String, default: '' },
    razorpaySignature: { type: String, default: '' },
    paymentCreatedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Rescheduled', 'Completed', 'Cancelled', 'No Show'],
      default: 'Pending',
      index: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appointment', AppointmentSchema);
