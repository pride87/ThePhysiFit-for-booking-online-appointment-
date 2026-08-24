import React, { useState, useEffect } from 'react';
import { X, Save, Image as ImageIcon } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useToast } from '../../../context/ToastContext';

const TherapyFormModal = ({ isOpen, onClose, therapyToEdit }) => {
  const { addTherapy, updateTherapy } = useData();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    price: 75,
    discountPrice: 65,
    duration: '45 Mins',
    specialization: 'Orthopedic & Pain Management',
    suitableFor: 'Back pain, Tension knots',
    benefits: 'Relieves muscle spasms, Enhances circulation',
    precautions: 'Avoid on acute open wounds',
    status: 'active'
  });

  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (therapyToEdit) {
      setFormData({
        ...therapyToEdit,
        suitableFor: Array.isArray(therapyToEdit.suitableFor) ? therapyToEdit.suitableFor.join(', ') : (therapyToEdit.suitableFor || ''),
        benefits: Array.isArray(therapyToEdit.benefits) ? therapyToEdit.benefits.join(', ') : (therapyToEdit.benefits || '')
      });
      setImagePreview(therapyToEdit.image);
    } else {
      setFormData({
        name: '',
        description: '',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
        price: 75,
        discountPrice: 65,
        duration: '45 Mins',
        specialization: 'Orthopedic & Pain Management',
        suitableFor: 'Back pain, Muscle spasms, Nerve tension',
        benefits: 'Releases deep trigger points, Improves range of motion',
        precautions: 'Consult before treatment if pregnant',
        status: 'active'
      });
      setImagePreview('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80');
    }
  }, [therapyToEdit, isOpen]);

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
    if (!formData.name || !formData.price || !formData.duration) {
      showToast('Please fill required therapy fields', 'warning');
      return;
    }

    if (therapyToEdit) {
      updateTherapy(therapyToEdit.id, formData);
      showToast(`Therapy ${formData.name} updated!`, 'success');
    } else {
      addTherapy(formData);
      showToast(`Therapy ${formData.name} published!`, 'success');
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-card-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{therapyToEdit ? 'Edit Therapy Modality' : 'Add New Therapy Modality'}</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group form-group-full" style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <div className="image-upload-preview" style={{ width: '120px', height: '80px' }}>
                  {imagePreview ? <img src={imagePreview} alt="Preview" /> : <ImageIcon size={28} />}
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Therapy Image (JPG, PNG, WebP)</label>
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
                <label className="form-label">Therapy Name *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. Dry Needling"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Session Duration *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="e.g. 45 Mins"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Standard Price ($) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  className="form-input"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value, 10) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Discount Rate ($)</label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  value={formData.discountPrice || ''}
                  onChange={(e) => setFormData({ ...formData, discountPrice: parseInt(e.target.value, 10) || null })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Assigned Specialization Focus</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Orthopedic & Pain Management"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Publishing Status</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">Active (Published on Website)</option>
                  <option value="inactive">Inactive (Draft)</option>
                </select>
              </div>

              <div className="form-group form-group-full">
                <label className="form-label">Description *</label>
                <textarea
                  required
                  rows={3}
                  className="form-textarea"
                  placeholder="Detailed description of therapy mechanism and clinical method..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-group form-group-full">
                <label className="form-label">Suitable For Tags (comma separated)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Chronic Back Pain, Trigger Points, Muscle Tension"
                  value={formData.suitableFor}
                  onChange={(e) => setFormData({ ...formData, suitableFor: e.target.value })}
                />
              </div>

              <div className="form-group form-group-full">
                <label className="form-label">Benefits (comma separated)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Immediate muscle release, Improved blood circulation"
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                />
              </div>

              <div className="form-group form-group-full">
                <label className="form-label">Precautions</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Avoid on bleeding disorders..."
                  value={formData.precautions}
                  onChange={(e) => setFormData({ ...formData, precautions: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} /> Save Therapy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TherapyFormModal;
