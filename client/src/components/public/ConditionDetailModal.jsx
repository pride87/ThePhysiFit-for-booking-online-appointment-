import React from 'react';
import { X, CheckCircle, Calendar } from 'lucide-react';
import MedicalDisclaimer from '../common/MedicalDisclaimer';

const ConditionDetailModal = ({ condition, isOpen, onClose, onBookAssessment }) => {
  if (!isOpen || !condition) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-card-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{condition.name} — Condition Overview</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="therapy-detail-grid">
            <div>
              <img
                src={condition.image}
                alt={condition.name}
                className="therapy-detail-img"
              />
            </div>
            <div>
              <span className="badge badge-active" style={{ marginBottom: '0.75rem' }}>
                Assessment & Management
              </span>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{condition.name}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                {condition.fullDescription || condition.shortDescription}
              </p>

              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Recommended Physiotherapy Approaches:
              </h4>
              <ul className="benefit-list">
                {condition.recommendedTherapies?.map((t, idx) => (
                  <li key={idx} className="benefit-item">
                    <CheckCircle size={16} />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <MedicalDisclaimer text="Physiotherapy may help manage symptoms and improve function depending on the individual's condition. Suitability should be determined by a qualified physiotherapist after clinical evaluation." />
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>
            Close
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              onClose();
              onBookAssessment(condition.name);
            }}
          >
            <Calendar size={18} />
            Book Assessment for {condition.name}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConditionDetailModal;
