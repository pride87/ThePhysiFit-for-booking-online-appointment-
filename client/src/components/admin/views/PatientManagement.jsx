import React, { useState } from 'react';
import { Search, UserCheck } from 'lucide-react';
import { useData } from '../../../context/DataContext';

const PatientManagement = () => {
  const { stats } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatients = stats.patients.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone?.includes(searchQuery) ||
      p.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Patient Directory & Records</h1>
          <p className="admin-page-subtitle">Centralized patient records automatically generated from appointment bookings.</p>
        </div>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <div className="admin-nav-search" style={{ width: '320px' }}>
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search patient name, phone, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Showing {filteredPatients.length} registered patients
          </span>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Age / Gender</th>
                <th>Total Bookings</th>
                <th>Last Consultation</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((p, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 700, color: 'var(--dark)' }}>{p.name}</td>
                  <td>{p.phone}</td>
                  <td>{p.email}</td>
                  <td>{p.age} Yrs • {p.gender}</td>
                  <td style={{ fontWeight: 700, textAlign: 'center' }}>
                    <span className="badge badge-confirmed">{p.appointmentCount}</span>
                  </td>
                  <td>{p.lastAppointment}</td>
                  <td>
                    <span className="badge badge-active">{p.status}</span>
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

export default PatientManagement;
