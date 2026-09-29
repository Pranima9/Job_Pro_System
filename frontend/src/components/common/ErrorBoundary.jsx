import React from 'react';
import Button from './Button';
import { AlertOctagon } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--color-bg)',
            padding: '2rem',
          }}
        >
          <div
            style={{
              maxWidth: '480px',
              width: '100%',
              backgroundColor: '#ffffff',
              padding: '2.5rem',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--color-border)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                backgroundColor: 'var(--color-danger-bg)',
                color: 'var(--color-danger)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}
            >
              <AlertOctagon size={28} />
            </div>
            <h2 style={{ fontSize: '1.375rem', marginBottom: '0.75rem', color: 'var(--color-primary-dark)' }}>
              An unexpected error occurred
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem', marginBottom: '1.75rem', lineHeight: 1.5 }}>
              The application encountered an unexpected issue while rendering this view.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <Button variant="secondary" onClick={this.handleGoHome}>
                Return to Home
              </Button>
              <Button variant="primary" onClick={this.handleReload}>
                Reload Application
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
