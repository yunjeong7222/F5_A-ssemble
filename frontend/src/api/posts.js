import api from '../config/axios';

export const getPosts = async (params = {}) => {
  const response = await api.get('/api/posts', { params });
  return response.data;
};

export const getLikedPosts = async (params = {}) => {
  const response = await api.get('/api/posts/liked', { params });
  return response.data;
};

export const getPost = async (id) => {
  const response = await api.get(`/api/posts/${id}`);
  return response.data;
};

export const createPost = (body) => api.post('/api/posts', body);

export const updatePost = async (id, data) => {
  const response = await api.patch(`/api/posts/${id}`, data);
  return response.data;
};

export const deletePost = async (id) => {
  const response = await api.delete(`/api/posts/${id}`);
  return response.data;
};
