import apiClient from '../api/client';

export const authService = {
  // Register a new user (SEEKER or COMPANY)
  register: async ({ email, password, role }) => {
    const res = await apiClient.post('/auth/register', { email, password, role });
    return res.data;
  },

  // Verify 6-digit OTP
  verifyOTP: async ({ email, otp }) => {
    const res = await apiClient.post('/auth/verify-otp', { email, otp });
    return res.data;
  },

  // Resend OTP
  resendOTP: async (email) => {
    const res = await apiClient.post('/auth/resend-otp', { email });
    return res.data;
  },

  // Login
  login: async ({ email, password }) => {
    const res = await apiClient.post('/auth/login', { email, password });
    return res.data;
  },

  // Get current authenticated user details
  getMe: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },

  // Google OAuth URL redirect target
  getGoogleAuthUrl: () => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    return `${baseUrl}/auth/google`;
  },
};

export default authService;
