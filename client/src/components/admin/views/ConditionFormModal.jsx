import React, { useState, useEffect } from 'react';
import { X, Save, Image as ImageIcon } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useToast } from '../../../context/ToastContext';

const ConditionFormModal = ({ isOpen, onClose, conditionToEdit }) => {
  const { addCondition, updateCondition, therapies } = useData();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    fullDescription: '',
    iconName: 'Activity',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
    recommendedTherapies: 'Dry Needling, Manual Therapy',
    status: 'active'
  });

  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (conditionToEdit) {
      setFormData({
        ...conditionToEdit,
        recommendedTherapies: Array.isArray(conditionToEdit.recommendedTherapies) ? conditionToEdit.recommendedTherapies.join(', ') : (conditionToEdit.recommendedTherapies || '')
      });
      setImagePreview(conditionToEdit.image);
    } else {
      setFormData({
        name: '',
        shortDescription: '',
        fullDescription: '',
        iconName: 'Activity',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
        recommendedTherapies: 'Dry Needling, Exercise Therapy',
        status: 'active'
      });
      setImagePreview('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80');
    }
  }, [conditionToEdit, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.shortDescription) {
      showToast('Please fill required condition fields', 'warning');
      return;
    }

    if (conditionToEdit) {
      updateCondition(conditionToEdit.id, formData);
      showToast(`Condition ${formData.name} updated!`, 'success');
    } else {
      addCondition(formData);
      showToast(`Condition ${formData.name} added!`, 'success');
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-card-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{conditionToEdit ? 'Edit Condition' : 'Add New Condition We Treat'}</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group form-group-full" style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <div className="image-upload-preview">
                  {imagePreview ? <img src={imagePreview} alt="Preview" /> : <ImageIcon size={28} />}
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Condition Cover Image (JPG, PNG, WebP)</label>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="form-input" style={{ marginBottom: '0.5rem' }} />
                  <input
                    type="url"
                    className="form-input"
                    placeholder="Or image URL..."
                    value={formData.image}
                    onChange={(e) => {
                      setFormData({ ...formData, image: e.target.value });
                      setImagePreview(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Condition Name *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Back Pain"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Icon Symbol</label>
                <select
                  className="form-select"
                  value={formData.iconName}
                  onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                >
                  <option value="Activity">Activity / Heartbeat</option>
                  <option value="UserCheck">User / Neck</option>
                  <option value="Award">Award / Sports</option>
                  <option value="ShieldAlert">Shield / Joint</option>
                  <option value="HeartPulse">Heart / Knee</option>
                  <option value="Compass">Compass / Shoulder</option>
                  <option value="Stethoscope">Stethoscope / Rehab</option>
                  <option value="Zap">Zap / Muscle</option>
                  <option value="Smile">Smile / Posture</option>
                  <option value="Sun">Sun / Arthritis</option>
                  <option value="AlertCircle">Alert / Sciatica</option>
                  <option value="TrendingUp">Trending / Mobility</option>
                </select>
              </div>

              <div className="form-group form-group-full">
                <label className="form-label">Short Card Description *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Physiotherapy approaches that may help improve mobility..."
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                />
              </div>

              <div className="form-group form-group-full">
                <label className="form-label">Full Clinical Overview</label>
                <textarea
                  rows={3}
                  className="form-textarea"
                  placeholder="Detailed clinical background, root causes, and rehabilitation goals..."
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                />
              </div>

              <div className="form-group form-group-full">
                <label className="form-label">Recommended Therapies (comma separated)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Dry Needling, Chiropractic Care, Exercise Therapy"
                  value={formData.recommendedTherapies}
                  onChange={(e) => setFormData({ ...formData, recommendedTherapies: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">Active (Visible on Home Page)</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} /> Save Condition
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConditionFormModal;
