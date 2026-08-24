import React, { useState } from 'react';
import { Phone, MessageCircle, Calendar, X } from 'lucide-react';

const FloatingActions = ({ onOpenBooking }) => {
  const [showWaMenu, setShowWaMenu] = useState(false);

  const handleCall = () => {
    window.location.href = 'tel:7065411520';
  };

  const openWhatsApp = (num) => {
    const text = encodeURIComponent('Hello ThePhysiFit, I would like to inquire about physiotherapy services.');
    window.open(`https://wa.me/91${num}?text=${text}`, '_blank');
    setShowWaMenu(false);
  };

  return (
    <div className="floating-actions-container" style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
      {/* WhatsApp Popup Options Menu */}
      {showWaMenu && (
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 20px 30px -10px rgba(0,0,0,0.3)',
            padding: '1rem',
            border: '1px solid var(--border-color)',
            minWidth: '230px',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#16a34a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MessageCircle size={16} /> WhatsApp Helpline
            </span>
            <button
              onClick={() => setShowWaMenu(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '2px' }}
            >
              <X size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              onClick={() => openWhatsApp('7065411520')}
              className="btn btn-xs btn-outline"
              style={{ justifyContent: 'flex-start', padding: '0.5rem 0.75rem', borderColor: '#22c55e', color: '#15803d' }}
            >
              💬 WhatsApp 7065411520
            </button>
            <button
              onClick={() => openWhatsApp('9625760114')}
              className="btn btn-xs btn-outline"
              style={{ justifyContent: 'flex-start', padding: '0.5rem 0.75rem', borderColor: '#22c55e', color: '#15803d' }}
            >
              💬 WhatsApp 9625760114
            </button>
            <button
              onClick={() => openWhatsApp('9891050903')}
              className="btn btn-xs btn-outline"
              style={{ justifyContent: 'flex-start', padding: '0.5rem 0.75rem', borderColor: '#22c55e', color: '#15803d' }}
            >
              💬 WhatsApp 9891050903
            </button>
          </div>
        </div>
      )}

      {/* Floating Buttons Group */}
      <div className="floating-actions-bar">
        <button
          className="floating-action-btn floating-btn-call"
          onClick={handleCall}
          title="Call Clinic: 7065411520"
          aria-label="Call 7065411520"
        >
          <Phone size={22} />
        </button>

        <button
          className="floating-action-btn floating-btn-whatsapp"
          onClick={() => setShowWaMenu(!showWaMenu)}
          title="WhatsApp Help (7065411520 / 9625760114 / 9891050903)"
          aria-label="WhatsApp Help"
          style={{ background: '#25D366' }}
        >
          <MessageCircle size={22} />
        </button>

        <button
          className="floating-action-btn floating-btn-book"
          onClick={onOpenBooking}
          title="Book Appointment"
          aria-label="Book Appointment"
        >
          <Calendar size={20} />
          <span className="floating-btn-text">Book Appt</span>
        </button>
      </div>
    </div>
  );
};

export default FloatingActions;
