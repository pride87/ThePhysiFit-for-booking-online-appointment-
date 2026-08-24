import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, ToggleLeft, ToggleRight, Star } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useToast } from '../../../context/ToastContext';
import { getImageUrl } from '../../../utils/imageHelper';
import TherapistFormModal from './TherapistFormModal';
import ConfirmModal from '../../common/ConfirmModal';

const TherapistManagement = () => {
  const { therapists, deleteTherapist, toggleTherapistStatus } = useData();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTherapist, setEditingTherapist] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const filteredTherapists = therapists.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.qualification.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (doc) => {
    setEditingTherapist(doc);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingTherapist(null);
    setIsFormOpen(true);
  };

  const confirmDelete = () => {
    if (deletingId) {
      deleteTherapist(deletingId);
      showToast('Therapist deleted successfully!', 'info');
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Therapist Directory & Management</h1>
          <p className="admin-page-subtitle">Add, edit, manage clinical schedules, and publish therapist profiles to the public website.</p>
        </div>

        <button className="btn btn-primary" onClick={handleCreate}>
          <Plus size={18} /> Add New Therapist
        </button>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <div className="admin-nav-search" style={{ width: '320px' }}>
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search therapist by name, specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Showing {filteredTherapists.length} of {therapists.length} registered specialists
          </span>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Therapist</th>
                <th>Degree / Qualification</th>
                <th>Specialization</th>
                <th>Experience</th>
                <th>Fee</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTherapists.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={getImageUrl(doc.photo)}
                        alt={doc.name}
                        style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-color)' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--dark)' }}>{doc.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{doc.email || doc.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{doc.qualification}</td>
                  <td>{doc.specialization}</td>
                  <td>{doc.experience} Years</td>
                  <td style={{ fontWeight: 700 }}>${doc.consultationFee}</td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: '#f59e0b', fontWeight: 700 }}>
                      <Star size={14} fill="#f59e0b" /> {doc.rating}
                    </span>
                  </td>
                  <td>
                    <button
                      className="badge-btn"
                      onClick={() => toggleTherapistStatus(doc.id)}
                      style={{ cursor: 'pointer', background: 'none', border: 'none' }}
                    >
                      <span className={`badge badge-${doc.status === 'active' ? 'active' : 'inactive'}`}>
                        {doc.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </button>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="action-btn-icon edit"
                        title="Edit Therapist"
                        onClick={() => handleEdit(doc)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="action-btn-icon delete"
                        title="Delete Therapist"
                        onClick={() => setDeletingId(doc.id)}
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

      {/* Add / Edit Form Modal */}
      <TherapistFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        therapistToEdit={editingTherapist}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingId}
        title="Delete Therapist Profile?"
        message="Are you sure you want to delete this therapist? This action will remove their profile and schedule from the website."
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeletingId(null)}
        type="danger"
      />
    </div>
  );
};

export default TherapistManagement;
