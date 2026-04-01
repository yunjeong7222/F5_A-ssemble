import axios from 'axios';
import useAuthStore from '../store/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 0,
  headers: { 'Content-Type': 'application/json' },
});

// 요청마다 토큰 자동 주입
api.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// 응답 시 401 뜨면 자동으로 refresh 시도
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 인증 관련 엔드포인트는 refresh 시도 안 함
    const authUrls = [
      '/api/auth/login', 
      '/api/auth/refresh', 
      '/api/auth/logout', 
      '/api/auth/signup', 
      '/api/users/reset-password',
      '/api/auth/check-duplicate',
      '/api/comments',  
      '/api/likes',     
    ];
    const isAuthUrl = authUrls.some(url => originalRequest.url.includes(url));

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthUrl) {
      originalRequest._retry = true;

      const refreshToken = useAuthStore.getState().refreshToken;
      try {
        // refresh 요청으로 새 토큰 발급
        const response = await api.post('/api/auth/refresh', { refreshToken });
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;

        // 새 토큰으로 스토어 + localStorage 교체
        useAuthStore.getState().setTokens(newAccessToken, newRefreshToken);

        // 실패했던 원래 요청에 새 accessToken 달아서 재시도
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
