import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';
import AdminDashboard from './views/AdminDashboard';
import TherapistManagement from './views/TherapistManagement';
import TherapyManagement from './views/TherapyManagement';
import ConditionManagement from './views/ConditionManagement';
import AppointmentManagement from './views/AppointmentManagement';
import AdminCalendarView from './views/AdminCalendarView';
import AvailabilityManagement from './views/AvailabilityManagement';
import PatientManagement from './views/PatientManagement';
import ReviewManagement from './views/ReviewManagement';
import PricingManagement from './views/PricingManagement';
import ContactManagement from './views/ContactManagement';
import WebsiteSettings from './views/WebsiteSettings';
import AdminProfile from './views/AdminProfile';

const AdminLayout = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchGlobal, setSearchGlobal] = useState('');

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard setActiveTab={setActiveTab} />;
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
        return <AdminDashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Workspace Area */}
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

export default AdminLayout;
