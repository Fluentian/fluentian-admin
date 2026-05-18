'use client';

import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from "@/components/layout/PageHeader";
import { useStudent, useStudentProgress } from "@/lib/hooks/useStudents";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Mail, ShieldAlert, Award, Calendar, Flame } from "lucide-react";
import { formatLevel, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/shared/StatusBadge";

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: student, isLoading: loadingStudent } = useStudent(id);
  const { data: progress, isLoading: loadingProgress } = useStudentProgress(id);

  if (loadingStudent) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  if (!student) {
    return <div className="text-center py-12">Student not found.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8">
          <ChevronLeft size={18} />
        </Button>
        <h1 className="text-[20px] font-bold text-text-primary">Student Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm text-center pt-8">
            <CardContent className="p-6">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[32px] font-bold mx-auto mb-4">
                {student.username.substring(0, 2).toUpperCase()}
              </div>
              <h2 className="text-[20px] font-bold text-text-primary">{student.username}</h2>
              <p className="text-[14px] text-text-secondary mb-6">{student.email}</p>
              
              <div className="flex items-center justify-center gap-2 mb-8">
                <StatusBadge status="active" />
                <StatusBadge status="pro" />
              </div>

              <div className="grid grid-cols-2 gap-4 border-t pt-6">
                <div className="text-center">
                  <p className="text-[20px] font-bold text-text-primary">{student.streak_days}</p>
                  <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Day Streak</p>
                </div>
                <div className="text-center">
                  <p className="text-[20px] font-bold text-text-primary">{student.xp_total.toLocaleString()}</p>
                  <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Total XP</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="bg-gray-50/50 border-b">
              <CardTitle className="text-[15px]">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2 h-10">
                <Mail size={16} className="text-text-muted" />
                Email Student
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 h-10">
                <ShieldAlert size={16} className="text-text-muted" />
                Moderate Account
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Learning Progress */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-[14px] font-bold text-text-secondary">Current Level</CardTitle>
                <Award size={18} className="text-primary" />
              </CardHeader>
              <CardContent>
                <h3 className="text-[24px] font-bold text-text-primary">{formatLevel(student.current_level)}</h3>
                <p className="text-[12px] text-text-muted mt-1">Target: French</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-[14px] font-bold text-text-secondary">Member Since</CardTitle>
                <Calendar size={18} className="text-text-muted" />
              </CardHeader>
              <CardContent>
                <h3 className="text-[24px] font-bold text-text-primary">{formatDate(student.created_at)}</h3>
                <p className="text-[12px] text-text-muted mt-1">Status: Active</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-sm">
            <CardHeader className="border-b">
              <CardTitle className="text-[16px]">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loadingProgress ? (
                <div className="p-12 flex justify-center"><LoadingSpinner /></div>
              ) : progress && progress.lessons.length > 0 ? (
                <div className="divide-y">
                  {progress.lessons.slice(0, 10).map((p) => (
                    <div key={p.id} className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                          <Award size={20} className={p.completed ? "text-success" : "text-text-muted"} />
                        </div>
                        <div>
                          <p className="text-[14px] font-semibold text-text-primary">Lesson ID: {p.lesson_id}</p>
                          <p className="text-[12px] text-text-muted">Mastery: {p.mastery_score}%</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[13px] font-medium text-text-primary">
                          {p.completed ? "Completed" : "In Progress"}
                        </p>
                        <p className="text-[11px] text-text-muted">
                          {p.completed_at ? formatDate(p.completed_at) : "Started " + formatDate(p.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-text-muted">No lesson progress found.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
