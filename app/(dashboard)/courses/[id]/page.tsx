'use client';

import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCourse, useCourseUnits, useDeleteCourse, useUpdateCourse } from "@/lib/hooks/useCourses";
import { useLessons } from "@/lib/hooks/useLessons";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { 
  Plus, 
  Edit, 
  Trash2, 
  ChevronRight, 
  BookOpen,
  MessageCircle,
  FileText
} from "lucide-react";
import Link from "next/link";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatLevel, formatDate, cn } from "@/lib/utils";
import { useState } from "react";
import { UnitForm } from "@/components/courses/UnitForm";
import { useCreateUnit } from "@/lib/hooks/useCourses";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: course, isLoading: loadingCourse } = useCourse(id);
  const { mutate: deleteCourse } = useDeleteCourse();
  const { mutate: updateCourse, isPending: updatingCourse } = useUpdateCourse();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { data: units, isLoading: loadingUnits } = useCourseUnits(id);
  const { data: lessons, isLoading: loadingLessons } = useLessons({ course_id: id });
  
  const [isAddingUnit, setIsAddingUnit] = useState(false);
  const { mutate: createUnit, isPending: creatingUnit } = useCreateUnit();

  const handleAddUnit = (data: any) => {
    createUnit({ courseId: id, data }, {
      onSuccess: () => {
        setIsAddingUnit(false);
      },
    });
  };

  if (loadingCourse) {
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
    <div className="space-y-8">
      <PageHeader 
        title={course.code} 
        subtitle={`${formatLevel(course.level_min)} → ${formatLevel(course.level_max)} course structure`}
      >
        <Link href={`/courses/${id}/edit`}>
          <Button variant="outline" className="gap-2">
            <Edit size={16} />
            Edit Course
          </Button>
        </Link>
        <Button 
          variant="destructive" 
          className="gap-2"
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          <Trash2 size={16} />
          Delete
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Units & Lessons */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[18px] font-bold text-text-primary">Curriculum Units</h2>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsAddingUnit(true)}>
              <Plus size={14} />
              Add Unit
            </Button>
          </div>

          {isAddingUnit && (
            <Card className="mb-6 border-2 border-primary/20 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-[16px]">Add New Unit</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <UnitForm 
                  onSubmit={handleAddUnit} 
                  isLoading={creatingUnit} 
                  onCancel={() => setIsAddingUnit(false)}
                  initialData={{ unit_no: (units?.length ?? 0) + 1 }}
                />
              </CardContent>
            </Card>
          )}

          {loadingUnits ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-16 bg-white border rounded-xl animate-pulse" />)}
            </div>
          ) : units && units.length > 0 ? (
            <Accordion type="multiple" className="space-y-4">
              {units.map((unit) => {
                const unitLessons = lessons?.items.filter(l => l.unit_id === unit.id) ?? [];
                return (
                  <AccordionItem key={unit.id} value={unit.id} className="border rounded-xl bg-white px-6 overflow-hidden">
                    <AccordionTrigger className="hover:no-underline py-5">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center font-bold text-text-muted text-[13px]">
                          {unit.unit_no}
                        </div>
                        <div>
                          <p className="text-[15px] font-bold text-text-primary">{unit.title}</p>
                          <p className="text-[12px] text-text-muted capitalize">{unit.unit_kind} Unit</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6 pt-2">
                      <div className="space-y-2">
                        {unitLessons.length > 0 ? (
                          unitLessons.sort((a,b) => a.sequence_no - b.sequence_no).map((lesson) => (
                            <div key={lesson.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-[#F8F7FC] group transition-colors">
                              <div className="flex items-center gap-3">
                                <span className="text-[12px] font-medium text-text-muted w-4">{lesson.sequence_no}</span>
                                <BookOpen size={16} className="text-text-muted" />
                                <span className="text-[14px] font-medium text-text-primary">{lesson.title}</span>
                                <StatusBadge status={lesson.is_published ? 'published' : 'draft'} className="scale-75 origin-left" />
                              </div>
                              <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link href={`/lessons/${lesson.id}/edit`} className="text-primary text-[13px] font-medium hover:underline">
                                  Edit
                                </Link>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-center py-4 text-text-muted text-[13px]">No lessons in this unit yet.</p>
                        )}
                        <Link href={`/lessons/new?unitId=${unit.id}&courseId=${id}`}>
                          <Button variant="ghost" className="w-full mt-2 border-2 border-dashed border-border hover:bg-gray-50 hover:border-primary text-text-muted hover:text-primary h-12 text-[13px] font-semibold gap-2">
                            <Plus size={14} />
                            Add Lesson to Unit {unit.unit_no}
                          </Button>
                        </Link>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          ) : (
            <div className="bg-white border rounded-xl p-12 text-center">
              <p className="text-text-muted mb-4">No units created for this course yet.</p>
              <Button variant="outline" onClick={() => setIsAddingUnit(true)}>Create First Unit</Button>
            </div>
          )}
        </div>

        {/* Right: Info Card */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-gray-50/50 border-b">
              <CardTitle className="text-[16px]">Course Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <InfoRow label="Status" value={<StatusBadge status={course.is_published ? 'published' : 'draft'} />} />
              <InfoRow label="Language" value="French" />
              <InfoRow label="Code" value={course.code} />
              <InfoRow label="Created" value={formatDate(course.created_at)} />
              <div className="pt-4 border-t">
                <p className="text-[12px] text-text-muted mb-1">Target Audience</p>
                <p className="text-[14px] font-medium text-text-primary">
                  {formatLevel(course.level_min)} to {formatLevel(course.level_max)} Students
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardContent className="p-6 text-center space-y-2">
              <p className="text-[13px] text-text-secondary">
                {course.is_published ? "This course is currently published." : "Ready to publish this course?"}
              </p>
              <Button 
                className={cn(
                  "w-full h-10 text-white font-medium",
                  course.is_published ? "bg-amber-600 hover:bg-amber-700" : "bg-success hover:bg-success/90"
                )}
                onClick={() => updateCourse({ id, data: { is_published: !course.is_published } })}
                disabled={updatingCourse}
              >
                {updatingCourse ? "Saving..." : course.is_published ? "Unpublish Curriculum" : "Publish Curriculum"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog 
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Course?"
        description="This action cannot be undone. All units, lessons, and progress data for this course will be permanently deleted."
        onConfirm={() => {
          deleteCourse(id, {
            onSuccess: () => {
              setIsDeleteDialogOpen(false);
              router.push('/courses');
            }
          });
        }}
      />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] text-text-secondary">{label}</span>
      <span className="text-[14px] font-semibold text-text-primary">{value}</span>
    </div>
  );
}
