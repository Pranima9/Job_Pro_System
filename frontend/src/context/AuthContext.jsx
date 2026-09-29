import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Fetch fresh user profile from backend
  const refreshUser = useCallback(async () => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      setUser(null);
      setLoading(false);
      return null;
    }

    try {
      const res = await authService.getMe();
      if (res.success && res.data) {
        setUser(res.data);
        return res.data;
      } else {
        setUser(null);
        localStorage.removeItem('token');
        setToken(null);
        return null;
      }
    } catch {
      setUser(null);
      localStorage.removeItem('token');
      setToken(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize user session on startup
  useEffect(() => {
    refreshUser();

    // Listen for global 401 unauthorized events from Axios client
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [refreshUser]);

  // Standard Login
  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.success && res.data?.token) {
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      await refreshUser();
    }
    return res;
  };

  // Standard Register (returns data to proceed to OTP verification)
  const register = async (email, password, role) => {
    return await authService.register({ email, password, role });
  };

  // Verify OTP
  const verifyOTP = async (email, otp) => {
    const res = await authService.verifyOTP({ email, otp });
    if (res.success && res.data?.token) {
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      await refreshUser();
    }
    return res;
  };

  // Set session from external sources (e.g. Google OAuth callback)
  const setSession = async (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    return await refreshUser();
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    role: user?.role || null,
    isSeeker: user?.role === 'SEEKER',
    isCompany: user?.role === 'COMPANY',
    isAdmin: user?.role === 'ADMIN',
    companyStatus: user?.company?.status || null,
    login,
    register,
    verifyOTP,
    setSession,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
