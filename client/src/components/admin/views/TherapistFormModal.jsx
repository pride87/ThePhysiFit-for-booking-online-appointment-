import React, { useState, useEffect } from 'react';
import { X, Upload, Save, User, Stethoscope, Lock, ShieldCheck } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useToast } from '../../../context/ToastContext';

const TherapistFormModal = ({ isOpen, onClose, therapistToEdit }) => {
  const { addTherapist, updateTherapist } = useData();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'Male',
    dateOfBirth: '1990-01-01',
    specialization: 'Orthopedic Rehabilitation',
    qualification: 'MPT – Orthopedic Physiotherapy',
    experience: 5,
    licenseNumber: 'PHY-LIC-8820',
    about: '',
    therapistUserId: '',
    password: '',
    confirmPassword: '',
    status: 'active',
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80'
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (therapistToEdit) {
      setFormData({
        name: therapistToEdit.name || '',
        email: therapistToEdit.email || '',
        phone: therapistToEdit.phone || '',
        gender: therapistToEdit.gender || 'Male',
        dateOfBirth: therapistToEdit.dateOfBirth || '1990-01-01',
        specialization: therapistToEdit.specialization || 'Orthopedic Rehabilitation',
        qualification: therapistToEdit.qualification || 'MPT',
        experience: therapistToEdit.experience || 5,
        licenseNumber: therapistToEdit.licenseNumber || 'PHY-LIC-8820',
        about: therapistToEdit.about || therapistToEdit.bio || '',
        therapistUserId: therapistToEdit.userId || (therapistToEdit.email ? therapistToEdit.email.split('@')[0] : ''),
        password: '',
        confirmPassword: '',
        status: therapistToEdit.status || 'active',
        photo: therapistToEdit.photo || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80'
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        gender: 'Male',
        dateOfBirth: '1990-01-01',
        specialization: 'Orthopedic Rehabilitation',
        qualification: 'MPT – Orthopedic Physiotherapy',
        experience: 5,
        licenseNumber: 'PHY-LIC-8820',
        about: '',
        therapistUserId: '',
        password: '',
        confirmPassword: '',
        status: 'active',
        photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80'
      });
    }
  }, [therapistToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.specialization.trim()) {
      showToast('Please fill in required fields (Full Name, Email, Specialization)', 'warning');
      return;
    }

    if (!therapistToEdit) {
      if (!formData.therapistUserId.trim()) {
        showToast('Please enter a Therapist User ID', 'warning');
        return;
      }
      if (!formData.password || formData.password.length < 6) {
        showToast('Password must be at least 6 characters', 'warning');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        showToast('Password and Confirm Password do not match', 'warning');
        return;
      }
    }

    setSubmitting(true);
    try {
      if (therapistToEdit) {
        await updateTherapist(therapistToEdit.id, formData);
        showToast(`Therapist ${formData.name} updated successfully!`, 'success');
      } else {
        await addTherapist(formData);
        showToast(`Therapist ${formData.name} added successfully!`, 'success');
      }
      onClose();
    } catch (err) {
      showToast(err.message || 'Error saving therapist record.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-card-lg" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title">
              {therapistToEdit ? 'Edit Therapist Record' : 'Add New Therapist'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Fill in therapist personal, professional, and login credentials.
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body" style={{ padding: '1.5rem', maxHeight: '75vh', overflowY: 'auto' }}>
          {/* SECTION 1: PERSONAL INFORMATION */}
          <div style={{ background: 'var(--bg-light)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.75rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={16} /> Personal Information
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Dr. Rahul Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="e.g. rahul@thephysifit.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  required
                  className="form-input"
                  placeholder="e.g. 7065411520"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: PROFESSIONAL INFORMATION */}
          <div style={{ background: 'var(--bg-light)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.75rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Stethoscope size={16} /> Professional Information
            </div>

            <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Specialization *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Orthopedic & Spine Rehab"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Qualification *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. MPT, BPT"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                />
              </div>
            </div>

            <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Years of Experience</label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  className="form-input"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value, 10) || 0 })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">License / Registration Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. PHY-REG-99120"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Professional Bio / About</label>
              <textarea
                rows={3}
                className="form-textarea"
                placeholder="Therapist background, clinical achievements, treatment specialties..."
                value={formData.about}
                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              />
            </div>
          </div>

          {/* SECTION 3: LOGIN INFORMATION */}
          <div style={{ background: 'var(--bg-light)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.75rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Lock size={16} /> Login Credentials
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Therapist User ID *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. therapist_rahul"
                value={formData.therapistUserId}
                onChange={(e) => setFormData({ ...formData, therapistUserId: e.target.value })}
              />
            </div>

            <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="form-group">
                <label className="form-label">{therapistToEdit ? 'New Password (Optional)' : 'Password *'}</label>
                <input
                  type="password"
                  required={!therapistToEdit}
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{therapistToEdit ? 'Confirm New Password' : 'Confirm Password *'}</label>
                <input
                  type="password"
                  required={!therapistToEdit}
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: ACCOUNT STATUS */}
          <div style={{ background: 'var(--bg-light)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.75rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} /> Account Status
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              <Save size={16} /> {submitting ? 'Saving...' : (therapistToEdit ? 'Update Therapist' : 'Save Therapist')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TherapistFormModal;
