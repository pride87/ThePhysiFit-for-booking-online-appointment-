import React, { useState } from 'react';
import { Stethoscope, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const TherapistLoginPage = () => {
  const { login } = useAuth();
  const { showToast } = useToast();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId || !password) {
      showToast('Please enter Therapist User ID and password', 'warning');
      return;
    }

    setSubmitting(true);
    const res = await login(userId, password, '/auth/therapist/login');
    setSubmitting(false);

    if (res.success) {
      showToast(`Welcome Dr. ${res.user.name}! Logged into Therapist Portal.`, 'success');
      window.location.href = '/therapist-dashboard';
    } else {
      showToast(res.message || 'Invalid User ID or password.', 'error');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f172a 0%, #0284c7 100%)', padding: '1.5rem' }}>
      <div className="modal-card" style={{ maxWidth: '450px', padding: '2.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: 'var(--shadow-md)' }}>
            <Stethoscope size={32} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--dark)' }}>Therapist Login</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.35rem' }}>
            ThePhysiFit Specialist Clinical Access
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label">Therapist User ID *</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                className="form-input"
                style={{ paddingLeft: '2.4rem' }}
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter your Therapist User ID"
              />
              <User size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label">Password *</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                className="form-input"
                style={{ paddingLeft: '2.4rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
              <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={submitting}>
            {submitting ? 'Authenticating...' : 'Login'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          🔒 Protected by Express JWT Role-Based Authorization
        </div>
      </div>
    </div>
  );
};

export default TherapistLoginPage;
