import React, { useState } from 'react';
import { Clock, Calendar, Check, Save } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useToast } from '../../../context/ToastContext';

const AvailabilityManagement = () => {
  const { therapists, updateTherapistAvailability } = useData();
  const { showToast } = useToast();

  const [selectedTherapistId, setSelectedTherapistId] = useState(therapists[0]?.id || '');
  const therapist = therapists.find((d) => d.id === selectedTherapistId) || therapists[0];

  const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [selectedDays, setSelectedDays] = useState(therapist?.availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  const [timeRange, setTimeRange] = useState(therapist?.availableTime || '9:00 AM - 5:00 PM');

  const handleTherapistSelect = (id) => {
    setSelectedTherapistId(id);
    const target = therapists.find((d) => d.id === id);
    if (target) {
      setSelectedDays(target.availableDays || []);
      setTimeRange(target.availableTime || '9:00 AM - 5:00 PM');
    }
  };

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!therapist) return;
    updateTherapistAvailability(therapist.id, selectedDays, timeRange);
    showToast(`Updated schedule for ${therapist.name}!`, 'success');
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Therapist Availability & Shift Schedules</h1>
          <p className="admin-page-subtitle">Configure working days, consultation shift hours, and block out dates. Public booking system enforces these constraints live.</p>
        </div>
      </div>

      <div className="table-card" style={{ padding: '2rem' }}>
        <div style={{ maxWidth: '650px' }}>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Select Specialist Therapist</label>
            <select
              className="form-select"
              value={selectedTherapistId}
              onChange={(e) => handleTherapistSelect(e.target.value)}
            >
              {therapists.map((d) => (
                <option key={d.id} value={d.id}>{d.name} ({d.qualification})</option>
              ))}
            </select>
          </div>

          {therapist && (
            <form onSubmit={handleSave}>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Weekly Working Days</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginTop: '0.5rem' }}>
                  {allDays.map((day) => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <button
                        type="button"
                        key={day}
                        className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => toggleDay(day)}
                      >
                        {isSelected && <Check size={14} />} {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '2rem' }}>
                <label className="form-label">Daily Shift Hours</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 9:00 AM - 3:00 PM"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg">
                <Save size={18} /> Save Availability Schedule
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailabilityManagement;
