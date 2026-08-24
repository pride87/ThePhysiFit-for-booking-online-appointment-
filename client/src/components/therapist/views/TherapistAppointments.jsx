import React, { useState } from 'react';
import { Search, Eye, CheckCircle, XCircle, RotateCcw, Clock, Calendar } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';
import { useToast } from '../../../context/ToastContext';
import AppointmentDetailModal from '../../admin/views/AppointmentDetailModal';

const TherapistAppointments = ({ appointments }) => {
  const { user } = useAuth();
  const { updateAppointmentStatus } = useData();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedApp, setSelectedApp] = useState(null);

  const filteredApps = appointments.filter((app) => {
    if (statusFilter !== 'All' && app.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        app.patientName?.toLowerCase().includes(q) ||
        (app.bookingId || app.id)?.toLowerCase().includes(q) ||
        app.phone?.includes(q) ||
        app.condition?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">My Assigned Appointments</h1>
          <p className="admin-page-subtitle">Exclusively assigned patient consultations for Dr. {user?.name}.</p>
        </div>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <div className="admin-nav-search" style={{ width: '280px' }}>
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search patient name, ID, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-item">
            <span className="filter-label">Filter Status:</span>
            <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Rescheduled">Rescheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Client Name</th>
                <th>Phone & Email</th>
                <th>Date & Time</th>
                <th>Problem / Reason</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Payment Status</th>
                <th>Appt Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((app) => (
                <tr key={app._id || app.id}>
                  <td style={{ fontWeight: 800, fontFamily: 'monospace' }}>{app.bookingId || app.id}</td>
                  <td style={{ fontWeight: 700, color: 'var(--dark)' }}>{app.patientName} ({app.age} {app.gender})</td>
                  <td style={{ fontSize: '0.8rem' }}>
                    <div>{app.phone}</div>
                    <div style={{ color: 'var(--text-muted)' }}>{app.email}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--dark)' }}>{app.appointmentDate || app.date}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>{app.appointmentTime || app.time}</div>
                  </td>
                  <td>{app.condition || app.therapy}</td>
                  <td style={{ fontWeight: 700 }}>₹{app.amount || app.paymentAmount || 700}</td>
                  <td>{app.paymentMethod === 'RAZORPAY' ? 'Razorpay' : (app.paymentMethod === 'PAY_AFTER_THERAPY' ? 'Pay After Therapy' : (app.paymentMethod || 'Pay After Therapy'))}</td>
                  <td>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '50px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: (app.paymentStatus === 'PAID' || app.paymentStatus === 'paid') ? '#dcfce7' : ((app.paymentStatus === 'FAILED' || app.paymentStatus === 'failed') ? '#fef2f2' : '#f1f5f9'),
                      color: (app.paymentStatus === 'PAID' || app.paymentStatus === 'paid') ? '#15803d' : ((app.paymentStatus === 'FAILED' || app.paymentStatus === 'failed') ? '#dc2626' : '#475569')
                    }}>
                      {app.paymentStatus === 'PAID' || app.paymentStatus === 'paid' ? 'Paid' : (app.paymentStatus === 'PAY_AFTER_THERAPY' ? 'Pay After Therapy' : (app.paymentStatus === 'FAILED' ? 'Failed' : 'Pending'))}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${app.status?.toLowerCase()}`}>{app.status}</span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="action-btn-icon edit"
                        title="View Patient Details"
                        onClick={() => setSelectedApp(app)}
                      >
                        <Eye size={16} />
                      </button>

                      {app.status === 'Pending' && (
                        <button
                          className="action-btn-icon approve"
                          title="Confirm Appointment"
                          onClick={() => {
                            updateAppointmentStatus(app._id || app.id, 'Confirmed');
                            showToast(`Appointment confirmed!`, 'success');
                          }}
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}

                      {app.status !== 'Completed' && (
                        <button
                          className="btn btn-xs"
                          style={{ backgroundColor: 'var(--accent)', color: '#fff', fontSize: '0.72rem', padding: '0.2rem 0.5rem', borderRadius: '4px' }}
                          onClick={() => {
                            updateAppointmentStatus(app._id || app.id, 'Completed');
                            showToast(`Marked completed!`, 'success');
                          }}
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AppointmentDetailModal
        appointment={selectedApp}
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
      />
    </div>
  );
};

export default TherapistAppointments;
