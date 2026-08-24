import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, CheckCircle2, MessageSquarePlus } from 'lucide-react';
import { useData } from '../../context/DataContext';
import WriteReviewModal from './WriteReviewModal';

const PatientReviews = () => {
  const { reviews } = useData();
  const approvedReviews = reviews.filter((r) => r.status === 'approved');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cardWidth = 398; // 380 + 18 gap

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % approvedReviews.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + approvedReviews.length) % approvedReviews.length);
  };

  return (
    <section id="reviews" className="section section-bg">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">Verified Testimonials</span>
          <h2 className="section-title">What Our Patients Say</h2>
          <p className="section-subtitle">
            Read authentic feedback from patients who restored their movement, recovered from sports injuries, and eliminated pain with ThePhysiFit.
          </p>
        </div>

        <div className="reviews-slider-wrapper">
          <div
            className="reviews-track"
            style={{ transform: `translateX(-${currentIndex * cardWidth}px)` }}
          >
            {approvedReviews.map((rev) => (
              <div key={rev.id} className="review-card">
                <div>
                  <div className="review-header">
                    <img
                      src={rev.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                      alt={rev.patientName}
                      className="review-avatar"
                    />
                    <div className="review-patient-info">
                      <h4 className="review-patient-name">{rev.patientName}</h4>
                      <span className="review-treatment-tag">
                        {rev.therapyName} • {rev.therapistName}
                      </span>
                    </div>
                  </div>

                  <div className="review-rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < rev.rating ? '#f59e0b' : 'none'}
                        color={i < rev.rating ? '#f59e0b' : '#cbd5e1'}
                      />
                    ))}
                  </div>

                  <p className="review-text">"{rev.review}"</p>
                </div>

                <div className="review-footer">
                  <span className="review-verified-badge">
                    <CheckCircle2 size={14} /> Verified Patient
                  </span>
                  <span>{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls & Write Review CTA */}
        <div className="slider-controls" style={{ marginTop: '1rem' }}>
          <button className="slider-btn" onClick={handlePrev} aria-label="Previous Review">
            <ChevronLeft size={22} />
          </button>

          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <MessageSquarePlus size={18} /> Write a Review
          </button>

          <button className="slider-btn" onClick={handleNext} aria-label="Next Review">
            <ChevronRight size={22} />
          </button>
        </div>
      </div>

      {/* Modal */}
      <WriteReviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};

export default PatientReviews;
