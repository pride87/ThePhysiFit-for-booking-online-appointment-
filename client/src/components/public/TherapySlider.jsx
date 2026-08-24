import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Clock, Info, Calendar } from 'lucide-react';
import { useData } from '../../context/DataContext';
import TherapyDetailModal from './TherapyDetailModal';

const TherapySlider = ({ onBookTherapy }) => {
  const { therapies } = useData();
  const activeTherapies = therapies.filter((t) => t.status === 'active');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedTherapy, setSelectedTherapy] = useState(null);

  // Touch tracking
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const cardWidth = 378; // 360px + 18px gap

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % activeTherapies.length);
  }, [activeTherapies.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + activeTherapies.length) % activeTherapies.length);
  }, [activeTherapies.length]);

  // Auto-play timer
  useEffect(() => {
    if (isPaused || activeTherapies.length === 0) return;
    const timer = setInterval(() => {
      handleNext();
    }, 3500);
    return () => clearInterval(timer);
  }, [isPaused, activeTherapies.length, handleNext]);

  // Touch handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
  };

  return (
    <section id="therapies" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">Evidence-Based Care</span>
          <h2 className="section-title">Specialized Physiotherapy Modalities</h2>
          <p className="section-subtitle">
            Explore our state-of-the-art physiotherapy modalities designed to accelerate soft tissue repair, relieve deep muscle spasms, and restore optimal body alignment.
          </p>
        </div>

        <div
          className="therapy-slider-wrapper"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="therapy-slider-track"
            style={{
              transform: `translateX(-${currentIndex * cardWidth}px)`
            }}
          >
            {activeTherapies.map((item) => (
              <div key={item.id} className="therapy-slide-card">
                <div className="therapy-card-img-wrapper">
                  <img src={item.image} alt={item.name} className="therapy-card-img" />
                  <span className="therapy-card-badge">{item.specialization}</span>
                </div>

                <div className="therapy-card-content">
                  <div className="therapy-card-meta">
                    <div className="therapy-card-duration">
                      <Clock size={14} />
                      {item.duration}
                    </div>
                    <div className="therapy-card-price" style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.05rem' }}>
                      ₹700 / Session
                    </div>
                  </div>

                  <h3 className="therapy-card-title">{item.name}</h3>
                  <p className="therapy-card-desc">{item.description}</p>

                  {item.suitableFor && item.suitableFor.length > 0 && (
                    <div className="suitable-tags">
                      {item.suitableFor.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="suitable-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="therapy-card-actions">
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setSelectedTherapy(item)}
                    >
                      <Info size={14} />
                      Learn More
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => onBookTherapy(item.name)}
                    >
                      <Calendar size={14} />
                      Book Therapy
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="slider-controls">
          <button className="slider-btn" onClick={handlePrev} aria-label="Previous Therapy">
            <ChevronLeft size={22} />
          </button>

          <div className="slider-dots">
            {activeTherapies.map((_, idx) => (
              <button
                key={idx}
                className={`slider-dot ${idx === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button className="slider-btn" onClick={handleNext} aria-label="Next Therapy">
            <ChevronRight size={22} />
          </button>
        </div>
      </div>

      {/* Therapy Details Modal */}
      <TherapyDetailModal
        therapy={selectedTherapy}
        isOpen={!!selectedTherapy}
        onClose={() => setSelectedTherapy(null)}
        onBookTherapy={(name) => onBookTherapy(name)}
      />
    </section>
  );
};

export default TherapySlider;
