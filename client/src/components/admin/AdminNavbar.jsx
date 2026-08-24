import React from 'react';
import { Search, ExternalLink, Menu, User, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import RoleBadge from './RoleBadge';

const AdminNavbar = ({ onToggleMobileSidebar, searchGlobal, setSearchGlobal }) => {
  const { user, role, switchRole } = useAuth();

  return (
    <header className="admin-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          className="mobile-toggle"
          style={{ display: 'block', background: 'none' }}
          onClick={onToggleMobileSidebar}
        >
          <Menu size={22} />
        </button>

        <div className="admin-nav-search">
          <Search size={16} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Global search appointments, patients..."
            value={searchGlobal || ''}
            onChange={(e) => setSearchGlobal && setSearchGlobal(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-navbar-actions">
        {/* Role Switcher preview for testing */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Preview Role:</span>
          <select
            className="role-switcher-select"
            value={role}
            onChange={(e) => switchRole(e.target.value)}
          >
            <option value="admin">Admin (Full Access)</option>
            <option value="receptionist">Receptionist</option>
            <option value="therapist">Therapist</option>
          </select>
        </div>

        {/* Public Site Link */}
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="btn btn-outline btn-sm"
          style={{ gap: '0.35rem' }}
        >
          <ExternalLink size={14} /> Public Website
        </a>

        {/* User Info */}
        <div className="admin-user-profile">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
            alt="Admin Avatar"
            className="admin-user-avatar"
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--dark)' }}>
              {user?.name || 'ADMINISTRATOR'}
            </span>
            <RoleBadge role={role} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
