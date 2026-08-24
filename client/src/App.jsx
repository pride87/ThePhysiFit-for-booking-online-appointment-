import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import PublicHomePage from './pages/PublicHomePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import TherapistLoginPage from './pages/TherapistLoginPage';
import TherapistDashboardPage from './pages/TherapistDashboardPage';

// Import Design System CSS
import './styles/main.css';
import './styles/navbar.css';
import './styles/hero.css';
import './styles/conditions.css';
import './styles/therapies.css';
import './styles/therapists.css';
import './styles/appointment.css';
import './styles/reviews.css';
import './styles/contact.css';
import './styles/footer.css';
import './styles/admin.css';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <DataProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicHomePage />} />
              <Route path="/therapies" element={<PublicHomePage />} />
              <Route path="/conditions" element={<PublicHomePage />} />
              <Route path="/therapists" element={<PublicHomePage />} />
              <Route path="/contact" element={<PublicHomePage />} />
              <Route path="/book-appointment" element={<PublicHomePage />} />

              {/* Admin Auth & Dashboard Routes */}
              <Route path="/admin-login" element={<AdminLoginPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/:tab" element={<AdminDashboardPage />} />

              {/* Therapist Auth & Dashboard Routes */}
              <Route path="/therapist-login" element={<TherapistLoginPage />} />
              <Route path="/therapist/login" element={<TherapistLoginPage />} />
              <Route path="/therapist-dashboard" element={<TherapistDashboardPage />} />
              <Route path="/therapist" element={<TherapistDashboardPage />} />
              <Route path="/therapist/:tab" element={<TherapistDashboardPage />} />

              {/* Fallback Catch-all Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </DataProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
