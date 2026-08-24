import React from 'react';

const RoleBadge = ({ role }) => {
  const getBadgeStyle = () => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return { background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' };
      case 'receptionist':
        return { background: '#e0f2fe', color: '#075985', border: '1px solid #bae6fd' };
      case 'therapist':
        return { background: '#d1fae5', color: '#065f46', border: '1px solid #a7f3d0' };
      default:
        return { background: '#f1f5f9', color: '#475569' };
    }
  };

  return (
    <span
      style={{
        padding: '0.2rem 0.6rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        ...getBadgeStyle()
      }}
    >
      {role || 'Admin'}
    </span>
  );
};

export default RoleBadge;
