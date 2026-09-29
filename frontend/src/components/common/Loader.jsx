import React from 'react';

export const Loader = ({ message = 'Loading...', size = 'md' }) => {
  const spinnerSize = size === 'sm' ? 20 : size === 'lg' ? 44 : 32;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        gap: '1rem',
        color: 'var(--color-text-muted)',
      }}
    >
      <div
        style={{
          width: spinnerSize,
          height: spinnerSize,
          border: '3px solid var(--color-border)',
          borderTopColor: 'var(--color-brand)',
          borderRadius: '50%',
          animation: 'spin 0.75s linear infinite',
        }}
      />
      {message && <p style={{ fontSize: '0.9375rem', fontWeight: 500 }}>{message}</p>}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loader;
