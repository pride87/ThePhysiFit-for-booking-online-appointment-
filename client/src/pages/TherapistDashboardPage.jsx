import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminNavbar from '../components/admin/AdminNavbar';
import TherapistDashboardOverview from '../components/therapist/views/TherapistDashboardOverview';
import TherapistAppointments from '../components/therapist/views/TherapistAppointments';
import PatientManagement from '../components/admin/views/PatientManagement';
import ContactManagement from '../components/admin/views/ContactManagement';
import AvailabilityManagement from '../components/admin/views/AvailabilityManagement';
import AdminProfile from '../components/admin/views/AdminProfile';

const TherapistDashboardPage = () => {
  const { isAuthenticated, user, role, loading } = useAuth();
  const { appointments, inquiries } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active tab from URL path (e.g. /therapist/appointments -> 'appointments')
  const getTabFromPath = () => {
    const path = location.pathname.replace('/therapist', '').replace('/', '');
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
      navigate('/therapist');
    } else {
      navigate(`/therapist/${tab}`);
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading portal...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/therapist-login" replace />;
  }

  if (role !== 'therapist' && role !== 'admin') {
    return <Navigate to="/admin" replace />;
  }

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <TherapistDashboardOverview setActiveTab={handleTabChange} appointments={appointments} />;
      case 'appointments':
        return <TherapistAppointments appointments={appointments} />;
      case 'patients':
        return <PatientManagement />;
      case 'messages':
        return <ContactManagement />;
      case 'availability':
        return <AvailabilityManagement />;
      case 'profile':
        return <AdminProfile />;
      default:
        return <TherapistDashboardOverview setActiveTab={handleTabChange} appointments={appointments} />;
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

export default TherapistDashboardPage;
