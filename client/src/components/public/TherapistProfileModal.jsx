import React from 'react';
import { X, Star, Calendar, Award, Globe, Clock, DollarSign, CheckCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { getImageUrl } from '../../utils/imageHelper';

const TherapistProfileModal = ({ therapist, isOpen, onClose, onBookTherapist }) => {
  const { reviews } = useData();
  if (!isOpen || !therapist) return null;

  // Filter approved reviews for this therapist
  const therapistReviews = reviews.filter(
    (r) => r.status === 'approved' && r.therapistName?.toLowerCase().includes(therapist.name.toLowerCase().split(' ')[1] || '')
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-card-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Therapist Profile — {therapist.name}</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="therapist-profile-grid">
            <div>
              <img src={getImageUrl(therapist.photo)} alt={therapist.name} className="profile-avatar-large" />

              <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--bg-light)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Consultation Fee:</span>
                  <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>${therapist.consultationFee}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Clinical Exp:</span>
                  <strong style={{ color: 'var(--dark)', fontSize: '0.9rem' }}>{therapist.experience} Years</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Gender:</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{therapist.gender}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Patient Rating:</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f59e0b', fontWeight: 700, fontSize: '0.9rem' }}>
                    <Star size={14} fill="#f59e0b" /> {therapist.rating} ({therapist.reviewsCount || 40}+)
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <h2 style={{ fontSize: '1.6rem', color: 'var(--dark)' }}>{therapist.name}</h2>
                <span className="badge badge-active">{therapist.qualification}</span>
              </div>
              <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '1rem' }}>
                {therapist.specialization}
              </p>

              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                {therapist.about}
              </p>

              <h4 className="profile-section-title">Certifications & Expertise</h4>
              <div className="cert-tags" style={{ marginBottom: '1.25rem' }}>
                {therapist.certifications?.map((c, i) => (
                  <span key={i} className="cert-tag">
                    <Award size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    {c}
                  </span>
                ))}
              </div>

              <h4 className="profile-section-title">Languages Spoken</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Globe size={16} style={{ color: 'var(--primary)' }} />
                {therapist.languages?.join(', ')}
              </p>

              <h4 className="profile-section-title">Weekly Consultation Schedule</h4>
              <div style={{ background: 'var(--primary-light)', padding: '0.85rem 1.15rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', color: 'var(--primary-dark)', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  <Clock size={16} /> Available Days: {therapist.availableDays?.join(', ')}
                </div>
                <div>Working Hours: {therapist.availableTime || '9:00 AM - 5:00 PM'}</div>
              </div>

              {therapistReviews.length > 0 && (
                <>
                  <h4 className="profile-section-title">Patient Testimonials</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    {therapistReviews.slice(0, 2).map((rev) => (
                      <div key={rev.id} style={{ background: 'var(--bg-light)', padding: '0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <strong>{rev.patientName}</strong>
                          <span style={{ color: '#f59e0b', fontWeight: 700 }}>★ {rev.rating}</span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', italic: 'true' }}>"{rev.review}"</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Close</button>
          <button
            className="btn btn-primary"
            onClick={() => {
              onClose();
              onBookTherapist(therapist.id);
            }}
          >
            <Calendar size={18} />
            Book Appointment with {therapist.name}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TherapistProfileModal;
