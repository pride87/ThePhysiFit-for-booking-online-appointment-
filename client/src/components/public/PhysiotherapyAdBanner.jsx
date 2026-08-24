import React from 'react';
import { Activity, Award, CheckCircle, Calendar, Sparkles } from 'lucide-react';

const PhysiotherapyAdBanner = ({ onOpenBooking }) => {
  return (
    <section className="section" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #0f766e 100%)', color: '#ffffff', padding: '4.5rem 0', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative Blur Circles */}
      <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(13, 148, 136, 0.25)', filter: 'blur(70px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(14, 165, 233, 0.2)', filter: 'blur(70px)', pointerEvents: 'none' }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(10px)', padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8', marginBottom: '1.25rem', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <Sparkles size={16} /> Advanced Rehabilitation & Care
            </div>

            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: '1.25rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
              # Physiotherapy
            </h1>

            <p style={{ fontSize: '1.1rem', lineHeight: 1.65, color: '#cbd5e1', marginBottom: '2rem', maxWidth: '580px' }}>
              Experience state-of-the-art physical therapy, pain management, and specialized motor recovery tailored to your unique lifestyle. Recover faster with certified clinical specialists.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.98rem', color: '#f1f5f9' }}>
                <CheckCircle size={20} style={{ color: '#2dd4bf', flexShrink: 0 }} />
                <span>Evidence-based clinical assessment & personalized recovery plan</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.98rem', color: '#f1f5f9' }}>
                <CheckCircle size={20} style={{ color: '#2dd4bf', flexShrink: 0 }} />
                <span>Non-invasive electrotherapy, dry needling & chiropractic alignment</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.98rem', color: '#f1f5f9' }}>
                <CheckCircle size={20} style={{ color: '#2dd4bf', flexShrink: 0 }} />
                <span>Flexible scheduling & quick online booking with UPI payment support</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              <button className="btn btn-primary btn-lg" onClick={onOpenBooking} style={{ padding: '0.9rem 2rem', fontSize: '1.05rem', background: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)', border: 'none', boxShadow: '0 10px 25px -5px rgba(13, 148, 136, 0.5)' }}>
                <Calendar size={20} /> Book Appointment Now
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', maxWidth: '440px', width: '100%' }}>
              <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '4px solid rgba(255, 255, 255, 0.1)' }}>
                <img
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80"
                  alt="Professional Physiotherapy Care Banner"
                  style={{ width: '100%', height: '360px', objectFit: 'cover', display: 'block' }}
                />
              </div>

              <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', background: '#ffffff', color: '#0f172a', padding: '1rem 1.25rem', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={24} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>100% Dedicated</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Patient Care Excellence</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhysiotherapyAdBanner;
