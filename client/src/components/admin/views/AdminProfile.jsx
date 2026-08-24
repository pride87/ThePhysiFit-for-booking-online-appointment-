import React, { useState } from 'react';
import { User, Shield, Key, Save } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import RoleBadge from '../RoleBadge';

const AdminProfile = () => {
  const { user, role } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || 'ADMINISTRATOR');
  const [email, setEmail] = useState(user?.email || 'admin@thephysifit.com');
  const [password, setPassword] = useState('••••••••••••');

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Admin profile updated successfully!', 'success');
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Admin Account Profile</h1>
          <p className="admin-page-subtitle">Manage administrative credentials, security roles, and profile settings.</p>
        </div>
      </div>

      <div className="table-card" style={{ padding: '2rem', maxWidth: '650px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
            alt="Avatar"
            style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--dark)' }}>{name}</h3>
            <div style={{ marginTop: '0.25rem' }}>
              <RoleBadge role={role} />
            </div>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Password (JWT Security Ready)</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            <Save size={16} /> Save Profile Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminProfile;
