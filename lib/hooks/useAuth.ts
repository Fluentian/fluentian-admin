import { useAuthStore } from '@/lib/store/auth';

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  return {
    user,
    isAuthenticated,
    logout,
    isHydrated,
  };
}
