import api from '../config/axios';

export const getComments = (postId) => 
    api.get(`/api/comments/${postId}/comments`);

export const createComment = (postId, content) => 
    api.post(`/api/comments/${postId}/comments`, { content });

export const createReply = (postId, commentId, content) => 
    api.post(`/api/comments/${postId}/comments/${commentId}/replies`, { content });

export const updateComment = (postId, commentId, content) => 
    api.patch(`/api/comments/${postId}/comments/${commentId}`, { content });

export const deleteComment = (postId, commentId) => 
    api.delete(`/api/comments/${postId}/comments/${commentId}`);