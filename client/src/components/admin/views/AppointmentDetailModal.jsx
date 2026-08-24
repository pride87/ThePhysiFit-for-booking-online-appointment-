import React, { useState } from 'react';
import { X, Calendar, Clock, User, Phone, Mail, FileText, CheckCircle, XCircle, RotateCcw, UserCheck, QrCode, CreditCard } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useToast } from '../../../context/ToastContext';

const AppointmentDetailModal = ({ appointment, isOpen, onClose }) => {
  const { therapists, updateAppointmentStatus, assignTherapist, updatePaymentStatus, rescheduleAppointment } = useData();
  const { showToast } = useToast();

  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('10:00 AM');
  const [adminNotes, setAdminNotes] = useState('');
  const [selectedTherapistId, setSelectedTherapistId] = useState('');

  if (!isOpen || !appointment) return null;

  const activeTherapists = therapists.filter((t) => t.status === 'active');

  const handleAssignTherapist = async (tId) => {
    try {
      await assignTherapist(appointment.id, tId);
      showToast(`Therapist assigned successfully!`, 'success');
    } catch (err) {
      showToast(err.message || 'Error assigning therapist.', 'error');
    }
  };

  const handleVerifyPayment = async (newStatus) => {
    try {
      await updatePaymentStatus(appointment.id, newStatus);
      showToast(`Payment status updated to ${newStatus}`, 'success');
    } catch (err) {
      showToast(err.message || 'Error updating payment status.', 'error');
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateAppointmentStatus(appointment.id, { status: newStatus, notes: adminNotes });
      showToast(`Appointment ${appointment.id} status updated to ${newStatus}`, 'success');
      onClose();
    } catch (err) {
      showToast(err.message || 'Error updating status.', 'error');
    }
  };

  const handleConfirmReschedule = async () => {
    if (!rescheduleDate) {
      showToast('Please select a new date for rescheduling', 'warning');
      return;
    }
    try {
      await rescheduleAppointment(appointment.id, rescheduleDate, rescheduleTime);
      showToast(`Appointment rescheduled to ${rescheduleDate} at ${rescheduleTime}`, 'success');
      setIsRescheduling(false);
      onClose();
    } catch (err) {
      showToast(err.message || 'Error rescheduling appointment.', 'error');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-card-lg" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontWeight: 800, fontFamily: 'monospace', fontSize: '1.1rem' }}>{appointment.bookingId || appointment.id}</span>
            <span className={`badge badge-${appointment.status?.toLowerCase()}`}>{appointment.status}</span>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '1.5rem', maxHeight: '75vh', overflowY: 'auto' }}>
          {/* Patient & Appointment Details Box */}
          <div className="summary-details-box" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '1.25rem' }}>
            <div className="summary-item">
              <div className="summary-item-label">Patient Name</div>
              <div className="summary-item-val">{appointment.patientName}</div>
            </div>
            <div className="summary-item">
              <div className="summary-item-label">Phone & Email</div>
              <div className="summary-item-val">{appointment.phone} • {appointment.email}</div>
            </div>
            <div className="summary-item">
              <div className="summary-item-label">Age / Gender</div>
              <div className="summary-item-val">{appointment.age} Yrs • {appointment.gender}</div>
            </div>
            <div className="summary-item">
              <div className="summary-item-label">Problem / Therapy</div>
              <div className="summary-item-val">{appointment.therapy || appointment.condition}</div>
            </div>
            <div className="summary-item">
              <div className="summary-item-label">Scheduled Date & Time</div>
              <div className="summary-item-val" style={{ color: 'var(--primary)', fontSize: '1.05rem', fontWeight: 700 }}>
                {appointment.appointmentDate || appointment.date} at {appointment.appointmentTime || appointment.time}
              </div>
            </div>
            <div className="summary-item">
              <div className="summary-item-label">Booking Date</div>
              <div className="summary-item-val">{new Date(appointment.createdAt || Date.now()).toLocaleDateString()}</div>
            </div>
          </div>

          {/* THERAPIST ASSIGNMENT PANEL */}
          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '0.9rem', color: 'var(--dark)', marginBottom: '0.75rem' }}>
              <UserCheck size={18} style={{ color: 'var(--primary)' }} /> Therapist Assignment
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <select
                className="form-select"
                style={{ flex: 1 }}
                value={appointment.therapistId || 'unassigned'}
                onChange={(e) => handleAssignTherapist(e.target.value)}
              >
                <option value="unassigned">-- Unassigned (Select Therapist) --</option>
                {activeTherapists.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} ({doc.specialization})
                  </option>
                ))}
              </select>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              Current Status: <strong>{appointment.therapistName === 'Unassigned' || !appointment.therapistName ? 'Unassigned (Pending Admin Action)' : `Assigned to ${appointment.therapistName}`}</strong>
            </div>
          </div>

          {/* PAYMENT INFORMATION & MANUAL VERIFICATION */}
          <div style={{ background: '#fff8f1', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #ffedd5', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '0.9rem', color: '#c2410c' }}>
                <CreditCard size={18} /> Payment Information
              </div>
              <span className={`badge badge-${(appointment.paymentStatus === 'PAID' || appointment.paymentStatus === 'paid') ? 'completed' : 'pending'}`}>
                {appointment.paymentStatus === 'PAID' || appointment.paymentStatus === 'paid' ? 'Paid' : (appointment.paymentStatus === 'PAY_AFTER_THERAPY' ? 'Pay After Therapy' : (appointment.paymentStatus || 'Pending'))}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', fontSize: '0.88rem', marginBottom: '1rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Session Amount:</span>
                <div style={{ fontWeight: 800, color: 'var(--dark)' }}>₹{appointment.amount || appointment.paymentAmount || 700}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Payment Method:</span>
                <div style={{ fontWeight: 700, color: 'var(--dark)' }}>
                  {appointment.paymentMethod === 'RAZORPAY' ? 'Razorpay' : (appointment.paymentMethod === 'PAY_AFTER_THERAPY' ? 'Pay After Therapy' : (appointment.paymentMethod || 'PAY_AFTER_THERAPY'))}
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Payment Status:</span>
                <div style={{ fontWeight: 700, color: (appointment.paymentStatus === 'PAID' || appointment.paymentStatus === 'paid') ? '#15803d' : '#d97706' }}>
                  {appointment.paymentStatus === 'PAID' || appointment.paymentStatus === 'paid' ? 'Paid' : (appointment.paymentStatus || 'Pay After Therapy')}
                </div>
              </div>
              {appointment.razorpayPaymentId && (
                <div style={{ gridColumn: 'span 3' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Razorpay Payment ID:</span>
                  <div style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--dark)' }}>{appointment.razorpayPaymentId}</div>
                </div>
              )}
            </div>

            {/* Manual Admin Payment Status Update Controls */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-xs btn-primary"
                onClick={() => handleVerifyPayment('PAID')}
              >
                <CheckCircle size={14} /> Mark Paid
              </button>
              <button
                type="button"
                className="btn btn-xs btn-outline"
                onClick={() => handleVerifyPayment('PENDING')}
              >
                Mark Pending
              </button>
              <button
                type="button"
                className="btn btn-xs btn-outline"
                onClick={() => handleVerifyPayment('PAY_AFTER_THERAPY')}
              >
                Mark Pay After Therapy
              </button>
            </div>
          </div>

          {(appointment.message || appointment.notes) && (
            <div style={{ padding: '1rem', background: 'var(--bg-light)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--dark)', marginBottom: '0.35rem' }}>
                Patient Reason & Notes:
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>"{appointment.message || appointment.notes}"</p>
            </div>
          )}

          {/* Reschedule Picker Box */}
          {isRescheduling ? (
            <div style={{ padding: '1.25rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
              <h4 style={{ color: '#166534', marginBottom: '0.75rem', fontSize: '1rem' }}>Reschedule Appointment Slot</h4>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">New Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">New Time Slot</label>
                  <select
                    className="form-select"
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button className="btn btn-primary btn-sm" onClick={handleConfirmReschedule}>
                  Confirm Reschedule
                </button>
                <button className="btn btn-outline btn-sm" onClick={() => setIsRescheduling(false)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">Admin Clinical Notes / Update Log</label>
              <input
                type="text"
                className="form-input"
                placeholder="Add clinical observation or call notes..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-outline btn-sm" onClick={() => setIsRescheduling(true)}>
              <RotateCcw size={14} /> Reschedule
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {appointment.status !== 'Confirmed' && (
              <button className="btn btn-primary btn-sm" onClick={() => handleStatusChange('Confirmed')}>
                <CheckCircle size={14} /> Confirm
              </button>
            )}
            {appointment.status !== 'Completed' && (
              <button
                className="btn btn-sm"
                style={{ backgroundColor: 'var(--accent)', color: '#ffffff' }}
                onClick={() => handleStatusChange('Completed')}
              >
                Mark Completed
              </button>
            )}
            {appointment.status !== 'Cancelled' && (
              <button
                className="btn btn-sm"
                style={{ backgroundColor: 'var(--status-cancelled)', color: '#ffffff' }}
                onClick={() => handleStatusChange('Cancelled')}
              >
                Cancel Appt
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailModal;
