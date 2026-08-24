import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, CheckCircle2, ShieldCheck, ArrowRight, ChevronLeft, CreditCard, AlertCircle, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { loadRazorpayScript } from '../../utils/razorpay';

const AppointmentBookingModal = ({
  isOpen,
  onClose,
  initialCondition = '',
  initialTherapy = ''
}) => {
  const { addAppointment, createPaymentOrder, verifyRazorpayPayment, reportPaymentFailure } = useData();
  const { showToast } = useToast();

  const [step, setStep] = useState(1); // 1: Info & Schedule, 2: Payment Option, 3: Razorpay / Payment Action, 4: Confirmation
  const [submitting, setSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Form Fields
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    phone: '',
    email: '',
    age: '30',
    gender: 'Male',
    condition: initialCondition || '',
    therapy: initialTherapy || '',
    reason: '',
    notes: ''
  });

  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState('10:00 AM');

  // Payment Options & Records
  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY'); // 'RAZORPAY' or 'PAY_AFTER_THERAPY'
  const [activeAppointment, setActiveAppointment] = useState(null);
  const [bookingConfirmation, setBookingConfirmation] = useState(null);

  // Sync initial props when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialCondition) {
        setPatientInfo((prev) => ({ ...prev, condition: initialCondition, reason: initialCondition }));
      }
      if (initialTherapy) {
        setPatientInfo((prev) => ({ ...prev, therapy: initialTherapy }));
      }
    }
  }, [isOpen, initialCondition, initialTherapy]);

  if (!isOpen) return null;

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
  ];

  const handleInfoSubmit = (e) => {
    e.preventDefault();
    if (!patientInfo.name.trim()) {
      showToast('Please enter your full name', 'warning');
      return;
    }
    if (!patientInfo.phone.trim() || patientInfo.phone.trim().length < 7) {
      showToast('Please enter a valid phone number', 'warning');
      return;
    }
    if (!patientInfo.email.trim() || !patientInfo.email.includes('@')) {
      showToast('Please enter a valid email address', 'warning');
      return;
    }
    if (!selectedDate) {
      showToast('Please select an appointment date', 'warning');
      return;
    }
    if (!selectedTime) {
      showToast('Please select an appointment time', 'warning');
      return;
    }

    // Advance to Payment Selection Step
    setStep(2);
  };

  const handleSelectPaymentMethod = async (method) => {
    setPaymentMethod(method);
    setPaymentError('');

    if (method === 'PAY_AFTER_THERAPY') {
      await handlePayAfterTherapy();
    } else {
      setStep(3); // Advance to Pay Online summary / Razorpay Checkout screen
    }
  };

  // Helper to ensure an appointment record exists before payment
  const getOrCreateAppointment = async (method, defaultStatus) => {
    if (activeAppointment) return activeAppointment;

    const newApp = await addAppointment({
      patientName: patientInfo.name,
      phone: patientInfo.phone,
      email: patientInfo.email,
      age: parseInt(patientInfo.age, 10) || 30,
      gender: patientInfo.gender,
      condition: patientInfo.condition || patientInfo.reason || 'General Physiotherapy',
      therapy: patientInfo.therapy || 'Physiotherapy Assessment',
      reason: patientInfo.reason || patientInfo.condition || patientInfo.notes || 'Physiotherapy Consultation',
      appointmentDate: selectedDate,
      appointmentTime: selectedTime,
      message: patientInfo.notes,
      paymentMethod: method,
      paymentStatus: defaultStatus,
      amount: 700,
      paymentAmount: 700
    });

    setActiveAppointment(newApp);
    return newApp;
  };

  // 1. Online Razorpay Payment Trigger
  const handleOpenRazorpayCheckout = async () => {
    setSubmitting(true);
    setPaymentError('');

    try {
      // Step A: Load official Razorpay Checkout SDK Script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection and try again.');
      }

      // Step B: Ensure appointment is registered in database
      const appRecord = await getOrCreateAppointment('RAZORPAY', 'PENDING');

      // Check if already paid
      if (appRecord.paymentStatus === 'PAID' || appRecord.paymentStatus === 'paid') {
        showToast('This appointment is already paid!', 'info');
        setBookingConfirmation(appRecord);
        setStep(4);
        setSubmitting(false);
        return;
      }

      // Step C: Request Razorpay Order from Backend (Fixed ₹700 / 70000 paise)
      const orderData = await createPaymentOrder(appRecord.id || appRecord._id);

      // Step D: Open Razorpay TEST Checkout Modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount, // 70000 paise
        currency: orderData.currency || 'INR',
        name: 'ThePhysiFit',
        description: `Therapy Session — ${appRecord.therapy || 'Consultation'} (₹700)`,
        order_id: orderData.orderId,
        prefill: {
          name: patientInfo.name,
          email: patientInfo.email,
          contact: patientInfo.phone
        },
        theme: {
          color: '#10b981'
        },
        handler: async function (response) {
          // Razorpay Checkout Success Callback
          try {
            const verifiedApp = await verifyRazorpayPayment({
              appointmentId: appRecord.id || appRecord._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            try {
              confetti({
                particleCount: 90,
                spread: 75,
                origin: { y: 0.6 }
              });
            } catch {
              // fallback
            }

            setBookingConfirmation(verifiedApp);
            setStep(4);
            showToast('Razorpay payment verified & appointment confirmed!', 'success');
          } catch (verifyErr) {
            setPaymentError(verifyErr.message || 'Signature verification failed.');
            showToast(verifyErr.message || 'Payment verification failed.', 'error');
          } finally {
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: function () {
            // Requirement 13: Handle cancellation/dismissal without marking PAID
            setSubmitting(false);
            showToast('Razorpay checkout closed. You can retry paying online or choose Pay After Therapy.', 'info');
          }
        }
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (response) {
        // Requirement 12: Handle payment failure
        reportPaymentFailure({
          appointmentId: appRecord.id || appRecord._id,
          razorpay_order_id: orderData.orderId,
          reason: response.error?.description
        });
        setPaymentError(response.error?.description || 'Payment failed. Please try again.');
        showToast('Payment failed. Please try again.', 'error');
        setSubmitting(false);
      });

      rzp.open();
    } catch (err) {
      console.error('Razorpay payment error:', err);
      setPaymentError(err.message || 'Failed to initiate Razorpay payment.');
      showToast(err.message || 'Error opening payment gateway.', 'error');
      setSubmitting(false);
    }
  };

  // 2. Pay After Therapy Handler
  const handlePayAfterTherapy = async () => {
    setSubmitting(true);
    setPaymentError('');
    try {
      const createdApp = await addAppointment({
        patientName: patientInfo.name,
        phone: patientInfo.phone,
        email: patientInfo.email,
        age: parseInt(patientInfo.age, 10) || 30,
        gender: patientInfo.gender,
        condition: patientInfo.condition || patientInfo.reason || 'General Physiotherapy',
        therapy: patientInfo.therapy || 'Physiotherapy Assessment',
        reason: patientInfo.reason || patientInfo.condition || patientInfo.notes || 'Physiotherapy Consultation',
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        message: patientInfo.notes,
        paymentMethod: 'PAY_AFTER_THERAPY',
        paymentStatus: 'PAY_AFTER_THERAPY',
        amount: 700,
        paymentAmount: 700
      });

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // fallback
      }

      setBookingConfirmation(createdApp);
      setStep(4);
      showToast('Appointment booked successfully! Pay after your session.', 'success');
    } catch (err) {
      showToast(err.message || 'Error submitting booking.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetModal = () => {
    setStep(1);
    setActiveAppointment(null);
    setBookingConfirmation(null);
    setPaymentError('');
    setPatientInfo({
      name: '',
      phone: '',
      email: '',
      age: '30',
      gender: 'Male',
      condition: '',
      therapy: '',
      reason: '',
      notes: ''
    });
    setPaymentMethod('RAZORPAY');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleResetModal}>
      <div
        className="modal-card modal-card-lg"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: step === 3 ? '540px' : '620px' }}
      >
        <div className="modal-header">
          <div>
            <span className="modal-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={14} /> Secure Appointment Booking
            </span>
            <h3 className="modal-title">
              {step === 1 && 'Book Your Appointment'}
              {step === 2 && 'Select Payment Method'}
              {step === 3 && 'Complete Your Booking'}
              {step === 4 && 'Booking Confirmed!'}
            </h3>
          </div>
          <button className="modal-close" onClick={handleResetModal} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '1.5rem' }}>
          {/* STEP 1: Personal Info & Scheduling Form */}
          {step === 1 && (
            <form onSubmit={handleInfoSubmit}>
              <div style={{ background: 'var(--bg-light)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  1. Personal Details
                </div>
                
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="Enter your full name"
                    value={patientInfo.name}
                    onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })}
                  />
                </div>

                <div className="form-grid" style={{ marginBottom: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      className="form-input"
                      placeholder="e.g. 7065411520"
                      value={patientInfo.phone}
                      onChange={(e) => setPatientInfo({ ...patientInfo, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      required
                      className="form-input"
                      placeholder="e.g. name@example.com"
                      value={patientInfo.email}
                      onChange={(e) => setPatientInfo({ ...patientInfo, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-group">
                    <label className="form-label">Age</label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      className="form-input"
                      value={patientInfo.age}
                      onChange={(e) => setPatientInfo({ ...patientInfo, age: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select
                      className="form-select"
                      value={patientInfo.gender}
                      onChange={(e) => setPatientInfo({ ...patientInfo, gender: e.target.value })}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-light)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  2. Problem & Date Selection
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Reason / Problem Description *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Lower back pain, knee stiffness, neck strain..."
                    value={patientInfo.reason || patientInfo.condition}
                    onChange={(e) => setPatientInfo({ ...patientInfo, reason: e.target.value, condition: e.target.value })}
                  />
                </div>

                <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Appointment Date *</label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="form-input"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Preferred Time *</label>
                    <select
                      className="form-select"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                    >
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Additional Message / Notes (Optional)</label>
                  <textarea
                    rows={2}
                    className="form-textarea"
                    placeholder="Any prior medical history or special requests..."
                    value={patientInfo.notes}
                    onChange={(e) => setPatientInfo({ ...patientInfo, notes: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ background: '#f0fdf4', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid #bbf7d0', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, color: '#166534', fontSize: '0.9rem' }}>Session Fee:</span>
                <span style={{ fontWeight: 800, color: '#15803d', fontSize: '1.15rem' }}>₹700 / Session</span>
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                Proceed to Payment (₹700) <ArrowRight size={18} />
              </button>
            </form>
          )}

          {/* STEP 2: Choose Payment Option */}
          {step === 2 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  Select how you would like to complete payment (<strong>₹700</strong>) for your session with <strong>ThePhysiFit</strong>.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem' }}>
                {/* Option 1: Pay Online — Razorpay */}
                <div
                  onClick={() => handleSelectPaymentMethod('RAZORPAY')}
                  style={{
                    border: '2px solid var(--primary)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                    background: 'var(--primary-light)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CreditCard size={24} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--dark)', margin: 0 }}>
                          Pay Online — Razorpay
                        </h4>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, background: '#10b981', color: '#fff', padding: '0.15rem 0.5rem', borderRadius: '50px' }}>
                          TEST MODE
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem', marginBottom: 0 }}>
                        Secure payment using UPI, Credit/Debit Cards, Net Banking, or Wallets.
                      </p>
                    </div>
                  </div>
                  <ArrowRight size={20} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                </div>

                {/* Option 2: Pay After Therapy */}
                <div
                  onClick={() => handleSelectPaymentMethod('PAY_AFTER_THERAPY')}
                  style={{
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                    background: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-light)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--dark)', marginBottom: '0.2rem' }}>
                        Pay After Therapy (₹700)
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                        Pay ₹700 in cash or card directly at the clinic after your treatment session.
                      </p>
                    </div>
                  </div>
                  <ArrowRight size={20} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setStep(1)}>
                  <ChevronLeft size={18} /> Back to Details
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Razorpay Pay Online Checkout Summary Screen */}
          {step === 3 && (
            <div>
              {/* Appointment Summary Box */}
              <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
                  Appointment Summary
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.9rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Patient Name:</span>
                    <div style={{ fontWeight: 700, color: 'var(--dark)' }}>{patientInfo.name}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Therapy / Condition:</span>
                    <div style={{ fontWeight: 700, color: 'var(--dark)' }}>{patientInfo.therapy || patientInfo.condition}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Date:</span>
                    <div style={{ fontWeight: 700, color: 'var(--dark)' }}>{selectedDate}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Time:</span>
                    <div style={{ fontWeight: 700, color: 'var(--dark)' }}>{selectedTime}</div>
                  </div>
                </div>

                <div style={{ marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, color: 'var(--dark)', fontSize: '0.95rem' }}>Session Charge:</span>
                  <span style={{ fontWeight: 800, color: '#15803d', fontSize: '1.2rem' }}>₹700</span>
                </div>
              </div>

              {/* Payment Error Alert */}
              {paymentError && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-md)', padding: '0.85rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <AlertCircle size={20} style={{ color: '#dc2626', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ fontWeight: 700, color: '#991b1b', fontSize: '0.9rem' }}>Payment Failed</div>
                    <div style={{ color: '#b91c1c', fontSize: '0.85rem' }}>{paymentError}</div>
                  </div>
                </div>
              )}

              {/* Payment Action Box */}
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', justifyContent: 'center', height: '52px', fontSize: '1.1rem' }}
                  disabled={submitting}
                  onClick={handleOpenRazorpayCheckout}
                >
                  {submitting ? (
                    <>
                      <RefreshCw size={20} className="spin" /> Opening Razorpay Gateway...
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} /> Pay ₹700 with Razorpay
                    </>
                  )}
                </button>
                
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.65rem' }}>
                  🔒 Official Razorpay TEST Checkout. UPI, Cards, Net Banking & Wallets enabled.
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setStep(2)}>
                  <ChevronLeft size={16} /> Change Payment Method
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Booking Confirmation Screen */}
          {step === 4 && bookingConfirmation && (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <CheckCircle2 size={40} />
              </div>

              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--dark)', marginBottom: '0.35rem' }}>
                {bookingConfirmation.paymentStatus === 'PAID' ? 'Payment Successful & Booking Confirmed!' : 'Booking Confirmed!'}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                Thank you, <strong>{bookingConfirmation.patientName}</strong>. Your therapy session with <strong>ThePhysiFit</strong> has been scheduled.
              </p>

              <div style={{ background: 'var(--bg-light)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'left', marginBottom: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.9rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Booking Reference:</span>
                    <div style={{ fontWeight: 800, fontFamily: 'monospace', color: 'var(--dark)', fontSize: '1rem' }}>{bookingConfirmation.bookingId}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Therapy Session:</span>
                    <div style={{ fontWeight: 700, color: 'var(--dark)' }}>{bookingConfirmation.therapy || bookingConfirmation.condition}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Appointment Date:</span>
                    <div style={{ fontWeight: 700, color: 'var(--dark)' }}>{bookingConfirmation.appointmentDate}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Time Slot:</span>
                    <div style={{ fontWeight: 700, color: 'var(--dark)' }}>{bookingConfirmation.appointmentTime}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Session Amount:</span>
                    <div style={{ fontWeight: 800, color: '#15803d' }}>₹700</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Payment Method:</span>
                    <div style={{ fontWeight: 700, color: 'var(--dark)' }}>
                      {bookingConfirmation.paymentMethod === 'RAZORPAY' ? 'Razorpay Online' : 'Pay After Therapy'}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Payment Status:</span>
                    <div style={{ fontWeight: 700, color: bookingConfirmation.paymentStatus === 'PAID' ? '#15803d' : '#d97706' }}>
                      {bookingConfirmation.paymentStatus === 'PAID' ? 'Paid' : 'Pay After Therapy'}
                    </div>
                  </div>
                  {bookingConfirmation.razorpayPaymentId && (
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Razorpay Payment ID:</span>
                      <div style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--dark)', fontSize: '0.82rem' }}>
                        {bookingConfirmation.razorpayPaymentId}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                ℹ️ Our clinic team will contact you at <strong>{bookingConfirmation.phone}</strong> to confirm your specialist assignment.
              </div>

              <button type="button" className="btn btn-primary" style={{ width: '100%' }} onClick={handleResetModal}>
                Done & Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentBookingModal;
