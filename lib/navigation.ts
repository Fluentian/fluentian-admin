import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  BarChart3,
  BookOpen,
  Users,
  Globe,
  Bell,
  Library,
  HelpCircle,
} from 'lucide-react';
import type { AppRole } from '@/lib/types';

export type SidebarNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  section?: 'CONTENT' | 'COMMUNITY' | 'ADMINISTRATION';
  roles?: AppRole[];
};

export const sidebarNavItems: SidebarNavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    roles: ['super_admin', 'admin'],
  },
  {
    label: 'Courses',
    href: '/courses',
    icon: Library,
    section: 'CONTENT',
    roles: ['super_admin', 'admin', 'teacher'],
  },
  {
    label: 'Lessons',
    href: '/lessons',
    icon: BookOpen,
    section: 'CONTENT',
    roles: ['super_admin', 'admin', 'teacher'],
  },
  {
    label: 'Students',
    href: '/students',
    icon: Users,
    section: 'COMMUNITY',
    roles: ['super_admin', 'admin', 'moderator'],
  },
  {
    label: 'Opportunities',
    href: '/opportunities',
    icon: Globe,
    section: 'COMMUNITY',
    roles: ['super_admin', 'admin', 'moderator'],
  },
  {
    label: 'Notifications',
    href: '/notifications',
    icon: Bell,
    section: 'COMMUNITY',
    roles: ['super_admin', 'admin', 'moderator'],
  },
  {
    label: 'User Management',
    href: '/users',
    icon: Users,
    section: 'ADMINISTRATION',
    roles: ['super_admin', 'admin'],
  },
  {
    label: 'Help & Guide',
    href: '/help',
    icon: HelpCircle,
    section: 'ADMINISTRATION',
    roles: ['super_admin', 'admin', 'teacher', 'moderator'],
  },
];

export function navItemVisible(
  item: SidebarNavItem,
  role: AppRole | string | undefined
): boolean {
  if (!item.roles) return true;
  if (!role) return false;
  return item.roles.includes(role as AppRole);
}
