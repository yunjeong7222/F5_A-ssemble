import api from '../config/axios';

export const addBookmark = (workflow_id) =>
  api.post('/api/workflow-bookmarks', { workflow_id });

export const removeBookmark = (workflow_id) =>
  api.delete(`/api/workflow-bookmarks/${workflow_id}`);

export const getMyBookmarks = () =>
  api.get('/api/workflow-bookmarks/my');

export const checkBookmark = (workflow_id) =>
  api.get(`/api/workflow-bookmarks/check/${workflow_id}`);

export const updateBookmarkPrompt = (workflow_id, body) =>
  api.patch(`/api/workflow-bookmarks/${workflow_id}`, body);

export const getBookmarkDetail = (workflow_id) =>
  api.get(`/api/workflow-bookmarks/detail/${workflow_id}`);