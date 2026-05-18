'use client';

import { PageHeader } from "@/components/layout/PageHeader";
import { CourseForm } from "@/components/courses/CourseForm";
import { useCreateCourse } from "@/lib/hooks/useCourses";
import { useRouter } from "next/navigation";

export default function NewCoursePage() {
  const router = useRouter();
  const { mutate: createCourse, isPending } = useCreateCourse();

  const handleSubmit = (data: any) => {
    createCourse(data, {
      onSuccess: (course) => {
        router.push(`/courses/${course.id}`);
      },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Create Course" 
        subtitle="Set up a new language course and curriculum structure."
      />
      <CourseForm onSubmit={handleSubmit} isLoading={isPending} />
    </div>
  );
}
