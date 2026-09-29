import apiClient from '../api/client';

export const jobService = {
  // List all active jobs with search & filters (Public)
  getJobs: async (params = {}) => {
    const res = await apiClient.get('/jobs', { params });
    return res.data;
  },

  // Get jobs posted by logged-in company (COMPANY only)
  getMyJobs: async (params = {}) => {
    const res = await apiClient.get('/jobs/my', { params });
    return res.data;
  },

  // Get single job details by ID (Public)
  getJobById: async (id) => {
    const res = await apiClient.get(`/jobs/${id}`);
    return res.data;
  },

  // Create new job posting (COMPANY only - must be APPROVED)
  createJob: async (data) => {
    const res = await apiClient.post('/jobs', data);
    return res.data;
  },

  // Update existing job posting (COMPANY owner only)
  updateJob: async (id, data) => {
    const res = await apiClient.put(`/jobs/${id}`, data);
    return res.data;
  },

  // Deactivate job (COMPANY owner only)
  deleteJob: async (id) => {
    const res = await apiClient.delete(`/jobs/${id}`);
    return res.data;
  },
};

export default jobService;
