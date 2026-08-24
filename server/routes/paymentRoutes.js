const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Razorpay = require('razorpay');
const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');

// Initialize Razorpay client lazily or using environment variables
const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error('Razorpay API credentials (RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET) are missing from server environment variables.');
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret
  });
};

// 1. GET /api/payments/key-id - Expose Razorpay Public Key ID to Frontend
router.get('/payments/key-id', (req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  if (!keyId) {
    return res.status(500).json({ success: false, message: 'RAZORPAY_KEY_ID is missing on server.' });
  }
  return res.json({ success: true, keyId });
});

// 2. POST /api/payments/create-order - Create Razorpay Order for ₹700 (70000 paise)
router.post('/payments/create-order', async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({ success: false, message: 'Appointment ID is required.' });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    // Protection 1: Prevent duplicate payment if already paid
    if (appointment.paymentStatus === 'PAID' || appointment.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'This appointment has already been successfully paid.'
      });
    }

    const razorpay = getRazorpayInstance();

    // Price Manipulation Protection: Enforce fixed 70000 paise (₹700)
    const amountInPaise = 70000; // ₹700 = 70000 paise
    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${appointment.bookingId || appointment._id}`,
      notes: {
        appointmentId: appointment._id.toString(),
        bookingId: appointment.bookingId,
        patientName: appointment.patientName,
        phone: appointment.phone
      }
    };

    const order = await razorpay.orders.create(options);

    // Save order details to appointment record
    appointment.razorpayOrderId = order.id;
    appointment.paymentMethod = 'RAZORPAY';
    if (appointment.paymentStatus !== 'PAID' && appointment.paymentStatus !== 'paid') {
      appointment.paymentStatus = 'PENDING';
    }
    await appointment.save();

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      bookingId: appointment.bookingId,
      patientName: appointment.patientName,
      email: appointment.email,
      phone: appointment.phone
    });
  } catch (err) {
    console.error('Error creating Razorpay Order:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to create Razorpay Order: ' + err.message
    });
  }
});

// 3. POST /api/payments/verify - Verify Razorpay Signature (Server-side validation)
router.post('/payments/verify', async (req, res) => {
  try {
    const { appointmentId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!appointmentId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required Razorpay verification payload (appointmentId, razorpay_order_id, razorpay_payment_id, razorpay_signature).'
      });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return res.status(500).json({ success: false, message: 'RAZORPAY_KEY_SECRET missing on server.' });
    }

    // HMAC-SHA256 signature calculation using official Razorpay formula
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      appointment.paymentStatus = 'PAID';
      appointment.paymentMethod = 'RAZORPAY';
      appointment.razorpayOrderId = razorpay_order_id;
      appointment.razorpayPaymentId = razorpay_payment_id;
      appointment.razorpaySignature = razorpay_signature;
      appointment.paymentAmount = 700;
      appointment.amount = 700;
      appointment.currency = 'INR';
      await appointment.save();

      // Create admin notification for successful payment
      await Notification.create({
        recipientRole: 'admin',
        title: 'Razorpay Online Payment Verified',
        message: `Online payment of ₹700 verified for ${appointment.patientName} (${appointment.bookingId}). Payment ID: ${razorpay_payment_id}.`,
        patientName: appointment.patientName,
        therapy: appointment.therapy,
        appointmentDate: appointment.appointmentDate,
        appointmentTime: appointment.appointmentTime,
        appointmentId: appointment._id.toString()
      });

      return res.status(200).json({
        success: true,
        message: 'Razorpay payment signature verified successfully.',
        appointment
      });
    } else {
      appointment.paymentStatus = 'FAILED';
      await appointment.save();

      return res.status(400).json({
        success: false,
        message: 'Invalid Razorpay signature. Verification failed.'
      });
    }
  } catch (err) {
    console.error('Error verifying Razorpay Payment:', err);
    return res.status(500).json({
      success: false,
      message: 'Payment verification failed: ' + err.message
    });
  }
});

// 4. POST /api/payments/failure - Handle Payment Failure Notification
router.post('/payments/failure', async (req, res) => {
  try {
    const { appointmentId, razorpay_order_id, reason } = req.body;

    if (appointmentId) {
      const appointment = await Appointment.findById(appointmentId);
      if (appointment && appointment.paymentStatus !== 'PAID') {
        appointment.paymentStatus = 'FAILED';
        if (razorpay_order_id) appointment.razorpayOrderId = razorpay_order_id;
        await appointment.save();
      }
    }

    return res.json({ success: true, message: 'Payment marked as failed.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error marking payment failure: ' + err.message });
  }
});

// 5. GET /api/payments/:appointmentId - Get payment details for an appointment
router.get('/payments/:appointmentId', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    return res.json({
      success: true,
      paymentDetails: {
        appointmentId: appointment._id,
        bookingId: appointment.bookingId,
        amount: appointment.amount || appointment.paymentAmount || 700,
        currency: appointment.currency || 'INR',
        paymentMethod: appointment.paymentMethod,
        paymentStatus: appointment.paymentStatus,
        razorpayOrderId: appointment.razorpayOrderId,
        razorpayPaymentId: appointment.razorpayPaymentId
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching payment status: ' + err.message });
  }
});

module.exports = router;
