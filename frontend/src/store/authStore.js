import { create } from 'zustand';

// authStore.js 수정
const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null, // 추가
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isLoggedIn: !!localStorage.getItem('accessToken'),

  login: (user, accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user)); // 추가
    set({ user, accessToken, refreshToken, isLoggedIn: true });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user'); // 추가
    set({ user: null, accessToken: null, refreshToken: null, isLoggedIn: false });
  },

  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    set({ accessToken, refreshToken });
  },

  updateUser: (updatedFields) => {
    set((state) => {
      const updated = { ...state.user, ...updatedFields };
      localStorage.setItem('user', JSON.stringify(updated)); // 추가
      return { user: updated };
    });
  },
}));

export default useAuthStore;
