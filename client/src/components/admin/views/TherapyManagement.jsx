import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Clock, DollarSign } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useToast } from '../../../context/ToastContext';
import TherapyFormModal from './TherapyFormModal';
import ConfirmModal from '../../common/ConfirmModal';

const TherapyManagement = () => {
  const { therapies, deleteTherapy, toggleTherapyStatus } = useData();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTherapy, setEditingTherapy] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const filteredTherapies = therapies.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (t) => {
    setEditingTherapist(t);
    setEditingTherapy(t);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingTherapy(null);
    setIsFormOpen(true);
  };

  const confirmDelete = () => {
    if (deletingId) {
      deleteTherapy(deletingId);
      showToast('Therapy deleted successfully!', 'info');
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Therapy Modality Management</h1>
          <p className="admin-page-subtitle">Configure treatment modalities, update session charges, set durations, and publish to website slider.</p>
        </div>

        <button className="btn btn-primary" onClick={handleCreate}>
          <Plus size={18} /> Add New Therapy
        </button>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <div className="admin-nav-search" style={{ width: '320px' }}>
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search therapy modality..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Showing {filteredTherapies.length} of {therapies.length} modalities
          </span>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Therapy Modality</th>
                <th>Specialization</th>
                <th>Duration</th>
                <th>Price / Discount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTherapies.map((t) => (
                <tr key={t.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={t.image}
                        alt={t.name}
                        style={{ width: '48px', height: '36px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--dark)' }}>{t.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {t.suitableFor?.slice(0, 2).join(', ')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--primary)', fontWeight: 600 }}>{t.specialization}</td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)' }}>
                      <Clock size={14} /> {t.duration}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--dark)' }}>
                      ${t.discountPrice || t.price}
                    </span>
                    {t.discountPrice && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: '0.35rem' }}>
                        ${t.price}
                      </span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => toggleTherapyStatus(t.id)}
                      style={{ cursor: 'pointer', background: 'none', border: 'none' }}
                    >
                      <span className={`badge badge-${t.status === 'active' ? 'active' : 'inactive'}`}>
                        {t.status === 'active' ? 'Active' : 'Draft'}
                      </span>
                    </button>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="action-btn-icon edit"
                        title="Edit Therapy"
                        onClick={() => handleEdit(t)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="action-btn-icon delete"
                        title="Delete Therapy"
                        onClick={() => setDeletingId(t.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <TherapyFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        therapyToEdit={editingTherapy}
      />

      <ConfirmModal
        isOpen={!!deletingId}
        title="Delete Therapy Modality?"
        message="Are you sure you want to delete this therapy modality? It will be removed from the public carousel."
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeletingId(null)}
        type="danger"
      />
    </div>
  );
};

export default TherapyManagement;
