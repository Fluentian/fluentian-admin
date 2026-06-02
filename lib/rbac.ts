import type { AppRole } from '@/lib/types';

/** Staff roles that can use the admin dashboard (not learners). */
export const STAFF_ROLES: AppRole[] = [
  'super_admin',
  'admin',
  'teacher',
  'moderator',
];

/**
 * Route prefix → roles allowed. First matching prefix wins (longest paths listed first).
 */
const ROUTE_ACCESS: { prefix: string; roles: AppRole[] }[] = [
  { prefix: '/analytics', roles: ['super_admin', 'admin'] },
  { prefix: '/users', roles: ['super_admin', 'admin'] },
  { prefix: '/notifications', roles: ['super_admin', 'admin', 'moderator'] },
  { prefix: '/opportunities', roles: ['super_admin', 'admin', 'moderator'] },
  { prefix: '/students', roles: ['super_admin', 'admin', 'moderator'] },
  { prefix: '/courses', roles: ['super_admin', 'admin', 'teacher'] },
  { prefix: '/lessons', roles: ['super_admin', 'admin', 'teacher'] },
  { prefix: '/settings', roles: STAFF_ROLES },
  { prefix: '/dashboard', roles: STAFF_ROLES },
];

export function isStaffRole(role: string | undefined | null): role is AppRole {
  return !!role && STAFF_ROLES.includes(role as AppRole);
}

export function canAccessRoute(role: AppRole | string | undefined, pathname: string): boolean {
  if (!role || !isStaffRole(role)) return false;

  const match = ROUTE_ACCESS.find(
    (entry) => pathname === entry.prefix || pathname.startsWith(`${entry.prefix}/`)
  );

  if (!match) {
    // Unknown dashboard paths: allow staff by default
    return STAFF_ROLES.includes(role as AppRole);
  }

  return match.roles.includes(role as AppRole);
}

export function getDefaultRouteForRole(role: AppRole | string | undefined): string {
  switch (role) {
    case 'teacher':
      return '/dashboard';
    case 'moderator':
      return '/dashboard';
    default:
      return '/dashboard';
  }
}

export function getRoleLabel(role: AppRole | string | undefined): string {
  switch (role) {
    case 'super_admin':
      return 'Super Admin';
    case 'admin':
      return 'Admin';
    case 'teacher':
      return 'Teacher';
    case 'moderator':
      return 'Moderator';
    default:
      return role ? String(role) : 'User';
  }
}

export function canManageContent(role: AppRole | string | undefined): boolean {
  return role === 'super_admin' || role === 'admin' || role === 'teacher';
}

export function canManageCommunity(role: AppRole | string | undefined): boolean {
  return role === 'super_admin' || role === 'admin' || role === 'moderator';
}

export function canManageUsers(role: AppRole | string | undefined): boolean {
  return role === 'super_admin' || role === 'admin';
}

export function canViewAnalytics(role: AppRole | string | undefined): boolean {
  return role === 'super_admin' || role === 'admin';
}
