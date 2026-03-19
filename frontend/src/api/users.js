import api from '../config/axios';
import useAuthStore from '../store/authStore';

const getAuthHeader = () => {
  const token = useAuthStore.getState().accessToken;
  if (!token) console.warn("인증 토큰이 없습니다. 로그인이 필요합니다.");
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const getMe = () => {
  return api.get('/api/auth/me', getAuthHeader());
};

export const updateProfile = (data) => {
  return api.patch('/api/users/me', data, getAuthHeader());
};

export const resetPassword = (data) => {
  return api.post('/api/users/reset-password', data);
};

export const updatePassword = (data) => {
  return api.patch('/api/users/me/password', data, getAuthHeader());
};

export const deleteAccount = (data) => {
  return api.delete('/api/users/me', {
    ...getAuthHeader(),
    data: data,
  });
};