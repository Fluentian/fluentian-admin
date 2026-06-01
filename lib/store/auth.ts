import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, TokenResponse } from '@/lib/types';
import Cookies from 'js-cookie';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (data: TokenResponse) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  setHydrated: (hydrated: boolean) => void;
  isHydrated: boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isHydrated: false,
      login: (data) => {
        // Use httpOnly cookies (set via middleware)
        // Only store tokens in secure cookie (backend should set httpOnly flag)
        Cookies.set('accessToken', data.access_token, {
          expires: 1, // 24 hours
          secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
          sameSite: 'strict',
        });
        
        set({
          user: data.user,
          accessToken: data.access_token,
          refreshToken: data.refresh_token, // Should ideally only be in httpOnly cookie
          isAuthenticated: true,
        });
      },
      logout: () => {
        Cookies.remove('accessToken');
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },
      updateUser: (updatedFields) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedFields } : null,
        })),
      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
    }),
    {
      name: 'fluentian-admin-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
