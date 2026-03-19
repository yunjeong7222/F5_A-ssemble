import api from '../config/axios';

// 게시글 목록 조회
export const getPosts = async (params = {}) => {
  const response = await api.get('/api/posts', { params });
  return response.data;
};

// 좋아요한 게시글 목록
export const getLikedPosts = async () => {
  const response = await api.get('/api/posts/liked');
  return response.data;
};

// 게시글 단건 조회
export const getPost = async (id) => {
  const response = await api.get(`/api/posts/${id}`);
  return response.data;
};

// 게시글 작성
export const createPost = async (formData) => {
  const response = await api.post('/api/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// 게시글 수정
export const updatePost = async (id, data) => {
  const response = await api.patch(`/api/posts/${id}`, data);
  return response.data;
};

// 게시글 삭제
export const deletePost = async (id) => {
  const response = await api.delete(`/api/posts/${id}`);
  return response.data;
};