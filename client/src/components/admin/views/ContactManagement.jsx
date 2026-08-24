import React, { useState } from 'react';
import { Search, Mail, CheckCircle, Trash2, Eye } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useToast } from '../../../context/ToastContext';
import ConfirmModal from '../../common/ConfirmModal';

const ContactManagement = () => {
  const { inquiries, updateInquiryStatus, deleteInquiry } = useData();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const filtered = inquiries.filter(
    (i) =>
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const confirmDelete = () => {
    if (deletingId) {
      deleteInquiry(deletingId);
      showToast('Inquiry message deleted!', 'info');
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Contact & Patient Inquiries Inbox</h1>
          <p className="admin-page-subtitle">Review questions and messages submitted through the public website contact form.</p>
        </div>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <div className="admin-nav-search" style={{ width: '320px' }}>
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search sender, email, inquiry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Showing {filtered.length} messages
          </span>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Sender</th>
                <th>Phone</th>
                <th>Inquiry Snippet</th>
                <th>Date Received</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inq) => (
                <tr key={inq.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--dark)' }}>{inq.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{inq.email}</div>
                  </td>
                  <td>{inq.phone || 'N/A'}</td>
                  <td style={{ maxWidth: '320px', fontSize: '0.85rem' }}>
                    {inq.message?.substring(0, 75)}...
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{inq.date}</td>
                  <td>
                    <span className={`badge badge-${inq.status === 'New' ? 'pending' : inq.status === 'Responded' ? 'completed' : 'confirmed'}`}>
                      {inq.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="action-btn-icon edit"
                        title="View Full Inquiry"
                        onClick={() => {
                          setSelectedInquiry(inq);
                          if (inq.status === 'New') updateInquiryStatus(inq.id, 'Read');
                        }}
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        className="action-btn-icon approve"
                        title="Mark Responded"
                        onClick={() => {
                          updateInquiryStatus(inq.id, 'Responded');
                          showToast('Inquiry marked as responded!', 'success');
                        }}
                      >
                        <CheckCircle size={16} />
                      </button>

                      <button
                        className="action-btn-icon delete"
                        title="Delete Message"
                        onClick={() => setDeletingId(inq.id)}
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

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="modal-overlay" onClick={() => setSelectedInquiry(null)}>
          <div className="modal-card" style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Inquiry Details — {selectedInquiry.name}</h3>
              <button className="modal-close" onClick={() => setSelectedInquiry(null)}>
                <Eye size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                <div><strong>From:</strong> {selectedInquiry.name} ({selectedInquiry.email})</div>
                <div><strong>Phone:</strong> {selectedInquiry.phone || 'N/A'}</div>
                <div><strong>Date:</strong> {selectedInquiry.date}</div>
              </div>
              <div style={{ padding: '1rem', background: 'var(--bg-light)', borderRadius: 'var(--radius-md)', fontStyle: 'italic', fontSize: '0.95rem' }}>
                "{selectedInquiry.message}"
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                onClick={() => {
                  updateInquiryStatus(selectedInquiry.id, 'Responded');
                  showToast('Marked as Responded', 'success');
                  setSelectedInquiry(null);
                }}
              >
                Mark Responded & Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deletingId}
        title="Delete Inquiry?"
        message="Are you sure you want to delete this message?"
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeletingId(null)}
        type="danger"
      />
    </div>
  );
};

export default ContactManagement;
