'use client';

import { PageHeader } from "@/components/layout/PageHeader";
import { LessonForm } from "@/components/lessons/LessonForm";
import { useCreateLesson } from "@/lib/hooks/useLessons";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Suspense } from "react";

function NewLessonForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const unitId = searchParams.get('unitId');
  const courseId = searchParams.get('courseId');
  
  const { mutate: createLesson, isPending } = useCreateLesson();

  const handleSubmit = (data: any) => {
    if (!unitId) {
      toast.error("Missing Unit ID. Please navigate from a course unit.");
      return;
    }

    createLesson({ unitId, data }, {
      onSuccess: (lesson) => {
        toast.success("Lesson created successfully");
        router.push(`/lessons/${lesson.id}/edit`);
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || "Failed to create lesson");
      }
    });
  };

  return (
    <div className="space-y-6">
      {!unitId && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-amber-700 text-[13px]">
          Warning: You are creating a lesson without a parent unit. It&apos;s recommended to create lessons directly from the course unit view.
        </div>
      )}

      <LessonForm onSubmit={handleSubmit} isLoading={isPending} />
    </div>
  );
}

export default function NewLessonPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Create Lesson" 
        subtitle="Add a new interactive lesson to your curriculum."
      />
      
      <Suspense fallback={<div>Loading...</div>}>
        <NewLessonForm />
      </Suspense>
    </div>
  );
}
