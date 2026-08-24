import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useToast } from '../../../context/ToastContext';
import ConditionFormModal from './ConditionFormModal';
import ConfirmModal from '../../common/ConfirmModal';

const ConditionManagement = () => {
  const { conditions, deleteCondition, toggleConditionStatus } = useData();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCondition, setEditingCondition] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const filteredConditions = conditions.filter(
    (c) => c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (c) => {
    setEditingCondition(c);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingCondition(null);
    setIsFormOpen(true);
  };

  const confirmDelete = () => {
    if (deletingId) {
      deleteCondition(deletingId);
      showToast('Condition deleted!', 'info');
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Conditions We Treat Management</h1>
          <p className="admin-page-subtitle">Manage condition cards, icon symbols, short descriptions, and recommended therapy mappings on the home page.</p>
        </div>

        <button className="btn btn-primary" onClick={handleCreate}>
          <Plus size={18} /> Add New Condition
        </button>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <div className="admin-nav-search" style={{ width: '320px' }}>
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search condition..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Showing {filteredConditions.length} of {conditions.length} conditions
          </span>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Condition Name</th>
                <th>Icon Symbol</th>
                <th>Recommended Therapies</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredConditions.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={c.image}
                        alt={c.name}
                        style={{ width: '42px', height: '32px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--dark)' }}>{c.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.shortDescription?.substring(0, 45)}...</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{c.iconName}</td>
                  <td>{c.recommendedTherapies?.slice(0, 3).join(', ')}</td>
                  <td>
                    <button
                      onClick={() => toggleConditionStatus(c.id)}
                      style={{ cursor: 'pointer', background: 'none', border: 'none' }}
                    >
                      <span className={`badge badge-${c.status === 'active' ? 'active' : 'inactive'}`}>
                        {c.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </button>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="action-btn-icon edit"
                        title="Edit Condition"
                        onClick={() => handleEdit(c)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="action-btn-icon delete"
                        title="Delete Condition"
                        onClick={() => setDeletingId(c.id)}
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

      <ConditionFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        conditionToEdit={editingCondition}
      />

      <ConfirmModal
        isOpen={!!deletingId}
        title="Delete Condition?"
        message="Are you sure you want to remove this condition card from the home page?"
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeletingId(null)}
        type="danger"
      />
    </div>
  );
};

export default ConditionManagement;
