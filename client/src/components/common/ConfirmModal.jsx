import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, title, message, confirmText = "Confirm", cancelText = "Cancel", onConfirm, onCancel, type = "danger" }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: type === 'danger' ? 'var(--status-cancelled)' : 'var(--dark)' }}>
            <AlertCircle size={22} />
            <h3 className="modal-title">{title}</h3>
          </div>
          <button className="modal-close" onClick={onCancel}>
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{message}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline btn-sm" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            className={`btn btn-sm ${type === 'danger' ? 'btn-primary' : 'btn-primary'}`}
            style={type === 'danger' ? { backgroundColor: 'var(--status-cancelled)' } : {}}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
