'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { useStudents } from '@/lib/hooks/useStudents';
import { useCourses } from '@/lib/hooks/useCourses';
import { useLessons } from '@/lib/hooks/useLessons';
import {
  Users,
  Library,
  BookOpen,
  PlusCircle,
  Bell,
  Globe,
  Upload,
  HelpCircle,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { DataTable } from '@/components/shared/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Lesson } from '@/lib/types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDate } from '@/lib/utils';
import { useAuthStore } from '@/lib/store/auth';
import {
  canManageContent,
  canManageCommunity,
  canViewAnalytics,
  getRoleLabel,
} from '@/lib/rbac';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const role = user?.role;

  const showContent = canManageContent(role);
  const showCommunity = canManageCommunity(role);
  const showAnalytics = canViewAnalytics(role);

  const { data: students, isLoading: loadingStudents } = useStudents(
    { size: 1 },
    { enabled: showCommunity || showAnalytics }
  );
  const { data: activeCourses, isLoading: loadingCourses } = useCourses(
    { is_published: true, size: 1 },
    { enabled: showContent }
  );
  const { data: lessons, isLoading: loadingLessons } = useLessons(
    { size: 10 },
    { enabled: showContent }
  );

  const subtitleByRole = () => {
    switch (role) {
      case 'teacher':
        return 'Build and publish courses, units, and lessons.';
      case 'moderator':
        return 'Support learners through students, opportunities, and notifications.';
      case 'super_admin':
      case 'admin':
        return 'Overview of content, community, and platform activity.';
      default:
        return 'Welcome back.';
    }
  };

  const stats = [
    showCommunity || showAnalytics
      ? {
          label: 'Total students',
          value: students?.total ?? 0,
          icon: Users,
          loading: loadingStudents,
        }
      : null,
    showContent
      ? {
          label: 'Published courses',
          value: activeCourses?.total ?? 0,
          icon: Library,
          loading: loadingCourses,
        }
      : null,
    showContent
      ? {
          label: 'Lessons in library',
          value: lessons?.total ?? 0,
          icon: BookOpen,
          loading: loadingLessons,
        }
      : null,
  ].filter(Boolean) as {
    label: string;
    value: string | number;
    icon: typeof Users;
    loading: boolean;
  }[];

  const recentLessonsColumns: ColumnDef<Lesson>[] = [
    {
      header: 'Title',
      accessorKey: 'title',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.title}</span>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'is_published',
      cell: ({ row }) => (
        <StatusBadge status={row.original.is_published ? 'published' : 'draft'} />
      ),
    },
    {
      header: 'Created',
      accessorKey: 'created_at',
      cell: ({ row }) => formatDate(row.original.created_at),
    },
    {
      header: 'Actions',
      cell: ({ row }) => (
        <Link
          href={`/lessons/${row.original.id}/edit`}
          className="text-primary hover:underline text-[13px] font-medium"
        >
          Edit
        </Link>
      ),
    },
  ];

  const quickActions = [
    showContent && {
      href: '/courses/new',
      icon: PlusCircle,
      label: 'New course',
    },
    showContent && {
      href: '/lessons/new',
      icon: BookOpen,
      label: 'New lesson',
    },
    showContent && {
      href: '/courses/import',
      icon: Upload,
      label: 'Import CSV',
    },
    showCommunity && {
      href: '/opportunities/new',
      icon: Globe,
      label: 'New opportunity',
    },
    showCommunity && {
      href: '/notifications',
      icon: Bell,
      label: 'Send notification',
    },
    showAnalytics && {
      href: '/analytics',
      icon: BarChart3,
      label: 'View analytics',
    },
    {
      href: '/help',
      icon: HelpCircle,
      label: 'Help & guide',
    },
  ].filter(Boolean) as { href: string; icon: typeof PlusCircle; label: string }[];

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome${user?.username ? `, ${user.username}` : ''}`}
        subtitle={subtitleByRole()}
      />

      <Card className="border-primary/15 bg-primary/[0.04] shadow-none">
        <CardContent className="py-4 px-5">
          <p className="text-[13px] text-text-secondary">
            Signed in as{' '}
            <span className="font-semibold text-text-primary">
              {getRoleLabel(role)}
            </span>
            . You only see menu items and actions your role is allowed to use.
          </p>
        </CardContent>
      </Card>

      {stats.length > 0 && (
        <div
          className={`grid grid-cols-1 gap-6 ${
            stats.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'
          }`}
        >
          {stats.map((stat) => (
            <Card key={stat.label} className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <stat.icon className="w-6 h-6 text-text-muted" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[13px] font-medium text-text-secondary">
                    {stat.label}
                  </p>
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
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {showContent && (
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-bold text-text-primary">Recent lessons</h2>
              <Link
                href="/lessons"
                className="text-primary text-[13px] font-medium hover:underline"
              >
                View all →
              </Link>
            </div>
            <DataTable
              columns={recentLessonsColumns}
              data={lessons?.items?.slice(0, 5) ?? []}
              isLoading={loadingLessons}
            />
          </div>
        )}

        <div className={`space-y-4 ${showContent ? '' : 'lg:col-span-3'}`}>
          <h2 className="text-[18px] font-bold text-text-primary">Quick actions</h2>
          <Card className="border-none shadow-sm">
            <CardContent className="p-6 grid grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <QuickActionButton
                  key={action.href}
                  href={action.href}
                  icon={action.icon}
                  label={action.label}
                />
              ))}
            </CardContent>
          </Card>

          {showCommunity && !showContent && (
            <Card className="border-none shadow-sm">
              <CardContent className="p-6 space-y-3">
                <h3 className="text-[15px] font-semibold text-text-primary">
                  Community tools
                </h3>
                <p className="text-[13px] text-text-secondary leading-relaxed">
                  Use Students to review learner profiles, Opportunities for the job
                  board, and Notifications to message users. Course editing is not
                  available for your role.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/students">Students</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/opportunities">Opportunities</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {showContent && !showCommunity && (
            <Card className="border-none shadow-sm">
              <CardContent className="p-6 space-y-3">
                <h3 className="text-[15px] font-semibold text-text-primary">
                  Content authoring
                </h3>
                <p className="text-[13px] text-text-secondary leading-relaxed">
                  Create courses and lessons, add blocks and quiz questions, then
                  publish when ready. User management, analytics, and notifications
                  are handled by admins and moderators.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickActionButton({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Link href={href}>
      <Button
        variant="outline"
        className="w-full h-24 flex flex-col items-center justify-center gap-2 border-border/60 hover:border-primary hover:bg-primary/5 group transition-all"
      >
        <Icon className="w-6 h-6 text-text-muted group-hover:text-primary" />
        <span className="text-[13px] font-medium text-text-primary group-hover:text-primary text-center px-1">
          {label}
        </span>
      </Button>
    </Link>
  );
}
