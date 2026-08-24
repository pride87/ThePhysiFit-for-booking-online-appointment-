import React from 'react';
import { Activity, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useData } from '../../context/DataContext';

const Footer = ({ onOpenBooking }) => {
  const { settings, therapies } = useData();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1: Clinic Overview */}
          <div className="footer-brand">
            <h3>
              <Activity size={24} style={{ color: 'var(--primary-light)' }} />
              {settings.clinicName || 'ThePhysiFit Clinic'}
            </h3>
            <p>
              {settings.footerTagline || 'Restoring movement, strength, and confidence with personalized evidence-based physical therapy.'}
            </p>
            <div className="social-links">
              {settings.socials?.instagram && (
                <a href={settings.socials.instagram} target="_blank" rel="noreferrer" className="social-link-btn" aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              )}
              {settings.socials?.facebook && (
                <a href={settings.socials.facebook} target="_blank" rel="noreferrer" className="social-link-btn" aria-label="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
              )}
              {settings.socials?.linkedin && (
                <a href={settings.socials.linkedin} target="_blank" rel="noreferrer" className="social-link-btn" aria-label="LinkedIn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              )}
              {settings.socials?.youtube && (
                <a href={settings.socials.youtube} target="_blank" rel="noreferrer" className="social-link-btn" aria-label="YouTube">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links-list">
              <li><a href="#home" className="footer-link">Home</a></li>
              <li><a href="#therapies" className="footer-link">Therapies</a></li>
              <li><a href="#conditions" className="footer-link">Conditions We Treat</a></li>
              <li><a href="#why-us" className="footer-link">Why Choose Us</a></li>
              <li><a href="#reviews" className="footer-link">Patient Reviews</a></li>
              <li><a href="#contact" className="footer-link">Contact Us</a></li>
            </ul>
          </div>

          {/* Col 3: Services */}
          <div>
            <h4 className="footer-title">Services & Therapies</h4>
            <ul className="footer-links-list">
              {therapies.slice(0, 6).map((t) => (
                <li key={t.id}>
                  <a href="#therapies" className="footer-link">{t.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div>
            <h4 className="footer-title">Contact & Clinic Info</h4>
            <ul className="footer-links-list">
              <li style={{ display: 'flex', gap: '0.6rem' }}>
                <Phone size={16} style={{ color: 'var(--primary-light)', flexShrink: 0, marginTop: '3px' }} />
                <span>{settings.phone || '7065411520'}</span>
              </li>
              <li style={{ display: 'flex', gap: '0.6rem' }}>
                <Mail size={16} style={{ color: 'var(--primary-light)', flexShrink: 0, marginTop: '3px' }} />
                <span>{settings.email || 'info@thephysifit.com'}</span>
              </li>
              <li style={{ display: 'flex', gap: '0.6rem' }}>
                <MapPin size={16} style={{ color: 'var(--primary-light)', flexShrink: 0, marginTop: '3px' }} />
                <span>{settings.address || 'ThePhysiFit Rehabilitation Center'}</span>
              </li>
              <li style={{ display: 'flex', gap: '0.6rem' }}>
                <Clock size={16} style={{ color: 'var(--primary-light)', flexShrink: 0, marginTop: '3px' }} />
                <span>{settings.hours || 'Mon - Sat: 9:00 AM - 7:00 PM'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Medical Disclaimer Banner */}
        <div className="footer-disclaimer-bar">
          <strong>Medical Disclaimer:</strong> This website provides general information and appointment booking services. Treatment decisions should be made after direct consultation and clinical assessment with a qualified healthcare professional.
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
          <p>© 2026 ThePhysiFit. All Rights Reserved.</p>
          <p style={{ opacity: 0.8, fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-light)' }}>
            Made by Abhishek Rathor
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
