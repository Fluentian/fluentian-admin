'use client';

import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { RouteGuard } from "@/components/auth/RouteGuard";
import { useAuthStore } from "@/lib/store/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const router = useRouter();

  useEffect(() => {
    // Wait for Zustand hydration before checking auth
    if (!isHydrated) return;

    if (!isAuthenticated) {
      Cookies.remove('accessToken');
      router.push('/login');
    }
  }, [isAuthenticated, isHydrated, router]);

  // Show loading screen during hydration
  if (!isHydrated) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--bg-page)]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg-page)]">
      <Sidebar />
      <div className="flex-1 ml-[240px]">
        <Topbar />
        <main className="p-8 pb-12">
          <div className="max-w-[1200px] mx-auto">
            <RouteGuard>{children}</RouteGuard>
          </div>
        </main>
      </div>
    </div>
  );
}
