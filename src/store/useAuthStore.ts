import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types';
import { api } from '@/lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: async (email, password) => {
      const response = await api.post('/auth/login', { email, password });
      // Mapeamos access_token o accessToken al campo 'token' de Zustand
      const { user, token, access_token, accessToken } = response.data;
      const jwtToken = token || access_token || accessToken;

      set({ user, token: jwtToken });
},

      register: async (email, password, name) => {
        await api.post('/auth/register', { email, password, name });
      },

      logout: () => {
        set({ user: null, token: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);