'use client';

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCourses, useDeleteCourse } from "@/lib/hooks/useCourses";
import { Plus, Search, Trash2, Edit, Upload } from "lucide-react";
import Link from "next/link";
import { DataTable } from "@/components/shared/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Course } from "@/lib/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate, formatLevel } from "@/lib/utils";
import { useState } from "react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: courses, isLoading } = useCourses();
  const { mutate: deleteCourse } = useDeleteCourse();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const columns: ColumnDef<Course>[] = [
    {
      header: "Code",
      accessorKey: "code",
      cell: ({ row }) => (
        <Link href={`/courses/${row.original.id}`} className="font-semibold text-primary hover:underline">
          {row.original.code}
        </Link>
      )
    },
    {
      header: "Level Range",
      cell: ({ row }) => (
        <span>{formatLevel(row.original.level_min)} → {formatLevel(row.original.level_max)}</span>
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
        <div className="flex items-center gap-4">
          <Link href={`/courses/${row.original.id}/edit`} className="text-primary text-[13px] font-medium hover:underline">
            Edit
          </Link>
          <button 
            onClick={() => setDeletingId(row.original.id)}
            className="text-danger text-[13px] font-medium hover:underline"
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  const filteredCourses = courses?.items.filter(c => 
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  ) ?? [];

  return (
    <div className="space-y-6">
      <PageHeader title="Courses" subtitle="Manage your language curriculum.">
        <div className="flex items-center gap-3">
          <Link href="/courses/import">
            <Button variant="outline" className="gap-2">
              <Upload size={16} />
              Import CSV
            </Button>
          </Link>
          <Link href="/courses/new">
            <Button className="gap-2">
              <Plus size={16} />
              New Course
            </Button>
          </Link>
        </div>
      </PageHeader>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <Input 
            placeholder="Search by course code..." 
            className="pl-10 h-10" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={filteredCourses} 
        isLoading={isLoading} 
      />

      <ConfirmDialog 
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
        title="Delete Course?"
        description="This action cannot be undone. All units and lessons inside this course will be permanently deleted."
        onConfirm={() => {
          if (deletingId) {
            deleteCourse(deletingId);
            setDeletingId(null);
          }
        }}
      />
    </div>
  );
}
