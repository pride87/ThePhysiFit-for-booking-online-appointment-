import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

const ContactSection = () => {
  const { settings, addInquiry } = useData();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill in required fields', 'warning');
      return;
    }

    try {
      await addInquiry(formData);
      showToast('Your message has been sent successfully! We will get back to you soon.', 'success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      showToast(err.message || 'Error submitting contact form.', 'error');
    }
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-badge">Get In Touch</span>
          <h2 className="section-title">Contact ThePhysiFit Clinic</h2>
          <p className="section-subtitle">
            Have questions regarding treatment plans, insurance coverage, or scheduling? Reach out to our friendly clinic administration team.
          </p>
        </div>

        <div className="contact-grid">
          {/* Info Card */}
          <div className="contact-info-card">
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--dark)' }}>
              Visit or Contact Us Today
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
              We are conveniently located in the Medical District with ample dedicated parking and accessible ground-floor entry.
            </p>

            <div className="contact-info-list">
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <Phone size={22} />
                </div>
                <div className="contact-info-text">
                  <h4>Phone Number</h4>
                  <p>{settings.phone}</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <Mail size={22} />
                </div>
                <div className="contact-info-text">
                  <h4>Email Address</h4>
                  <p>{settings.email}</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <MapPin size={22} />
                </div>
                <div className="contact-info-text">
                  <h4>Clinic Address</h4>
                  <p>{settings.address}</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <Clock size={22} />
                </div>
                <div className="contact-info-text">
                  <h4>Operating Hours</h4>
                  <p>{settings.hours}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="contact-form-card">
            <h3 style={{ fontSize: '1.35rem', marginBottom: '1.5rem', color: 'var(--dark)' }}>
              Send Us a Message
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '1.15rem' }}>
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Clara Benson"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-grid" style={{ marginBottom: '1.15rem' }}>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    placeholder="e.g. clara@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="e.g. +1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Message / Inquiry *</label>
                <textarea
                  required
                  rows={4}
                  className="form-textarea"
                  placeholder="How can our clinical team assist you today?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                <Send size={18} /> Send Message Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
