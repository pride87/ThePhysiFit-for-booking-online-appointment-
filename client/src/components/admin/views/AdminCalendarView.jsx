import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import AppointmentDetailModal from './AppointmentDetailModal';

const AdminCalendarView = () => {
  const { appointments } = useData();
  const [selectedApp, setSelectedApp] = useState(null);

  // Month navigation state
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 7, 1)); // August 2026

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayIndex = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const getAppsForDay = (dayNum) => {
    const formattedDate = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    return appointments.filter((app) => app.date === formattedDate);
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Clinic Schedule Calendar</h1>
          <p className="admin-page-subtitle">Interactive visual monthly calendar of booked patient consultations color-coded by status.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-surface)', padding: '0.4rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <button className="slider-btn" style={{ width: '32px', height: '32px' }} onClick={handlePrevMonth}>
            <ChevronLeft size={18} />
          </button>
          <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--dark)' }}>
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button className="slider-btn" style={{ width: '32px', height: '32px' }} onClick={handleNextMonth}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="table-card" style={{ padding: '1.25rem' }}>
        <div className="calendar-grid">
          {/* Header Row */}
          {weekDays.map((d) => (
            <div key={d} className="calendar-header-day">{d}</div>
          ))}

          {/* Empty Lead Cells */}
          {[...Array(firstDayIndex)].map((_, i) => (
            <div key={`empty-${i}`} className="calendar-cell" style={{ background: 'var(--bg-light)', opacity: 0.5 }} />
          ))}

          {/* Calendar Day Cells */}
          {[...Array(daysInMonth)].map((_, i) => {
            const dayNum = i + 1;
            const dayApps = getAppsForDay(dayNum);
            return (
              <div key={dayNum} className="calendar-cell">
                <div className="calendar-date-num">{dayNum}</div>
                {dayApps.map((app) => (
                  <div
                    key={app.id}
                    className={`calendar-event-pill badge-${app.status?.toLowerCase()}`}
                    onClick={() => setSelectedApp(app)}
                    title={`${app.patientName} (${app.time})`}
                  >
                    {app.time.split(' ')[0]} {app.patientName}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <AppointmentDetailModal
        appointment={selectedApp}
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
      />
    </div>
  );
};

export default AdminCalendarView;
