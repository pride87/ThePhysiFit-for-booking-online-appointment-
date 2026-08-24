import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminNavbar from '../components/admin/AdminNavbar';
import AdminDashboard from '../components/admin/views/AdminDashboard';
import TherapistManagement from '../components/admin/views/TherapistManagement';
import TherapyManagement from '../components/admin/views/TherapyManagement';
import ConditionManagement from '../components/admin/views/ConditionManagement';
import AppointmentManagement from '../components/admin/views/AppointmentManagement';
import AdminCalendarView from '../components/admin/views/AdminCalendarView';
import AvailabilityManagement from '../components/admin/views/AvailabilityManagement';
import PatientManagement from '../components/admin/views/PatientManagement';
import ReviewManagement from '../components/admin/views/ReviewManagement';
import PricingManagement from '../components/admin/views/PricingManagement';
import ContactManagement from '../components/admin/views/ContactManagement';
import WebsiteSettings from '../components/admin/views/WebsiteSettings';
import AdminProfile from '../components/admin/views/AdminProfile';

const AdminDashboardPage = () => {
  const { isAuthenticated, role, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getTabFromPath = () => {
    const path = location.pathname.replace('/admin', '').replace('/', '');
    if (!path || path === 'dashboard') return 'dashboard';
    return path;
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchGlobal, setSearchGlobal] = useState('');

  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'dashboard') {
      navigate('/admin-dashboard');
    } else {
      navigate(`/admin/${tab}`);
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading Admin Panel...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }

  if (role !== 'admin') {
    return <Navigate to="/therapist-dashboard" replace />;
  }

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard setActiveTab={handleTabChange} />;
      case 'appointments':
        return <AppointmentManagement />;
      case 'calendar':
        return <AdminCalendarView />;
      case 'therapists':
        return <TherapistManagement />;
      case 'availability':
        return <AvailabilityManagement />;
      case 'therapies':
        return <TherapyManagement />;
      case 'conditions':
        return <ConditionManagement />;
      case 'patients':
        return <PatientManagement />;
      case 'reviews':
        return <ReviewManagement />;
      case 'pricing':
        return <PricingManagement />;
      case 'messages':
        return <ContactManagement />;
      case 'settings':
        return <WebsiteSettings />;
      case 'profile':
        return <AdminProfile />;
      default:
        return <AdminDashboard setActiveTab={handleTabChange} />;
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <div className="admin-main">
        <AdminNavbar
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          searchGlobal={searchGlobal}
          setSearchGlobal={setSearchGlobal}
        />

        <main className="admin-content">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
