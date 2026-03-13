import api from '../config/axios';

export const register = (data) => api.post('/api/auth/signup', data);
export const login = (data) => api.post('/api/auth/login', data);
export const getMe = () => api.get('/api/auth/me');

export const updateProfile = (data) => api.put('/api/users/me/profile', data);
export const updatePassword = (data) => api.put('/api/users/me/password', data);
export const deleteAccount = () => api.delete('/api/users/me');