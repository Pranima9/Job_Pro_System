import React from 'react';
import { Inbox } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There are no items to display at this moment.',
  action,
}) => {
  return (
    <div
      style={{
        padding: '3.5rem 1.5rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--color-border)',
        maxWidth: '520px',
        margin: '1.5rem auto',
      }}
    >
      <div
        style={{
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          backgroundColor: '#f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#64748b',
          marginBottom: '1rem',
        }}
      >
        <Icon size={28} />
      </div>
      <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-primary-dark)', marginBottom: '0.375rem' }}>
        {title}
      </h4>
      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: action ? '1.25rem' : 0, lineHeight: 1.5 }}>
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
