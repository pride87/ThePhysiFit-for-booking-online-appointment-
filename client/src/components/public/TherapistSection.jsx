import React, { useState, useMemo } from 'react';
import { Star, Clock, Globe, Award, User, Filter, Calendar, Eye } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { getImageUrl } from '../../utils/imageHelper';
import TherapistProfileModal from './TherapistProfileModal';

const TherapistSection = ({ onBookTherapist }) => {
  const { therapists } = useData();
  const [selectedTherapist, setSelectedTherapist] = useState(null);

  // Filters
  const [genderFilter, setGenderFilter] = useState('All');
  const [qualFilter, setQualFilter] = useState('All');
  const [expFilter, setExpFilter] = useState('All');
  const [specFilter, setSpecFilter] = useState('All');

  // Extract unique filter options dynamically
  const uniqueQualifications = useMemo(() => {
    const set = new Set();
    therapists.forEach((t) => {
      if (t.qualification) {
        if (t.qualification.includes('MPT')) set.add('MPT');
        else if (t.qualification.includes('BPT')) set.add('BPT');
      }
    });
    return Array.from(set);
  }, [therapists]);

  const uniqueSpecializations = useMemo(() => {
    const set = new Set(therapists.map((t) => t.specialization).filter(Boolean));
    return Array.from(set);
  }, [therapists]);

  const filteredTherapists = useMemo(() => {
    return therapists.filter((t) => {
      if (t.status !== 'active') return false;
      if (genderFilter !== 'All' && t.gender !== genderFilter) return false;
      if (qualFilter !== 'All' && !t.qualification?.includes(qualFilter)) return false;
      if (specFilter !== 'All' && t.specialization !== specFilter) return false;
      if (expFilter === '5+' && t.experience < 5) return false;
      if (expFilter === '8+' && t.experience < 8) return false;
      if (expFilter === '10+' && t.experience < 10) return false;
      return true;
    });
  }, [therapists, genderFilter, qualFilter, expFilter, specFilter]);

  return (
    <section id="therapists" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">Experienced Medical Team</span>
          <h2 className="section-title">Meet Our Physiotherapists</h2>
          <p className="section-subtitle">
            Board-certified MPT & BPT clinical practitioners dedicated to evidence-based rehabilitation, spinal decompression, and athletic performance recovery.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="therapists-filter-bar">
          <div className="filter-group-wrapper">
            <div className="filter-item">
              <Filter size={16} style={{ color: 'var(--primary)' }} />
              <span className="filter-label">Gender:</span>
              <select
                className="filter-select"
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
              >
                <option value="All">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="filter-item">
              <span className="filter-label">Qualification:</span>
              <select
                className="filter-select"
                value={qualFilter}
                onChange={(e) => setQualFilter(e.target.value)}
              >
                <option value="All">All Degrees</option>
                {uniqueQualifications.map((q) => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </div>

            <div className="filter-item">
              <span className="filter-label">Experience:</span>
              <select
                className="filter-select"
                value={expFilter}
                onChange={(e) => setExpFilter(e.target.value)}
              >
                <option value="All">Any Experience</option>
                <option value="5+">5+ Years</option>
                <option value="8+">8+ Years</option>
                <option value="10+">10+ Years</option>
              </select>
            </div>

            <div className="filter-item">
              <span className="filter-label">Specialization:</span>
              <select
                className="filter-select"
                value={specFilter}
                onChange={(e) => setSpecFilter(e.target.value)}
              >
                <option value="All">All Specializations</option>
                {uniqueSpecializations.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {(genderFilter !== 'All' || qualFilter !== 'All' || expFilter !== 'All' || specFilter !== 'All') && (
            <button
              className="btn btn-outline btn-sm"
              onClick={() => {
                setGenderFilter('All');
                setQualFilter('All');
                setExpFilter('All');
                setSpecFilter('All');
              }}
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Therapist Cards Grid */}
        <div className="therapists-grid">
          {filteredTherapists.map((doc) => (
            <div key={doc.id} className="therapist-card">
              <div className="therapist-card-header">
                <img src={getImageUrl(doc.photo)} alt={doc.name} className="therapist-photo" />

                <div className="therapist-rating-pill">
                  <Star size={14} fill="#f59e0b" />
                  {doc.rating}
                </div>

                <div className="therapist-card-overlay">
                  <div className="therapist-badge-group">
                    <span className="badge badge-active">{doc.qualification}</span>
                    <span className="badge badge-confirmed" style={{ background: 'rgba(255,255,255,0.9)', color: 'var(--dark)' }}>
                      {doc.experience} Yrs Exp
                    </span>
                  </div>
                </div>
              </div>

              <div className="therapist-card-body">
                <h3 className="therapist-name">{doc.name}</h3>
                <div className="therapist-qual">{doc.specialization}</div>

                <div className="therapist-info-list">
                  <div className="therapist-info-row">
                    <Globe size={14} />
                    <span>Languages: {doc.languages?.join(', ')}</span>
                  </div>
                  <div className="therapist-info-row">
                    <Clock size={14} />
                    <span>Availability: {doc.availableTime}</span>
                  </div>
                  <div className="therapist-info-row">
                    <User size={14} />
                    <span>Gender: {doc.gender}</span>
                  </div>
                </div>

                <div className="therapist-card-footer">
                  <div className="therapist-fee-box">
                    <span className="fee-label">Consultation Fee</span>
                    <span className="fee-amount">${doc.consultationFee}</span>
                  </div>

                  <div className="therapist-card-actions">
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setSelectedTherapist(doc)}
                    >
                      <Eye size={14} />
                      Profile
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => onBookTherapist(doc.id)}
                    >
                      <Calendar size={14} />
                      Book
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTherapists.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>No therapists matched your filter criteria.</p>
            <button className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }} onClick={() => {
              setGenderFilter('All'); setQualFilter('All'); setExpFilter('All'); setSpecFilter('All');
            }}>
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      <TherapistProfileModal
        therapist={selectedTherapist}
        isOpen={!!selectedTherapist}
        onClose={() => setSelectedTherapist(null)}
        onBookTherapist={(id) => onBookTherapist(id)}
      />
    </section>
  );
};

export default TherapistSection;
