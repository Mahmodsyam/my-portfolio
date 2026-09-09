import { apiRequest } from './api.js';

export const requestsService = {
  // Public
  submit: (formData) => apiRequest('/requests', { method: 'POST', body: formData }), // FormData with files
  track: (ref, email) => apiRequest(`/requests/track/${encodeURIComponent(ref)}?email=${encodeURIComponent(email)}`),
  
  // Admin
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== '' && v !== null) query.set(k, v); });
    return apiRequest(`/requests?${query.toString()}`);
  },
  getOne: (id) => apiRequest(`/requests/${id}`),
  update: (id, data) => apiRequest(`/requests/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/requests/${id}`, { method: 'DELETE' }),
  updateStatus: (id, status) => apiRequest(`/requests/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  updatePriority: (id, priority) => apiRequest(`/requests/${id}/priority`, { method: 'PUT', body: JSON.stringify({ priority }) }),
  addNote: (id, note) => apiRequest(`/requests/${id}/notes`, { method: 'POST', body: JSON.stringify({ note }) }),
  getNotes: (id) => apiRequest(`/requests/${id}/notes`),
};
