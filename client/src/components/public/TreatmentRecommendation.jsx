import React, { useState } from 'react';
import { HelpCircle, ChevronRight, RotateCcw, Calendar, CheckCircle2 } from 'lucide-react';
import MedicalDisclaimer from '../common/MedicalDisclaimer';

const TreatmentRecommendation = ({ onBookWithRecommendation }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    concern: '',
    duration: '',
    activity: '',
    goal: '',
    preference: ''
  });
  const [result, setResult] = useState(null);

  const questions = [
    {
      key: 'concern',
      title: "What is your primary area of concern or discomfort?",
      options: [
        "Lower or Upper Back Pain",
        "Neck Stiffness or Tech-Neck",
        "Knee or Leg Joint Pain",
        "Shoulder Restriction",
        "Post-Surgical Recovery",
        "Sports / Athletic Injury",
        "General Muscle Soreness"
      ]
    },
    {
      key: 'duration',
      title: "How long have you been experiencing this symptom?",
      options: [
        "Recent (Less than 2 weeks)",
        "Sub-acute (2 to 6 weeks)",
        "Chronic (More than 6 weeks / Recurring)"
      ]
    },
    {
      key: 'activity',
      title: "What best describes your typical daily activity level?",
      options: [
        "Sedentary (Desk work / Minimal exercise)",
        "Lightly Active (Occasional walking)",
        "Active (Regular gym or sport 3x/week)",
        "Competitive Athlete"
      ]
    },
    {
      key: 'goal',
      title: "What is your main rehabilitation objective?",
      options: [
        "Immediate Drug-Free Pain Relief",
        "Post-Operative Strength & Gait Recovery",
        "Posture Correction & Flexibility",
        "Return to High-Performance Sports"
      ]
    },
    {
      key: 'preference',
      title: "What type of treatment approach do you prefer?",
      options: [
        "Hands-On Mobilization & Chiropractic",
        "Electrotherapy & Acoustic Modalities (TENS/Ultrasound)",
        "Targeted Muscle Needling / De-stress Cupping",
        "Active Guided Exercise Rehabilitation"
      ]
    }
  ];

  const handleSelectOption = (key, optionValue) => {
    const updated = { ...answers, [key]: optionValue };
    setAnswers(updated);

    if (step < questions.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      // Calculate tailored recommendation
      generateRecommendation(updated);
    }
  };

  const generateRecommendation = (data) => {
    let suggestedTherapy = "Manual Therapy & Exercise Therapy";
    let suggestedCondition = "General Mobility & Rehabilitation";
    let reasoning = "A customized combination of joint mobilization and gentle strengthening.";

    if (data.concern.includes("Back") || data.preference.includes("Chiropractic")) {
      suggestedTherapy = "Dry Needling & Chiropractic Care";
      suggestedCondition = "Back Pain";
      reasoning = "Targeted spinal realignment combined with deep myofascial needle release for paraspinal tightness.";
    } else if (data.concern.includes("Sports") || data.activity.includes("Athlete")) {
      suggestedTherapy = "Sports Rehabilitation & Ultrasound Therapy";
      suggestedCondition = "Sports Injuries";
      reasoning = "Accelerated deep tissue acoustic healing paired with sport-specific agility conditioning.";
    } else if (data.concern.includes("Post-Surgical") || data.goal.includes("Post-Operative")) {
      suggestedTherapy = "Post-Surgery Rehabilitation & TENS";
      suggestedCondition = "Post-Surgery Rehabilitation";
      reasoning = "Phased surgeon-aligned post-op mobilization and non-invasive electro-neuromodulation pain relief.";
    } else if (data.preference.includes("Cupping") || data.concern.includes("Soreness")) {
      suggestedTherapy = "Cupping Therapy & Dry Needling";
      suggestedCondition = "Muscle Injuries";
      reasoning = "Deep decompressive suction to increase microvascular blood flow and release thick fascial knots.";
    } else if (data.concern.includes("Neck")) {
      suggestedTherapy = "TENS & Manual Therapy";
      suggestedCondition = "Neck Pain";
      reasoning = "Pain nerve blocking paired with gentle cervical joint glides.";
    }

    setResult({
      suggestedTherapy,
      suggestedCondition,
      reasoning
    });
  };

  const handleReset = () => {
    setStep(0);
    setAnswers({ concern: '', duration: '', activity: '', goal: '', preference: '' });
    setResult(null);
  };

  return (
    <section className="section">
      <div className="container">
        <div className="recommendation-quiz-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#67e8f9' }}>
            <HelpCircle size={28} />
            <span style={{ fontWeight: 700, letterSpacing: '1px', fontSize: '0.9rem', textTransform: 'uppercase' }}>
              Interactive Assessment Tool
            </span>
          </div>

          <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>
            Not Sure Which Therapy Is Right For You?
          </h2>
          <p style={{ color: '#e0f2fe', maxWidth: '650px', fontSize: '1.05rem', marginBottom: '2.5rem' }}>
            Answer 5 quick clinical questions to receive tailored physiotherapy therapy suggestions before your appointment.
          </p>

          {!result ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#bae6fd', marginBottom: '0.75rem', fontWeight: 600 }}>
                <span>Question {step + 1} of {questions.length}</span>
                <span>{Math.round(((step + 1) / questions.length) * 100)}% Completed</span>
              </div>

              {/* Progress Bar */}
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '3px', marginBottom: '2rem', overflow: 'hidden' }}>
                <div style={{ width: `${((step + 1) / questions.length) * 100}%`, height: '100%', background: '#38bdf8', transition: 'width 0.3s ease' }} />
              </div>

              <h3 style={{ color: '#ffffff', fontSize: '1.25rem', marginBottom: '1.5rem' }}>
                {questions[step].title}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {questions[step].options.map((opt, idx) => (
                  <button
                    key={idx}
                    className="quiz-option-btn"
                    onClick={() => handleSelectOption(questions[step].key, opt)}
                  >
                    <span>{opt}</span>
                    <ChevronRight size={18} />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="quiz-result-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <CheckCircle2 size={20} />
                Assessment Complete — Suggested Focus
              </div>

              <h3 style={{ fontSize: '1.5rem', color: 'var(--dark)', marginBottom: '0.5rem' }}>
                Suggested Therapy: {result.suggestedTherapy}
              </h3>
              <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '1rem' }}>
                Primary Focus Area: {result.suggestedCondition}
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                <strong>Why this fits:</strong> {result.reasoning}
              </p>

              <MedicalDisclaimer text="These suggestions are informational and should be confirmed with a qualified physiotherapist during your initial consultation." />

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={handleReset}
                >
                  <RotateCcw size={16} /> Retake Assessment
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => onBookWithRecommendation(result.suggestedCondition, result.suggestedTherapy)}
                >
                  <Calendar size={18} /> Book Recommended Assessment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TreatmentRecommendation;
