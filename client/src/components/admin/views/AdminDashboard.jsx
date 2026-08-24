import React from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  UserCheck,
  Stethoscope,
  Users,
  Plus,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useData } from '../../../context/DataContext';

const AdminDashboard = ({ setActiveTab }) => {
  const { stats, appointments = [], therapies = [], therapists = [] } = useData();

  // Appointments by day of week calculated dynamically from actual MongoDB appointments data
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dayCounts = daysOfWeek.map((_, idx) => {
    return appointments.filter((app) => {
      const dateStr = app.appointmentDate || app.date;
      if (!dateStr) return false;
      const dateObj = new Date(dateStr);
      if (isNaN(dateObj.getTime())) return false;
      const jsDayIndex = dateObj.getDay();
      const mappedIndex = jsDayIndex === 0 ? 6 : jsDayIndex - 1; // Map Sun(0)->6, Mon(1)->0...
      return mappedIndex === idx;
    }).length;
  });

  const maxDayCount = Math.max(...dayCounts, 1);

  // Therapy volume calculated directly from actual MongoDB appointments
  const therapyCounts = therapies.slice(0, 5).map((t) => ({
    name: t.name,
    count: appointments.filter((a) => a.therapy === t.name || a.condition === t.name).length
  }));

  const maxTherapyCount = Math.max(...therapyCounts.map((t) => t.count), 1);

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Clinic Operational Dashboard</h1>
          <p className="admin-page-subtitle">Real-time statistics, booking metrics, and therapist performance overview.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('therapists')}>
            <Plus size={14} /> Add Therapist
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('appointments')}>
            <Calendar size={14} /> Manage Bookings
          </button>
        </div>
      </div>

      {/* KPI Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Total Therapists</span>
            <span className="stat-value">{therapists.length}</span>
          </div>
          <div className="stat-icon-wrapper" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <UserCheck size={26} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Active Therapists</span>
            <span className="stat-value">{therapists.filter((t) => t.status === 'active').length}</span>
          </div>
          <div className="stat-icon-wrapper" style={{ background: '#dcfce7', color: '#15803d' }}>
            <Stethoscope size={26} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Total Appointments</span>
            <span className="stat-value">{stats.totalAppointments || 0}</span>
          </div>
          <div className="stat-icon-wrapper" style={{ background: 'var(--secondary-light)', color: 'var(--secondary)' }}>
            <Calendar size={26} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Pending Appointments</span>
            <span className="stat-value" style={{ color: 'var(--status-pending)' }}>{stats.pendingAppointments || 0}</span>
          </div>
          <div className="stat-icon-wrapper" style={{ background: 'var(--status-pending-bg)', color: 'var(--status-pending)' }}>
            <Clock size={26} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Completed Appointments</span>
            <span className="stat-value" style={{ color: 'var(--status-completed)' }}>{stats.completedAppointments || 0}</span>
          </div>
          <div className="stat-icon-wrapper" style={{ background: 'var(--status-completed-bg)', color: 'var(--status-completed)' }}>
            <CheckCircle size={26} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Total Messages</span>
            <span className="stat-value">{stats.totalMessages || 0}</span>
          </div>
          <div className="stat-icon-wrapper" style={{ background: '#e0e7ff', color: '#4338ca' }}>
            <Users size={26} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Unread Messages</span>
            <span className="stat-value" style={{ color: '#c2410c' }}>{stats.newMessages || 0}</span>
          </div>
          <div className="stat-icon-wrapper" style={{ background: '#ffedd5', color: '#c2410c' }}>
            <Activity size={26} />
          </div>
        </div>
      </div>

      {/* Interactive Charts */}
      <div className="charts-grid">
        {/* Appointments by Day Bar Chart */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">Weekly Appointment Distribution</h3>
            <span className="badge badge-active">Live Metrics</span>
          </div>

          <div className="css-bar-chart">
            {daysOfWeek.map((day, idx) => {
              const val = dayCounts[idx];
              const heightPct = maxDayCount > 0 ? (val / maxDayCount) * 100 : 0;
              return (
                <div key={day} className="chart-bar-group">
                  <div className="chart-bar-track" style={{ height: `${Math.max(12, heightPct)}%` }}>
                    <span className="chart-bar-value">{val}</span>
                  </div>
                  <span className="chart-bar-label">{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Therapy Volume Distribution */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-card-title">Top Therapy Modalities Volume</h3>
            <TrendingUp size={18} style={{ color: 'var(--primary)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            {therapyCounts.map((t) => {
              const pct = maxTherapyCount > 0 ? Math.round((t.count / maxTherapyCount) * 100) : 0;
              return (
                <div key={t.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                    <strong style={{ color: 'var(--dark)' }}>{t.name}</strong>
                    <span style={{ color: 'var(--text-secondary)' }}>{t.count} sessions</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${t.count === 0 ? 0 : Math.max(8, pct)}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Bookings Stream Table */}
      <div className="table-card">
        <div className="table-toolbar">
          <h3 className="chart-card-title">Recent Appointment Requests</h3>
          <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('appointments')}>
            View All ({appointments.length})
          </button>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Patient Name</th>
                <th>Therapist</th>
                <th>Therapy</th>
                <th>Date & Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.slice(0, 5).map((app) => (
                <tr key={app.id || app._id}>
                  <td style={{ fontWeight: 700, fontFamily: 'monospace' }}>{app.bookingId || app.id || app._id}</td>
                  <td style={{ fontWeight: 600 }}>{app.patientName}</td>
                  <td>{app.therapistName || 'Unassigned'}</td>
                  <td>{app.therapy || app.condition}</td>
                  <td>{app.appointmentDate || app.date} at {app.appointmentTime || app.time}</td>
                  <td>
                    <span className={`badge badge-${app.status?.toLowerCase()}`}>
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    No appointment requests logged yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
