import apiClient from '../api/client';

export const adminService = {
  // Get platform analytics (users, companies, jobs, applications)
  getStats: async () => {
    const res = await apiClient.get('/admin/stats');
    return res.data;
  },

  // List companies awaiting approval
  getPendingCompanies: async (params = {}) => {
    const res = await apiClient.get('/admin/companies/pending', { params });
    return res.data;
  },

  // Approve company registration
  approveCompany: async (id) => {
    const res = await apiClient.put(`/admin/companies/${id}/approve`);
    return res.data;
  },

  // Reject company registration
  rejectCompany: async (id) => {
    const res = await apiClient.put(`/admin/companies/${id}/reject`);
    return res.data;
  },

  // List all platform users
  getAllUsers: async (params = {}) => {
    const res = await apiClient.get('/admin/users', { params });
    return res.data;
  },

  // Delete a user (cascading)
  deleteUser: async (id) => {
    const res = await apiClient.delete(`/admin/users/${id}`);
    return res.data;
  },

  // List all platform jobs (active & inactive)
  getAllJobs: async (params = {}) => {
    const res = await apiClient.get('/admin/jobs', { params });
    return res.data;
  },

  // Hard delete a job (spam/fake removal)
  deleteJob: async (id) => {
    const res = await apiClient.delete(`/admin/jobs/${id}`);
    return res.data;
  },
};

export default adminService;
