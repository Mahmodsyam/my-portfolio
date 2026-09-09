import { apiRequest } from './api.js';

export const messagesService = {
  getAll: () => apiRequest('/admin/messages'),
  markRead: (id) => apiRequest(`/admin/messages/${id}/read`, { method: 'PUT' }),
  delete: (id) => apiRequest(`/admin/messages/${id}`, { method: 'DELETE' }),
};
