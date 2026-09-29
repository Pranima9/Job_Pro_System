import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'We encountered an error while communicating with the server.',
  onRetry,
}) => {
  return (
    <div
      style={{
        padding: '3rem 1.5rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-danger-bg)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-danger-border)',
        maxWidth: '520px',
        margin: '1.5rem auto',
      }}
    >
      <div
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: '#fee2e2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-danger)',
          marginBottom: '1rem',
        }}
      >
        <AlertCircle size={26} />
      </div>
      <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#991b1b', marginBottom: '0.375rem' }}>
        {title}
      </h4>
      <p style={{ fontSize: '0.875rem', color: '#b91c1c', marginBottom: onRetry ? '1.25rem' : 0, lineHeight: 1.5 }}>
        {message}
      </p>
      {onRetry && (
        <Button variant="danger" size="sm" icon={RefreshCw} onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
