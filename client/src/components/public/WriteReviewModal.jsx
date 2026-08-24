import React, { useState } from 'react';
import { X, Star, Send } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

const WriteReviewModal = ({ isOpen, onClose }) => {
  const { therapies, therapists, addReview } = useData();
  const { showToast } = useToast();

  const [patientName, setPatientName] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [selectedTherapy, setSelectedTherapy] = useState(therapies[0]?.name || '');
  const [selectedTherapist, setSelectedTherapist] = useState(therapists[0]?.name || '');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!patientName || !reviewText) {
      showToast('Please fill out your name and review text', 'warning');
      return;
    }

    addReview({
      patientName,
      rating,
      review: reviewText,
      therapyName: selectedTherapy,
      therapistName: selectedTherapist
    });

    showToast('Thank you! Your review has been submitted for admin approval.', 'success');
    setPatientName('');
    setReviewText('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Write a Patient Review</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Share your treatment experience to help others find quality physiotherapy care.
            </p>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Your Full Name *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Sarah Jenkins"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Rating *</label>
              <div style={{ display: 'flex', gap: '0.4rem', cursor: 'pointer' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={28}
                    fill={star <= rating ? '#f59e0b' : 'none'}
                    color={star <= rating ? '#f59e0b' : '#cbd5e1'}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Therapy Received</label>
              <select
                className="form-select"
                value={selectedTherapy}
                onChange={(e) => setSelectedTherapy(e.target.value)}
              >
                {therapies.map((t) => (
                  <option key={t.id} value={t.name}>{t.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Therapist</label>
              <select
                className="form-select"
                value={selectedTherapist}
                onChange={(e) => setSelectedTherapist(e.target.value)}
              >
                {therapists.map((d) => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Review Experience *</label>
              <textarea
                required
                rows={4}
                className="form-textarea"
                placeholder="Describe how your mobility or symptoms improved after your sessions..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Send size={16} /> Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WriteReviewModal;
