import { create } from 'zustand';
import { authApi } from '../api/auth';

// 인증 상태
// 앱 재시작 시 토큰은 초기화됨 (영속화 필요 시 expo-secure-store 추가 예정)
interface AuthState {
  token: string | null;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { access_token } = await authApi.login(email, password);
      set({ token: access_token, isLoading: false });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
      throw e;
    }
  },

  signup: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      await authApi.signup(email, password);
      // 회원가입 후 자동 로그인
      const { access_token } = await authApi.login(email, password);
      set({ token: access_token, isLoading: false });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
      throw e;
    }
  },

  logout: () => set({ token: null, error: null }),

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
