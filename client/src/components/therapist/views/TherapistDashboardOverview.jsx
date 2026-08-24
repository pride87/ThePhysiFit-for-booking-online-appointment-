import React from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle, XCircle, UserCheck, Activity } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useData } from '../../../context/DataContext';

const TherapistDashboardOverview = ({ setActiveTab, appointments }) => {
  const { user } = useAuth();
  const { therapists } = useData();

  const doctorProfile = therapists.find((d) => d.id === user?.therapistId) || { name: user?.name || 'Rahul Sharma' };

  const todayStr = new Date().toISOString().split('T')[0];

  const todayApps = appointments.filter((a) => a.appointmentDate === todayStr);
  const upcomingApps = appointments.filter((a) => a.appointmentDate > todayStr && a.status !== 'Cancelled');
  const pendingApps = appointments.filter((a) => a.status === 'Pending');
  const completedApps = appointments.filter((a) => a.status === 'Completed');
  const cancelledApps = appointments.filter((a) => a.status === 'Cancelled');

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Welcome, Dr. {user?.name || 'Rahul Sharma'}</h1>
          <p className="admin-page-subtitle">Your daily clinical schedule, assigned patient consultations, and appointment requests.</p>
        </div>

        <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('appointments')}>
          <Calendar size={16} /> View All My Appointments
        </button>
      </div>

      {/* KPI Statistics derived from MongoDB */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Today's Visits</span>
            <span className="stat-value" style={{ color: 'var(--primary)' }}>{todayApps.length}</span>
          </div>
          <div className="stat-icon-wrapper" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Calendar size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Upcoming</span>
            <span className="stat-value">{upcomingApps.length}</span>
          </div>
          <div className="stat-icon-wrapper" style={{ background: 'var(--secondary-light)', color: 'var(--secondary)' }}>
            <Clock size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Pending Approval</span>
            <span className="stat-value" style={{ color: 'var(--status-pending)' }}>{pendingApps.length}</span>
          </div>
          <div className="stat-icon-wrapper" style={{ background: 'var(--status-pending-bg)', color: 'var(--status-pending)' }}>
            <AlertCircle size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Completed Care</span>
            <span className="stat-value" style={{ color: 'var(--status-completed)' }}>{completedApps.length}</span>
          </div>
          <div className="stat-icon-wrapper" style={{ background: 'var(--status-completed-bg)', color: 'var(--status-completed)' }}>
            <CheckCircle size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Cancelled</span>
            <span className="stat-value" style={{ color: 'var(--status-cancelled)' }}>{cancelledApps.length}</span>
          </div>
          <div className="stat-icon-wrapper" style={{ background: 'var(--status-cancelled-bg)', color: 'var(--status-cancelled)' }}>
            <XCircle size={24} />
          </div>
        </div>
      </div>

      {/* Appointments List Preview */}
      <div className="table-card" style={{ marginTop: '1.5rem' }}>
        <div className="table-toolbar">
          <h3 className="chart-card-title">My Assigned Consultations (MongoDB)</h3>
          <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('appointments')}>
            My Appointments ({appointments.length})
          </button>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Patient Name</th>
                <th>Condition</th>
                <th>Therapy</th>
                <th>Date & Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.slice(0, 5).map((app) => (
                <tr key={app._id || app.id}>
                  <td style={{ fontWeight: 800, fontFamily: 'monospace' }}>{app.bookingId || app.id}</td>
                  <td style={{ fontWeight: 600 }}>{app.patientName} ({app.age} {app.gender})</td>
                  <td>{app.condition}</td>
                  <td>{app.therapy}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{app.appointmentDate || app.date}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>{app.appointmentTime || app.time}</div>
                  </td>
                  <td>
                    <span className={`badge badge-${app.status?.toLowerCase()}`}>{app.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TherapistDashboardOverview;
