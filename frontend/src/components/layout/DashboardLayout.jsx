import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export const DashboardLayout = ({ children, title, subtitle, actions }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg)' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }} className="dashboard-container">
        <Sidebar />
        <main style={{ flex: 1, padding: '2rem 1.5rem', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
          {(title || actions) && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1.75rem',
              }}
            >
              <div>
                {title && (
                  <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                    {subtitle}
                  </p>
                )}
              </div>
              {actions && <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>{actions}</div>}
            </div>
          )}
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .dashboard-container {
            flex-direction: column !important;
          }
          .dashboard-sidebar {
            width: 100% !important;
            min-height: auto !important;
            border-right: none !important;
            border-bottom: 1px solid var(--color-border) !important;
            padding: 0.75rem 1rem !important;
            flex-direction: row !important;
            overflow-x: auto !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
