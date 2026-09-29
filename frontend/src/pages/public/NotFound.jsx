import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Button from '../../components/common/Button';
import { Home } from 'lucide-react';

export const NotFound = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem 1.5rem',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '480px' }}>
          <span style={{ fontSize: '5rem', fontWeight: 800, color: 'var(--color-brand)', lineHeight: 1 }}>
            404
          </span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '1rem 0 0.5rem', color: 'var(--color-primary-dark)' }}>
            Page Not Found
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem', marginBottom: '2rem', lineHeight: 1.5 }}>
            The requested page does not exist or has been moved. Check the URL or return to the portal homepage.
          </p>
          <Link to="/">
            <Button variant="primary" icon={Home}>
              Return to Homepage
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
