'use client';

import { PageHeader } from "@/components/layout/PageHeader";
import { CourseForm } from "@/components/courses/CourseForm";
import { useCourse, useUpdateCourse } from "@/lib/hooks/useCourses";
import { useRouter, useParams } from "next/navigation";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const { data: course, isLoading } = useCourse(id);
  const { mutate: updateCourse, isPending } = useUpdateCourse();

  const handleSubmit = (data: any) => {
    updateCourse({ id, data }, {
      onSuccess: () => {
        router.push(`/courses/${id}`);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  if (!course) {
    return <div className="text-center py-12">Course not found.</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Edit Course" 
        subtitle={`Updating details for ${course.code}`}
      />
      <CourseForm 
        initialData={course} 
        onSubmit={handleSubmit} 
        isLoading={isPending} 
      />
    </div>
  );
}
