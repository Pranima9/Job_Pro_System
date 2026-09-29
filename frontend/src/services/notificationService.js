import apiClient from '../api/client';

export const notificationService = {
  // Get notifications for current user
  getNotifications: async () => {
    const res = await apiClient.get('/notifications');
    return res.data;
  },

  // Mark single notification as read
  markAsRead: async (id) => {
    const res = await apiClient.patch(`/notifications/${id}/read`);
    return res.data;
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const res = await apiClient.patch('/notifications/read-all');
    return res.data;
  },
};

export default notificationService;
