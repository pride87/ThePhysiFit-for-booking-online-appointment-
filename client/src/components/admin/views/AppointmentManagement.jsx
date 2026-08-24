import React, { useState, useMemo } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, RotateCcw, Calendar, Trash2 } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useToast } from '../../../context/ToastContext';
import AppointmentDetailModal from './AppointmentDetailModal';
import ConfirmModal from '../../common/ConfirmModal';

const AppointmentManagement = () => {
  const { appointments, therapists, therapies, updateAppointmentStatus, deleteAppointment } = useData();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [therapistFilter, setTherapistFilter] = useState('All');
  const [therapyFilter, setTherapyFilter] = useState('All');
  const [selectedDateFilter, setSelectedDateFilter] = useState('');

  const [selectedApp, setSelectedApp] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((app) => {
      if (statusFilter !== 'All' && app.status !== statusFilter) return false;
      if (therapistFilter !== 'All' && app.therapistId !== therapistFilter && app.therapistName !== therapistFilter) return false;
      if (therapyFilter !== 'All' && app.therapy !== therapyFilter) return false;
      if (selectedDateFilter && app.date !== selectedDateFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          app.id.toLowerCase().includes(q) ||
          app.patientName.toLowerCase().includes(q) ||
          app.phone.includes(q) ||
          app.email.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [appointments, statusFilter, therapistFilter, therapyFilter, selectedDateFilter, searchQuery]);

  const confirmDelete = () => {
    if (deletingId) {
      deleteAppointment(deletingId);
      showToast('Appointment record deleted!', 'info');
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Appointment Management</h1>
          <p className="admin-page-subtitle">Track patient bookings, manage status workflow, reschedule appointments, and view clinical notes.</p>
        </div>
      </div>

      <div className="table-card">
        {/* Filters Toolbar */}
        <div className="table-toolbar">
          <div className="admin-nav-search" style={{ width: '280px' }}>
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search ID, patient name, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="filter-item">
              <span className="filter-label">Status:</span>
              <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Rescheduled">Rescheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="No Show">No Show</option>
              </select>
            </div>

            <div className="filter-item">
              <span className="filter-label">Therapist:</span>
              <select className="filter-select" value={therapistFilter} onChange={(e) => setTherapistFilter(e.target.value)}>
                <option value="All">All Therapists</option>
                {therapists.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="filter-item">
              <span className="filter-label">Date:</span>
              <input
                type="date"
                className="filter-select"
                value={selectedDateFilter}
                onChange={(e) => setSelectedDateFilter(e.target.value)}
              />
            </div>

            {(statusFilter !== 'All' || therapistFilter !== 'All' || selectedDateFilter) && (
              <button
                className="btn btn-outline btn-sm"
                onClick={() => { setStatusFilter('All'); setTherapistFilter('All'); setSelectedDateFilter(''); setSearchQuery(''); }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Patient Details</th>
                <th>Assigned Therapist</th>
                <th>Problem / Therapy</th>
                <th>Date & Time</th>
                <th>Amount</th>
                <th>Payment Status</th>
                <th>Appt Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((app) => (
                <tr key={app.id}>
                  <td style={{ fontWeight: 800, fontFamily: 'monospace' }}>{app.bookingId || app.id}</td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--dark)' }}>{app.patientName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {app.phone} • {app.age} Yrs ({app.gender})
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: app.therapistName === 'Unassigned' || !app.therapistName ? '#d97706' : 'var(--dark)' }}>
                      {app.therapistName === 'Unassigned' || !app.therapistName ? '⚠️ Unassigned' : app.therapistName}
                    </span>
                  </td>
                  <td>{app.condition || app.therapy}</td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--dark)' }}>{app.appointmentDate || app.date}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>{app.appointmentTime || app.time}</div>
                  </td>
                  <td style={{ fontWeight: 700 }}>₹{app.amount || app.paymentAmount || 700}</td>
                  <td>
                    <div>
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
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {app.paymentMethod === 'RAZORPAY' ? 'Razorpay' : (app.paymentMethod === 'PAY_AFTER_THERAPY' ? 'Pay After Therapy' : app.paymentMethod)}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge badge-${app.status?.toLowerCase()}`}>
                      {app.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="action-btn-icon edit"
                        title="View Details / Manage"
                        onClick={() => setSelectedApp(app)}
                      >
                        <Eye size={16} />
                      </button>

                      {app.status === 'Pending' && (
                        <button
                          className="action-btn-icon approve"
                          title="Confirm Appointment"
                          onClick={() => {
                            updateAppointmentStatus(app.id, 'Confirmed');
                            showToast(`Appointment ${app.id} confirmed!`, 'success');
                          }}
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}

                      <button
                        className="action-btn-icon delete"
                        title="Delete Record"
                        onClick={() => setDeletingId(app.id)}
                      >
                        <Trash2 size={16} />
                      </button>
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

      <ConfirmModal
        isOpen={!!deletingId}
        title="Delete Appointment Record?"
        message="Are you sure you want to permanently delete this appointment record?"
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeletingId(null)}
        type="danger"
      />
    </div>
  );
};

export default AppointmentManagement;
