import apiClient from '../api/client';

export const applicationService = {
  // Apply for a job (SEEKER only)
  applyForJob: async (jobId, { message, resumeFile } = {}) => {
    const formData = new FormData();
    if (message) formData.append('message', message);
    if (resumeFile) formData.append('resume', resumeFile);

    const res = await apiClient.post(`/applications/jobs/${jobId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  // Get current seeker's applications
  getMyApplications: async (params = {}) => {
    const res = await apiClient.get('/applications/my', { params });
    return res.data;
  },

  // Get applicants for a specific job (COMPANY owner only)
  getApplicantsForJob: async (jobId, params = {}) => {
    const res = await apiClient.get(`/applications/jobs/${jobId}`, { params });
    return res.data;
  },

  // Accept or reject an application (COMPANY only)
  updateStatus: async (applicationId, status) => {
    const res = await apiClient.put(`/applications/${applicationId}/status`, { status });
    return res.data;
  },
};

export default applicationService;
