import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../../components/common/Loader';
import { AlertCircle } from 'lucide-react';

export const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const authError = searchParams.get('error');

    if (authError) {
      setError('Google authentication failed. Please try again.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    if (token) {
      setSession(token).then((user) => {
        if (user) {
          if (user.role === 'SEEKER') navigate('/seeker/dashboard');
          else if (user.role === 'COMPANY') navigate('/company/dashboard');
          else if (user.role === 'ADMIN') navigate('/admin/dashboard');
          else navigate('/');
        } else {
          navigate('/login');
        }
      });
    } else {
      setError('No authentication token received.');
      setTimeout(() => navigate('/login'), 2000);
    }
  }, []);

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <AlertCircle size={48} style={{ color: 'var(--color-danger)', margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Authentication Error</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader message="Completing sign-in..." size="lg" />
    </div>
  );
};

export default AuthCallback;
