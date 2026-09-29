import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to perform this action? This cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="460px">
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: variant === 'danger' ? 'var(--color-danger-bg)' : 'var(--color-warning-bg)',
            color: variant === 'danger' ? 'var(--color-danger)' : 'var(--color-warning)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <AlertTriangle size={22} />
        </div>
        <p style={{ fontSize: '0.9375rem', color: 'var(--color-text)', lineHeight: 1.5, paddingTop: '0.25rem' }}>
          {message}
        </p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button variant={variant} onClick={onConfirm} loading={loading}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
