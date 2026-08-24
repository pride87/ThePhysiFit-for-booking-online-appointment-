const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
const Therapist = require('../models/Therapist');
const { authenticateUser, authorizeRole } = require('../middleware/auth');

// 1. PUBLIC: POST /api/appointments (Patient Books Appointment)
router.post('/appointments', async (req, res) => {
  try {
    const {
      patientName,
      phone,
      email,
      age,
      gender,
      condition,
      therapy,
      reason,
      appointmentDate,
      appointmentTime,
      message,
      notes,
      paymentMethod,
      paymentStatus,
      paymentAmount
    } = req.body;

    if (!patientName || !phone || !email || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ success: false, message: 'Please provide full name, phone number, email, date, and time.' });
    }

    const bookingId = `PHY-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const finalCondition = condition || reason || 'General Assessment';
    const finalTherapy = therapy || 'Physiotherapy Consultation';

    // Payment status handling:
    let finalPaymentMethod = paymentMethod || 'PAY_AFTER_THERAPY';
    let finalPaymentStatus = paymentStatus;
    if (!finalPaymentStatus) {
      if (finalPaymentMethod === 'RAZORPAY') {
        finalPaymentStatus = 'PENDING';
      } else if (finalPaymentMethod === 'PAY_AFTER_THERAPY') {
        finalPaymentStatus = 'PAY_AFTER_THERAPY';
      } else if (finalPaymentMethod === 'UPI') {
        finalPaymentStatus = 'verification_pending';
      } else {
        finalPaymentStatus = 'PENDING';
      }
    }

    // Always enforce therapy price of ₹700
    const enforcedAmount = 700;

    const newAppointment = await Appointment.create({
      bookingId,
      patientName,
      phone,
      email,
      age: parseInt(age, 10) || 30,
      gender: gender || 'Male',
      condition: finalCondition,
      therapy: finalTherapy,
      therapistId: 'unassigned',
      therapistName: 'Unassigned',
      appointmentDate,
      appointmentTime,
      message: message || notes || '',
      notes: notes || '',
      paymentMethod: finalPaymentMethod,
      paymentStatus: finalPaymentStatus,
      amount: enforcedAmount,
      currency: 'INR',
      paymentAmount: enforcedAmount,
      status: 'Pending'
    });

    // Create notification for Admin
    await Notification.create({
      recipientRole: 'admin',
      title: 'New Booking Submitted',
      message: `Patient ${patientName} booked an appointment for ${appointmentDate} at ${appointmentTime}. Payment: ${finalPaymentMethod} (${finalPaymentStatus}).`,
      patientName,
      therapy: finalTherapy,
      appointmentDate,
      appointmentTime,
      appointmentId: newAppointment._id.toString()
    });

    return res.status(201).json({
      success: true,
      message: 'Appointment request submitted successfully to MongoDB.',
      appointment: newAppointment
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error creating appointment: ' + err.message });
  }
});

// 2. GET /api/appointments (Admin / Receptionist gets all; Therapists get only assigned)
router.get('/appointments', authenticateUser, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'therapist') {
      if (!req.user.therapistId) {
        return res.status(403).json({ success: false, message: 'No therapist profile linked to this account.' });
      }
      query.therapistId = req.user.therapistId;
    }

    const appointments = await Appointment.find(query).sort({ createdAt: -1 });
    return res.json({ success: true, appointments });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching appointments: ' + err.message });
  }
});

// 3. STRICT THERAPIST API: GET /api/therapist/appointments
router.get('/therapist/appointments', authenticateUser, authorizeRole('therapist', 'admin'), async (req, res) => {
  try {
    let targetTherapistId = req.user.therapistId;

    // Strict check: if caller is a therapist, ignore any therapistId in query string!
    if (req.user.role === 'therapist') {
      if (!targetTherapistId) {
        return res.status(403).json({ success: false, message: 'Therapist account is missing linked therapist ID.' });
      }
    } else if (req.user.role === 'admin' && req.query.therapistId) {
      targetTherapistId = req.query.therapistId;
    }

    const appointments = await Appointment.find({ therapistId: targetTherapistId }).sort({ appointmentDate: 1 });
    return res.json({ success: true, therapistId: targetTherapistId, appointments });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching therapist appointments: ' + err.message });
  }
});

// 4. STRICT THERAPIST API: GET /api/therapist/appointments/:id
router.get('/therapist/appointments/:id', authenticateUser, authorizeRole('therapist', 'admin'), async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    // Role Security Enforcement: Therapist can ONLY view their assigned appointment
    if (req.user.role === 'therapist' && appointment.therapistId !== req.user.therapistId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. You do not have permission to view appointments assigned to other therapists.'
      });
    }

    return res.json({ success: true, appointment });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching appointment details: ' + err.message });
  }
});

// 5. ADMIN ONLY: PUT /api/appointments/:id/assign (Assign Therapist)
router.put('/appointments/:id/assign', authenticateUser, authorizeRole('admin'), async (req, res) => {
  try {
    const { therapistId } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    let therapistName = 'Unassigned';
    if (therapistId && therapistId !== 'unassigned') {
      const therapistObj = await Therapist.findById(therapistId).catch(() => null);
      if (!therapistObj) {
        return res.status(404).json({ success: false, message: 'Therapist not found.' });
      }
      therapistName = therapistObj.name;
    }

    appointment.therapistId = therapistId || 'unassigned';
    appointment.therapistName = therapistName;
    if (appointment.status === 'Pending' && therapistId !== 'unassigned') {
      appointment.status = 'Confirmed';
    }

    await appointment.save();
    return res.json({ success: true, message: `Therapist assigned: ${therapistName}`, appointment });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error assigning therapist: ' + err.message });
  }
});

// 6. ADMIN ONLY: PUT /api/appointments/:id/payment-status (Manual Payment Verification)
router.put('/appointments/:id/payment-status', authenticateUser, authorizeRole('admin'), async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    if (paymentStatus) {
      appointment.paymentStatus = paymentStatus;
    }

    await appointment.save();
    return res.json({ success: true, message: `Payment status updated to ${paymentStatus}`, appointment });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error updating payment status: ' + err.message });
  }
});

// 7. PUT /api/appointments/:id/status (Confirm, Cancel, Complete, Therapy Notes)
router.put('/appointments/:id/status', authenticateUser, authorizeRole('admin', 'receptionist', 'therapist'), async (req, res) => {
  try {
    const { status, notes, therapyNotes, treatmentNotes, followUpDate } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    // Check therapist authorization if therapist role
    if (req.user.role === 'therapist' && appointment.therapistId !== req.user.therapistId) {
      return res.status(403).json({ success: false, message: 'Forbidden. Cannot modify other therapists\' appointments.' });
    }

    if (status) appointment.status = status;
    if (notes) appointment.notes = notes;
    if (therapyNotes !== undefined) appointment.therapyNotes = therapyNotes;
    if (treatmentNotes !== undefined) appointment.treatmentNotes = treatmentNotes;
    if (followUpDate !== undefined) appointment.followUpDate = followUpDate;

    await appointment.save();
    return res.json({ success: true, message: `Appointment updated successfully.`, appointment });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error updating appointment status: ' + err.message });
  }
});

// 6. PUT /api/appointments/:id/reschedule
router.put('/appointments/:id/reschedule', authenticateUser, authorizeRole('admin', 'receptionist', 'therapist'), async (req, res) => {
  try {
    const { appointmentDate, appointmentTime } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    if (req.user.role === 'therapist' && appointment.therapistId !== req.user.therapistId) {
      return res.status(403).json({ success: false, message: 'Forbidden. Cannot reschedule another therapist\'s appointment.' });
    }

    if (appointmentDate) appointment.appointmentDate = appointmentDate;
    if (appointmentTime) appointment.appointmentTime = appointmentTime;
    appointment.status = 'Rescheduled';

    await appointment.save();
    return res.json({ success: true, message: 'Appointment rescheduled successfully.', appointment });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error rescheduling appointment: ' + err.message });
  }
});

// 7. DELETE /api/appointments/:id (Admin protected)
router.delete('/appointments/:id', authenticateUser, authorizeRole('admin'), async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }
    return res.json({ success: true, message: 'Appointment record deleted.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error deleting appointment: ' + err.message });
  }
});

module.exports = router;
