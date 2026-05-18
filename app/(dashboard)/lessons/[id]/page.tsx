'use client';

import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLesson } from "@/lib/hooks/useLessons";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { getLessonKindLabel, formatDate } from "@/lib/utils";
import { Edit, BookOpen, Clock, Trophy, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function LessonDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: lesson, isLoading } = useLesson(id);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  if (!lesson) {
    return <div className="text-center py-12">Lesson not found.</div>;
  }

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        className="gap-2 -ml-2 text-text-muted hover:text-text-primary"
        onClick={() => router.back()}
      >
        <ChevronLeft size={16} />
        Back to list
      </Button>

      <PageHeader 
        title={lesson.title} 
        subtitle={`Type: ${getLessonKindLabel(lesson.lesson_kind)}`}
      >
        <Link href={`/lessons/${id}/edit`}>
          <Button className="gap-2">
            <Edit size={16} />
            Edit Content
          </Button>
        </Link>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-[16px]">Lesson Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-center">
                  <Clock className="text-primary mb-2" size={20} />
                  <p className="text-[12px] text-text-muted">Estimated Time</p>
                  <p className="text-[16px] font-bold text-text-primary">{lesson.estimated_minutes} min</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-center">
                  <Trophy className="text-warning mb-2" size={20} />
                  <p className="text-[12px] text-text-muted">XP Reward</p>
                  <p className="text-[16px] font-bold text-text-primary">{lesson.xp_reward} XP</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-center">
                  <BookOpen className="text-success mb-2" size={20} />
                  <p className="text-[12px] text-text-muted">Content Blocks</p>
                  <p className="text-[16px] font-bold text-text-primary">{(lesson as any).blocks?.length ?? 0}</p>
                </div>
              </div>

              <div className="pt-4 border-t space-y-2">
                <h4 className="text-[14px] font-bold text-text-primary">Lesson Settings</h4>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-text-secondary">Visibility Status</span>
                  <StatusBadge status={lesson.is_published ? 'published' : 'draft'} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] text-text-secondary">Created At</span>
                  <span className="text-[13px] font-medium">{formatDate(lesson.created_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Quick Actions or Preview Info */}
          <Card className="border-none shadow-sm bg-primary/5 border border-primary/10">
            <CardContent className="p-6 space-y-4">
              <h4 className="text-[15px] font-bold text-primary">Content Readiness</h4>
              <p className="text-[13px] text-text-secondary leading-relaxed">
                This lesson contains {(lesson as any).blocks?.length ?? 0} content blocks and {(lesson as any).questions?.length ?? 0} interactive questions.
              </p>
              <Link href={`/lessons/${id}/edit`} className="block">
                <Button className="w-full h-10 font-bold" variant="default">
                  Manage Content
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
