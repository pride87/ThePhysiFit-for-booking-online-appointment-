import React, { useState } from 'react';
import { Activity, Menu, X, Calendar, Lock, ShieldCheck, Stethoscope } from 'lucide-react';
import { useData } from '../../context/DataContext';

const Navbar = ({ onOpenBooking, activeSection }) => {
  const { settings } = useData();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'Therapies', href: '#therapies' },
    { label: 'Conditions', href: '#conditions' },
    { label: 'Why Choose Us', href: '#why-us' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Contact', href: '#contact' }
  ];

  const handleNavClick = (href) => {
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className="navbar">
        <div className="container navbar-container">
          {/* Logo */}
          <a href="#home" className="nav-brand">
            <div className="nav-brand-icon">
              <Activity size={24} />
            </div>
            <div className="nav-brand-text">
              {settings.logoText || 'ThePhysiFit'}
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav>
            <ul className="nav-links">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className={`nav-link ${activeSection === item.href.substring(1) ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.href);
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Actions */}
          <div className="nav-actions" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setShowStaffModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Lock size={14} /> Staff Login
            </button>

            <button className="btn btn-primary btn-sm" onClick={() => onOpenBooking()}>
              <Calendar size={16} /> Book Appointment
            </button>

            <button
              className="mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <div className={`mobile-drawer ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(false)}>
        <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
          <div className="mobile-drawer-header">
            <div className="nav-brand">
              <div className="nav-brand-icon">
                <Activity size={20} />
              </div>
              <div className="nav-brand-text">{settings.logoText || 'ThePhysiFit'}</div>
            </div>
            <button className="modal-close" onClick={() => setMobileOpen(false)}>
              <X size={20} />
            </button>
          </div>
          <ul className="mobile-nav-links">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="mobile-nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 'auto', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              className="btn btn-outline"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => {
                setMobileOpen(false);
                setShowStaffModal(true);
              }}
            >
              <Lock size={16} /> Staff Login
            </button>
            <button
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => {
                setMobileOpen(false);
                onOpenBooking();
              }}
            >
              <Calendar size={18} /> Book Appointment Now
            </button>
          </div>
        </div>
      </div>

      {/* STAFF LOGIN MODAL */}
      {showStaffModal && (
        <div className="modal-overlay" onClick={() => setShowStaffModal(false)}>
          <div className="modal-card" style={{ maxWidth: '420px', padding: '2rem' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                <Lock size={24} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--dark)' }}>Staff Login</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Select your authorized portal to sign in to ThePhysiFit
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <a
                href="/admin-login"
                className="btn btn-primary btn-lg"
                style={{ justifyContent: 'center', gap: '0.5rem', width: '100%' }}
              >
                <ShieldCheck size={18} /> Admin Portal Login
              </a>

              <a
                href="/therapist-login"
                className="btn btn-outline btn-lg"
                style={{ justifyContent: 'center', gap: '0.5rem', width: '100%' }}
              >
                <Stethoscope size={18} /> Therapist Portal Login
              </a>
            </div>

            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <button
                type="button"
                className="btn btn-xs btn-outline"
                onClick={() => setShowStaffModal(false)}
              >
                Cancel & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
