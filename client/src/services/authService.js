import { apiRequest } from './api.js';

export const authService = {
  login: (email, password) => apiRequest('/admin/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout: () => apiRequest('/admin/logout', { method: 'POST' }),
  getMe: () => apiRequest('/admin/me'),
};
