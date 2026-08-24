import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  CalendarDays,
  UserCheck,
  Stethoscope,
  Activity,
  Users,
  Star,
  DollarSign,
  MessageSquare,
  Settings,
  User,
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

const AdminSidebar = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const { role, logout } = useAuth();
  const { appointments, reviews, inquiries } = useData();

  const pendingAppointmentsCount = appointments.filter((a) => a.status === 'Pending').length;
  const pendingReviewsCount = reviews.filter((r) => r.status === 'pending').length;
  const newInquiriesCount = inquiries.filter((i) => i.status === 'New').length;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'receptionist', 'therapist'] },
    { id: 'appointments', label: 'Appointments', icon: Calendar, badge: pendingAppointmentsCount, roles: ['admin', 'receptionist', 'therapist'] },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays, roles: ['admin', 'receptionist', 'therapist'] },
    { id: 'therapists', label: 'Therapists', icon: UserCheck, roles: ['admin'] },
    { id: 'availability', label: 'Availability', icon: CalendarDays, roles: ['admin', 'therapist'] },
    { id: 'therapies', label: 'Therapies', icon: Stethoscope, roles: ['admin'] },
    { id: 'conditions', label: 'Conditions', icon: Activity, roles: ['admin'] },
    { id: 'patients', label: 'Patients', icon: Users, roles: ['admin', 'receptionist', 'therapist'] },
    { id: 'reviews', label: 'Reviews', icon: Star, badge: pendingReviewsCount, roles: ['admin', 'receptionist'] },
    { id: 'pricing', label: 'Pricing', icon: DollarSign, roles: ['admin'] },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: newInquiriesCount, roles: ['admin', 'receptionist'] },
    { id: 'settings', label: 'Website Settings', icon: Settings, roles: ['admin'] },
    { id: 'profile', label: 'Admin Profile', icon: User, roles: ['admin', 'receptionist', 'therapist'] }
  ];

  const allowedItems = menuItems.filter((item) => item.roles.includes(role || 'admin'));

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="admin-sidebar-header">
        <div className="nav-brand-icon">
          <Activity size={22} />
        </div>
        <div className="admin-brand-logo">
          ThePhysiFit <span style={{ fontSize: '0.75rem', color: 'var(--primary-light)', display: 'block', fontWeight: 500 }}>Control Panel</span>
        </div>
        <button
          className="modal-close"
          style={{ marginLeft: 'auto', display: isOpen ? 'block' : 'none' }}
          onClick={onClose}
        >
          <X size={18} />
        </button>
      </div>

      <nav className="admin-sidebar-nav">
        {allowedItems.map((item) => {
          const IconComp = item.icon;
          const isActive = activeTab === item.id;
          return (
            <div
              key={item.id}
              className={`admin-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                if (onClose) onClose();
              }}
            >
              <div className="admin-nav-item-left">
                <IconComp size={18} />
                <span>{item.label}</span>
              </div>
              {item.badge > 0 && (
                <span className="nav-badge-count">{item.badge}</span>
              )}
            </div>
          );
        })}
      </nav>

      <div className="admin-sidebar-footer">
        <button
          className="admin-nav-item"
          style={{ width: '100%', color: 'var(--status-cancelled)' }}
          onClick={logout}
        >
          <div className="admin-nav-item-left">
            <LogOut size={18} />
            <span>Logout</span>
          </div>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
