import React from 'react';
import { Calendar, Compass, ShieldCheck, Award, DollarSign, UserCheck } from 'lucide-react';
import { useData } from '../../context/DataContext';

const Hero = ({ onOpenBooking }) => {
  const { settings } = useData();

  const scrollToTherapies = () => {
    const el = document.querySelector('#therapies');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="hero">
      <div className="container">
        <div className="hero-grid">
          {/* Left Text Column */}
          <div className="hero-content">
            <div className="hero-badge-pill">
              <ShieldCheck size={18} />
              ThePhysiFit Rehabilitation Clinic
            </div>

            <h1 className="hero-title">
              {settings.heroHeading || (
                <>
                  Move Better. <span>Feel Better.</span> Live Better.
                </>
              )}
            </h1>

            <p className="hero-subtitle">
              {settings.heroSubtitle || 'Personalized physiotherapy care from qualified and experienced professionals.'}
            </p>

            <div className="hero-cta-group">
              <button className="btn btn-primary btn-lg" onClick={onOpenBooking}>
                <Calendar size={20} />
                Book Appointment
              </button>

              <button className="btn btn-outline btn-lg" onClick={scrollToTherapies}>
                <Compass size={20} />
                Explore Therapies
              </button>
            </div>

            {/* Trust Indicators Bar */}
            <div className="trust-indicators">
              <div className="trust-item">
                <div className="trust-icon">
                  <Award size={18} />
                </div>
                <div className="trust-text">
                  Certified MPT & BPT Professionals
                </div>
              </div>

              <div className="trust-item">
                <div className="trust-icon">
                  <UserCheck size={18} />
                </div>
                <div className="trust-text">
                  Experienced Specialists
                </div>
              </div>

              <div className="trust-item">
                <div className="trust-icon">
                  <DollarSign size={18} />
                </div>
                <div className="trust-text">
                  Transparent Session Pricing
                </div>
              </div>

              <div className="trust-item">
                <div className="trust-icon">
                  <ShieldCheck size={18} />
                </div>
                <div className="trust-text">
                  Personalized Recovery Plans
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Stack Column */}
          <div className="hero-media">
            <div className="hero-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80"
                alt="Physiotherapist guiding joint mobilization patient"
                className="hero-image"
              />
            </div>

            {/* Floating Card 1 */}
            <div className="hero-floating-card hero-floating-card-1">
              <div className="floating-icon">
                <Award size={22} />
              </div>
              <div className="floating-info">
                <h4>98% Recovery Rate</h4>
                <p>Patient functional improvement</p>
              </div>
            </div>

            {/* Floating Card 2 */}
            <div className="hero-floating-card hero-floating-card-2">
              <div className="floating-icon" style={{ background: 'var(--secondary-light)', color: 'var(--secondary)' }}>
                <UserCheck size={22} />
              </div>
              <div className="floating-info">
                <h4>15+ Years Clinical Exp</h4>
                <p>Specialized physiotherapy team</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
