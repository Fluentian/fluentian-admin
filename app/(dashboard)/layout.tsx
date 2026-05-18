'use client';

import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { useAuthStore } from "@/lib/store/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!isAuthenticated) {
      Cookies.remove('accessToken');
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isMounted) {
    return null; // Or a full-page loader
  }

  return (
    <div className="flex min-h-screen bg-[#F8F7FC]">
      <Sidebar />
      <div className="flex-1 ml-[240px]">
        <Topbar />
        <main className="p-8 pb-12">
          <div className="max-w-[1200px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
