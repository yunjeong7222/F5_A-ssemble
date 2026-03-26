import api from '../config/axios';

export const register = (data) => api.post('/api/auth/signup', data);
export const login = (data) => api.post('/api/auth/login', data);
export const logout = (refreshToken) => api.post('/api/auth/logout', { refreshToken }); 
export const refresh = (refreshToken) => api.post('/api/auth/refresh', { refreshToken }); 
export const getMe = () => api.get('/api/auth/me');
export const checkDuplicate = (data) => api.post('/api/auth/check-duplicate', data);
export const resetPassword = (data) => api.post('/api/users/reset-password', data);
