import React, { useState } from 'react';
import {
  Activity,
  UserCheck,
  Award,
  ShieldAlert,
  HeartPulse,
  Compass,
  Stethoscope,
  Zap,
  Smile,
  Sun,
  AlertCircle,
  TrendingUp,
  Info,
  Calendar
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import ConditionDetailModal from './ConditionDetailModal';

const iconMap = {
  Activity: Activity,
  UserCheck: UserCheck,
  Award: Award,
  ShieldAlert: ShieldAlert,
  HeartPulse: HeartPulse,
  Compass: Compass,
  Stethoscope: Stethoscope,
  Zap: Zap,
  Smile: Smile,
  Sun: Sun,
  AlertCircle: AlertCircle,
  TrendingUp: TrendingUp
};

const ConditionsWeTreat = ({ onBookCondition }) => {
  const { conditions } = useData();
  const [selectedCondition, setSelectedCondition] = useState(null);

  const activeConditions = conditions.filter((c) => c.status === 'active');

  return (
    <section id="conditions" className="section section-bg">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">Targeted Rehabilitation</span>
          <h2 className="section-title">Conditions We Treat</h2>
          <p className="section-subtitle">
            Comprehensive evidence-based physiotherapy approaches tailored to your specific musculoskeletal, neuromuscular, or post-surgical recovery needs.
          </p>
        </div>

        <div className="conditions-grid">
          {activeConditions.map((item) => {
            const IconComponent = iconMap[item.iconName] || Activity;
            return (
              <div key={item.id} className="condition-card">
                <div>
                  <div className="condition-header">
                    <div className="condition-icon-box">
                      <IconComponent size={24} />
                    </div>
                    <h3 className="condition-title">{item.name}</h3>
                  </div>
                  <p className="condition-desc">{item.shortDescription}</p>
                </div>

                <div className="condition-actions">
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => setSelectedCondition(item)}
                  >
                    <Info size={14} />
                    Learn More
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => onBookCondition(item.name)}
                  >
                    <Calendar size={14} />
                    Book Assessment
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Informational Disclaimer Banner */}
        <div className="condition-disclaimer-notice">
          ℹ️ <strong>Clinical Note:</strong> Physiotherapy may help manage symptoms and improve function depending on the individual's condition. Treatment outcomes vary based on comprehensive evaluation by a qualified health professional.
        </div>
      </div>

      {/* Condition Detail Modal */}
      <ConditionDetailModal
        condition={selectedCondition}
        isOpen={!!selectedCondition}
        onClose={() => setSelectedCondition(null)}
        onBookAssessment={(condName) => onBookCondition(condName)}
      />
    </section>
  );
};

export default ConditionsWeTreat;
