'use client';

import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStudents } from "@/lib/hooks/useStudents";
import { useCourses } from "@/lib/hooks/useCourses";
import { useLessons } from "@/lib/hooks/useLessons";
import { 
  Users, 
  Library, 
  BookOpen, 
  TrendingUp, 
  PlusCircle, 
  MessageSquare, 
  Bell,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DataTable } from "@/components/shared/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Lesson } from "@/lib/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const { data: students, isLoading: loadingStudents } = useStudents({ size: 1 });
  const { data: activeCourses, isLoading: loadingCourses } = useCourses({ is_published: true, size: 1 });
  const { data: lessons, isLoading: loadingLessons } = useLessons({ size: 10 });

  const stats = [
    { 
      label: "Total students", 
      value: students?.total ?? 0, 
      icon: Users, 
      loading: loadingStudents 
    },
    { 
      label: "Active courses", 
      value: activeCourses?.total ?? 0, 
      icon: Library, 
      loading: loadingCourses 
    },
    { 
      label: "Lessons published", 
      value: lessons?.total ?? 0, 
      icon: BookOpen, 
      loading: loadingLessons 
    },
    { 
      label: "New enrollments", 
      value: "12", // Placeholder for MVP
      icon: TrendingUp, 
      loading: false 
    },
  ];

  const recentLessonsColumns: ColumnDef<Lesson>[] = [
    {
      header: "Title",
      accessorKey: "title",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.title}</span>
      )
    },
    {
      header: "Status",
      accessorKey: "is_published",
      cell: ({ row }) => (
        <StatusBadge status={row.original.is_published ? 'published' : 'draft'} />
      )
    },
    {
      header: "Created",
      accessorKey: "created_at",
      cell: ({ row }) => formatDate(row.original.created_at)
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <Link 
          href={`/lessons/${row.original.id}/edit`} 
          className="text-primary hover:underline text-[13px] font-medium"
        >
          Edit
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Dashboard Overview" 
        subtitle="Welcome back to your teacher dashboard."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <stat.icon className="w-6 h-6 text-text-muted" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[13px] font-medium text-text-secondary">{stat.label}</p>
                {stat.loading ? (
                  <div className="h-9 w-24 bg-gray-100 rounded animate-pulse" />
                ) : (
                  <h3 className="text-[32px] font-bold text-text-primary leading-none">
                    {stat.value}
                  </h3>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Lessons Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-bold text-text-primary">Recent Lessons</h2>
            <Link href="/lessons" className="text-primary text-[13px] font-medium hover:underline">
              View all →
            </Link>
          </div>
          <DataTable 
            columns={recentLessonsColumns} 
            data={lessons?.items?.slice(0, 5) ?? []} 
            isLoading={loadingLessons} 
          />
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-[18px] font-bold text-text-primary">Quick Actions</h2>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 grid grid-cols-2 gap-4">
              <QuickActionButton 
                href="/courses/new" 
                icon={PlusCircle} 
                label="New Course" 
              />
              <QuickActionButton 
                href="/lessons/new" 
                icon={BookOpen} 
                label="New Lesson" 
              />
              <QuickActionButton 
                href="/opportunities/new" 
                icon={Globe} 
                label="New Opp" 
              />
              <QuickActionButton 
                href="/notifications" 
                icon={Bell} 
                label="Send Alert" 
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function QuickActionButton({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  return (
    <Link href={href}>
      <Button 
        variant="outline" 
        className="w-full h-24 flex flex-col items-center justify-center gap-2 border-border/60 hover:border-primary hover:bg-primary/5 group transition-all"
      >
        <Icon className="w-6 h-6 text-text-muted group-hover:text-primary" />
        <span className="text-[13px] font-medium text-text-primary group-hover:text-primary">{label}</span>
      </Button>
    </Link>
  );
}
