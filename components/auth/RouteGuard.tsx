'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import { canAccessRoute, getDefaultRouteForRole } from '@/lib/rbac';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

/**
 * Redirects users away from routes their role cannot access.
 */
export function RouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  const allowed =
    user?.role && canAccessRoute(user.role, pathname);

  useEffect(() => {
    if (!isHydrated || !user?.role) return;
    if (!canAccessRoute(user.role, pathname)) {
      router.replace(getDefaultRouteForRole(user.role));
    }
  }, [isHydrated, user?.role, pathname, router]);

  if (!isHydrated) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner size={28} />
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner size={28} />
      </div>
    );
  }

  return <>{children}</>;
}
