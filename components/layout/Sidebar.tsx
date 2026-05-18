'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BarChart3,
  BookOpen, 
  Users, 
  Globe, 
  Bell, 
  Settings, 
  LogOut,
  Library
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/store/auth';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Analytics', href: '/analytics', icon: BarChart3, roles: ['super_admin', 'admin'] },
  { label: 'Courses', href: '/courses', icon: Library, section: 'CONTENT', roles: ['super_admin', 'admin', 'teacher'] },
  { label: 'Lessons', href: '/lessons', icon: BookOpen, section: 'CONTENT', roles: ['super_admin', 'admin', 'teacher'] },
  { label: 'Students', href: '/students', icon: Users, section: 'COMMUNITY', roles: ['super_admin', 'admin', 'moderator'] },
  { label: 'Opportunities', href: '/opportunities', icon: Globe, section: 'COMMUNITY', roles: ['super_admin', 'admin', 'moderator'] },
  { label: 'Notifications', href: '/notifications', icon: Bell, section: 'COMMUNITY', roles: ['super_admin', 'admin', 'moderator'] },
];

export function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    Cookies.remove('accessToken');
    router.push('/login');
  };

  const renderNavItem = (item: typeof navItems[0]) => {
    // RBAC: Check if user has permission for this item
    if (item.roles && user && !item.roles.includes(user.role)) {
      return null;
    }

    const isActive = pathname.startsWith(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "flex items-center gap-3 h-10 px-3 rounded-md mb-1 transition-colors group",
          isActive 
            ? "bg-primary text-white" 
            : "text-white/50 hover:bg-white/5 hover:text-white"
        )}
      >
        <item.icon className={cn("w-[18px] h-[18px]", isActive ? "text-white" : "text-white/50 group-hover:text-white")} />
        <span className="text-[14px] font-medium">{item.label}</span>
      </Link>
    );
  };

  const sections = ['DASHBOARD', 'CONTENT', 'COMMUNITY'];

  return (
    <div className="w-[240px] h-screen bg-[#1A0A2E] flex flex-col fixed left-0 top-0 z-50">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#6C3BF5] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-[18px] leading-tight">Fluentian</span>
            <span className="text-white/30 text-[10px] uppercase tracking-wider font-bold">Admin</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 overflow-y-auto">
        <div className="mb-6">
          {navItems.filter(i => !i.section).map(renderNavItem)}
        </div>

        {sections.filter(s => s !== 'DASHBOARD').map(section => {
          const sectionItems = navItems.filter(i => i.section === section);
          const visibleItems = sectionItems.filter(i => !i.roles || (user && i.roles.includes(user.role)));
          
          if (visibleItems.length === 0) return null;

          return (
            <div key={section} className="mb-6">
              <h3 className="px-3 mb-2 text-[10px] font-bold text-white/30 uppercase tracking-[0.08em]">
                {section}
              </h3>
              {visibleItems.map(renderNavItem)}
            </div>
          );
        })}
      </nav>

      {/* Bottom Profile */}
      <div className="p-3 border-t border-white/5">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 h-10 px-3 rounded-md mb-1 transition-colors group",
            pathname === '/settings' ? "bg-primary text-white" : "text-white/50 hover:bg-white/5 hover:text-white"
          )}
        >
          <Settings className={cn("w-[18px] h-[18px]", pathname === '/settings' ? "text-white" : "text-white/50 group-hover:text-white")} />
          <span className="text-[14px] font-medium">Settings</span>
        </Link>
        
        <div className="flex items-center gap-3 px-3 py-4 mt-2">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-[12px] font-bold">
            {user?.username?.substring(0, 2).toUpperCase() ?? 'AD'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-white truncate">{user?.username ?? 'Admin'}</p>
            <p className="text-[11px] text-white/40 truncate">{user?.email ?? 'admin@fluentian.com'}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="text-white/30 hover:text-white transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
