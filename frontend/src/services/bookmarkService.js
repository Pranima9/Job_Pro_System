import apiClient from '../api/client';

export const bookmarkService = {
  // Get all bookmarked jobs for seeker
  getBookmarks: async () => {
    const res = await apiClient.get('/bookmarks');
    return res.data;
  },

  // Bookmark a job
  addBookmark: async (jobId) => {
    const res = await apiClient.post(`/bookmarks/jobs/${jobId}`);
    return res.data;
  },

  // Remove bookmark for a job
  removeBookmark: async (jobId) => {
    const res = await apiClient.delete(`/bookmarks/jobs/${jobId}`);
    return res.data;
  },
};

export default bookmarkService;
