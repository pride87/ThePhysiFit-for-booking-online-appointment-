import React, { useState } from 'react';
import { Star, CheckCircle, XCircle, Trash2, Award, Filter } from 'lucide-react';
import { useData } from '../../../context/DataContext';
import { useToast } from '../../../context/ToastContext';
import ConfirmModal from '../../common/ConfirmModal';

const ReviewManagement = () => {
  const { reviews, approveReview, rejectReview, featureReview, deleteReview } = useData();
  const { showToast } = useToast();

  const [statusFilter, setStatusFilter] = useState('All');
  const [deletingId, setDeletingId] = useState(null);

  const filteredReviews = reviews.filter((r) => (statusFilter === 'All' ? true : r.status === statusFilter));

  const totalCount = reviews.length;
  const pendingCount = reviews.filter((r) => r.status === 'pending').length;
  const approvedCount = reviews.filter((r) => r.status === 'approved').length;

  const confirmDelete = () => {
    if (deletingId) {
      deleteReview(deletingId);
      showToast('Review deleted!', 'info');
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Patient Review Moderation</h1>
          <p className="admin-page-subtitle">Moderate submitted patient testimonials, approve reviews for public listing, or feature high-rating reviews.</p>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Total Submissions</span>
            <span className="stat-value">{totalCount}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Pending Approval</span>
            <span className="stat-value" style={{ color: 'var(--status-pending)' }}>{pendingCount}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Approved & Public</span>
            <span className="stat-value" style={{ color: 'var(--status-completed)' }}>{approvedCount}</span>
          </div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <div className="filter-item">
            <Filter size={16} />
            <span className="filter-label">Filter Status:</span>
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Reviews</option>
              <option value="pending">Pending Approval ({pendingCount})</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Showing {filteredReviews.length} reviews
          </span>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Rating</th>
                <th>Therapy / Specialist</th>
                <th>Review Text</th>
                <th>Date</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((rev) => (
                <tr key={rev.id}>
                  <td style={{ fontWeight: 700, color: 'var(--dark)' }}>{rev.patientName}</td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: '#f59e0b', fontWeight: 700 }}>
                      <Star size={14} fill="#f59e0b" /> {rev.rating}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{rev.therapyName} • {rev.therapistName}</td>
                  <td style={{ maxWidth: '300px', fontSize: '0.85rem', fontStyle: 'italic' }}>
                    "{rev.review}"
                  </td>
                  <td>{rev.date}</td>
                  <td>
                    <span className={`badge badge-${rev.status === 'approved' ? 'completed' : rev.status === 'pending' ? 'pending' : 'cancelled'}`}>
                      {rev.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-outline btn-sm"
                      style={rev.isFeatured ? { background: '#fef3c7', borderColor: '#fde68a', color: '#b45309' } : {}}
                      onClick={() => featureReview(rev.id)}
                    >
                      <Award size={14} /> {rev.isFeatured ? 'Featured' : 'Feature'}
                    </button>
                  </td>
                  <td>
                    <div className="table-actions">
                      {rev.status !== 'approved' && (
                        <button
                          className="action-btn-icon approve"
                          title="Approve Review"
                          onClick={() => {
                            approveReview(rev.id);
                            showToast('Review approved for public website!', 'success');
                          }}
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}

                      {rev.status !== 'rejected' && (
                        <button
                          className="action-btn-icon delete"
                          title="Reject Review"
                          onClick={() => {
                            rejectReview(rev.id);
                            showToast('Review rejected', 'info');
                          }}
                        >
                          <XCircle size={16} />
                        </button>
                      )}

                      <button
                        className="action-btn-icon delete"
                        title="Delete Review"
                        onClick={() => setDeletingId(rev.id)}
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

      <ConfirmModal
        isOpen={!!deletingId}
        title="Delete Patient Review?"
        message="Are you sure you want to delete this review?"
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeletingId(null)}
        type="danger"
      />
    </div>
  );
};

export default ReviewManagement;
