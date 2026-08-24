import React from 'react';
import { X, Clock, DollarSign, CheckCircle, ShieldAlert, Calendar } from 'lucide-react';
import MedicalDisclaimer from '../common/MedicalDisclaimer';

const TherapyDetailModal = ({ therapy, isOpen, onClose, onBookTherapy }) => {
  if (!isOpen || !therapy) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-card-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{therapy.name} — Details & Benefits</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="therapy-detail-grid">
            <div>
              <img src={therapy.image} alt={therapy.name} className="therapy-detail-img" />
              <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--bg-light)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Session Duration:</span>
                  <strong style={{ color: 'var(--dark)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={14} /> {therapy.duration}
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Session Charges:</span>
                  <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>
                    ₹700 / Session
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Specialization:</span>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>{therapy.specialization}</span>
                </div>
              </div>
            </div>

            <div>
              <h2 style={{ fontSize: '1.6rem', marginBottom: '0.75rem', color: 'var(--dark)' }}>{therapy.name}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                {therapy.description}
              </p>

              {therapy.benefits && therapy.benefits.length > 0 && (
                <>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>Potential Clinical Benefits:</h4>
                  <ul className="benefit-list" style={{ marginBottom: '1.25rem' }}>
                    {therapy.benefits.map((b, i) => (
                      <li key={i} className="benefit-item">
                        <CheckCircle size={16} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {therapy.precautions && (
                <div style={{ padding: '0.85rem', background: '#fff1f2', borderRadius: 'var(--radius-md)', borderLeft: '3px solid #f43f5e', fontSize: '0.85rem', color: '#9f1239', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                    <ShieldAlert size={16} /> Important Precautions
                  </div>
                  {therapy.precautions}
                </div>
              )}
            </div>
          </div>

          <MedicalDisclaimer text="Treatment suitability should be determined by a qualified healthcare professional after comprehensive individual clinical assessment." />
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Close</button>
          <button
            className="btn btn-primary"
            onClick={() => {
              onClose();
              onBookTherapy(therapy.name);
            }}
          >
            <Calendar size={18} />
            Book {therapy.name}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TherapyDetailModal;
