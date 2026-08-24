import React, { useState } from 'react';
import { Save, RotateCcw, Building } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useToast } from '../../../context/ToastContext';
import ConfirmModal from '../../common/ConfirmModal';

const WebsiteSettings = () => {
  const { settings, updateSettings, resetToDemoData } = useData();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({ ...settings });
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings(formData);
    showToast('Website brand settings updated live across the platform!', 'success');
  };

  const handleResetData = () => {
    resetToDemoData();
    showToast('All clinic data reset to initial demo seeds!', 'info');
    setIsResetConfirmOpen(false);
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Website Content & Settings</h1>
          <p className="admin-page-subtitle">Dynamically configure clinic branding, contact info, operating hours, hero titles, and social links.</p>
        </div>

        <button
          className="btn btn-outline"
          style={{ color: 'var(--status-cancelled)', borderColor: 'var(--status-cancelled)' }}
          onClick={() => setIsResetConfirmOpen(true)}
        >
          <RotateCcw size={16} /> Reset Demo Data
        </button>
      </div>

      <div className="table-card" style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Clinic Name *</label>
              <input
                type="text"
                required
                className="form-input"
                value={formData.clinicName || ''}
                onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Navbar Logo Text *</label>
              <input
                type="text"
                required
                className="form-input"
                value={formData.logoText || ''}
                onChange={(e) => setFormData({ ...formData, logoText: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="text"
                required
                className="form-input"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                required
                className="form-input"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">WhatsApp Number *</label>
              <input
                type="text"
                className="form-input"
                placeholder="+18005557497"
                value={formData.whatsapp || ''}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Operating Hours *</label>
              <input
                type="text"
                className="form-input"
                value={formData.hours || ''}
                onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
              />
            </div>

            <div className="form-group form-group-full">
              <label className="form-label">Full Address *</label>
              <input
                type="text"
                className="form-input"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="form-group form-group-full">
              <label className="form-label">Hero Banner Main Heading</label>
              <input
                type="text"
                className="form-input"
                value={formData.heroHeading || ''}
                onChange={(e) => setFormData({ ...formData, heroHeading: e.target.value })}
              />
            </div>

            <div className="form-group form-group-full">
              <label className="form-label">Hero Subtitle</label>
              <textarea
                rows={2}
                className="form-textarea"
                value={formData.heroSubtitle || ''}
                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
              />
            </div>

            <div className="form-group form-group-full">
              <label className="form-label">Footer Tagline</label>
              <input
                type="text"
                className="form-input"
                value={formData.footerTagline || ''}
                onChange={(e) => setFormData({ ...formData, footerTagline: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Instagram Link</label>
              <input
                type="url"
                className="form-input"
                value={formData.socials?.instagram || ''}
                onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, instagram: e.target.value } })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Facebook Link</label>
              <input
                type="url"
                className="form-input"
                value={formData.socials?.facebook || ''}
                onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, facebook: e.target.value } })}
              />
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary btn-lg">
              <Save size={18} /> Save Settings Live
            </button>
          </div>
        </form>
      </div>

      <ConfirmModal
        isOpen={isResetConfirmOpen}
        title="Reset All Data to Demo Seeds?"
        message="Are you sure you want to reset all therapists, therapies, conditions, appointments, and settings back to default demo seeds?"
        confirmText="Reset Everything"
        onConfirm={handleResetData}
        onCancel={() => setIsResetConfirmOpen(false)}
        type="danger"
      />
    </div>
  );
};

export default WebsiteSettings;
