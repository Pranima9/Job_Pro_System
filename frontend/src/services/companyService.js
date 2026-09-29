import apiClient from '../api/client';

export const companyService = {
  // List all approved companies (Public)
  getCompanies: async () => {
    const res = await apiClient.get('/companies');
    return res.data;
  },

  // Get current logged-in company profile
  getMyCompany: async () => {
    const res = await apiClient.get('/companies/my');
    return res.data;
  },

  // Get company details by ID with their active jobs (Public)
  getCompanyById: async (id) => {
    const res = await apiClient.get(`/companies/${id}`);
    return res.data;
  },

  // Create initial company profile (status starts at PENDING)
  createCompany: async (data) => {
    const res = await apiClient.post('/companies', data);
    return res.data;
  },

  // Update company profile
  updateCompany: async (data) => {
    const res = await apiClient.put('/companies', data);
    return res.data;
  },
};

export default companyService;
