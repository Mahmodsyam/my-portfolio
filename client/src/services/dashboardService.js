import { apiRequest } from './api.js';

export const dashboardService = {
  getStats: () => apiRequest('/dashboard/stats'),
  getCharts: () => apiRequest('/dashboard/charts'),
  getClients: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) query.set(k, v); });
    return apiRequest(`/dashboard/clients?${query.toString()}`);
  },
  getNotifications: () => apiRequest('/dashboard/notifications'),
  markRead: (id) => apiRequest(`/dashboard/notifications/${id}/read`, { method: 'PUT' }),
  getAuditLog: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v) query.set(k, v); });
    return apiRequest(`/dashboard/audit-log?${query.toString()}`);
  },
};
