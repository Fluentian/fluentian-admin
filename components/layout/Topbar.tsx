'use client';

import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth';
import { getRoleLabel } from '@/lib/rbac';

export function Topbar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  // Simple breadcrumb logic
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs = paths.map((path, index) => {
    const label = path.charAt(0).toUpperCase() + path.slice(1);
    const isLast = index === paths.length - 1;
    return (
      <div key={path} className="flex items-center">
        {index > 0 && <ChevronRight size={14} className="mx-2 text-text-muted" />}
        <span className={isLast ? "text-text-primary font-medium" : "text-text-muted"}>
          {label}
        </span>
      </div>
    );
  });

  return (
    <header className="h-[56px] bg-white border-b border-border flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center text-[13px]">
        {breadcrumbs}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end mr-1">
          <span className="text-[13px] font-semibold text-text-primary">{user?.username ?? 'Admin'}</span>
          <span className="text-[11px] text-text-muted">{getRoleLabel(user?.role)}</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[12px] font-bold">
          {user?.username?.substring(0, 2).toUpperCase() ?? 'AD'}
        </div>
      </div>
    </header>
  );
}
