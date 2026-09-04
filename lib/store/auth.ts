import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { User, TokenResponse } from '@/lib/types';
import { setAccessCookie, clearAccessCookie } from '@/lib/auth-cookie';

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
        setAccessCookie(data.access_token);
        set({
          user: data.user,
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          isAuthenticated: true,
        });
      },
      logout: () => {
        clearAccessCookie();
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
      storage: createJSONStorage(() => sessionStorage),
      // refreshToken is deliberately absent: it is a year-long credential and
      // was being written to sessionStorage, so any XSS on the console handed
      // an attacker a durable session. It now lives only in memory for the
      // life of the tab -- refresh still works while the tab is open, and a
      // reload falls back to the short-lived access token, then re-login.
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
