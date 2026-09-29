import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../common/Loader';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader message="Verifying authentication session..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Redirect based on actual role
    if (role === 'SEEKER') return <Navigate to="/seeker/dashboard" replace />;
    if (role === 'COMPANY') return <Navigate to="/company/dashboard" replace />;
    if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
