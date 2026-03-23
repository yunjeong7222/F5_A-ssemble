import api from '../config/axios';

export const likePost = (id) => api.post(`/api/likes/${id}/likes`);
export const unlikePost = (id) => api.delete(`/api/likes/${id}/likes`);