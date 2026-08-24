import React from 'react';
import { Award, Users, DollarSign, HeartPulse, Cpu, CalendarCheck } from 'lucide-react';

const WhyChooseUs = ({ onOpenBooking }) => {
  const reasons = [
    {
      icon: Award,
      title: "Qualified Professionals",
      desc: "Licensed MPT (Master of Physiotherapy) and BPT specialists with rigorous clinical clinical education and board certification."
    },
    {
      icon: Users,
      title: "Experienced Team",
      desc: "Transparent specialist profiles detailing years of experience, credentials, patient ratings, and specialized treatment focus."
    },
    {
      icon: DollarSign,
      title: "Transparent Pricing",
      desc: "Clear upfront session rates with zero hidden charges or surprises, ensuring accessible high-quality rehabilitation."
    },
    {
      icon: HeartPulse,
      title: "Personalized Care",
      desc: "Customized physical rehabilitation strategies developed specifically around your individual assessment and life goals."
    },
    {
      icon: Cpu,
      title: "Modern Equipment",
      desc: "Access to advanced physiotherapy modalities including digital TENS electrotherapy, deep acoustic ultrasound, and cupping."
    },
    {
      icon: CalendarCheck,
      title: "Easy Online Booking",
      desc: "Seamless 6-step online appointment scheduling system allowing instant selection of condition, therapist, and time slot."
    }
  ];

  return (
    <section id="why-us" className="section section-bg">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">The ThePhysiFit Difference</span>
          <h2 className="section-title">Why Choose ThePhysiFit?</h2>
          <p className="section-subtitle">
            We are dedicated to patient-first physical care, clinical transparency, and helping you achieve lasting mobility freedom.
          </p>
        </div>

        <div className="conditions-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {reasons.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div key={idx} className="condition-card" style={{ padding: '2rem' }}>
                <div className="condition-header">
                  <div className="condition-icon-box" style={{ background: 'var(--secondary-light)', color: 'var(--secondary-hover)' }}>
                    <IconComp size={24} />
                  </div>
                  <h3 className="condition-title">{item.title}</h3>
                </div>
                <p className="condition-desc" style={{ marginBottom: 0 }}>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button className="btn btn-primary btn-lg" onClick={onOpenBooking}>
            <CalendarCheck size={20} />
            Experience Better Care — Book Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
