import apiClient from '../api/client';

export const userService = {
  // Get current seeker's profile
  getProfile: async () => {
    const res = await apiClient.get('/users/profile');
    return res.data;
  },

  // Create seeker profile
  createProfile: async (data) => {
    const res = await apiClient.post('/users/profile', data);
    return res.data;
  },

  // Update seeker profile
  updateProfile: async (data) => {
    const res = await apiClient.put('/users/profile', data);
    return res.data;
  },

  // Upload resume file (PDF/Word, max 5MB)
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    const res = await apiClient.post('/users/profile/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
};

export default userService;
