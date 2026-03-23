import api from '../config/axios';

export const saveWorkflow = (data) => api.post('/api/workflows', data);
export const fetchWorkflowById = (id) => api.get(`/api/workflows/${id}`);
export const fetchMyWorkflows = () => api.get('/api/workflows/my');
export const deleteWorkflow = (id) => api.delete(`/api/workflows/${id}`);