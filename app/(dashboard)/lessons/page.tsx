'use client';

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLessons } from "@/lib/hooks/useLessons";
import { DataTable } from "@/components/shared/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Lesson } from "@/lib/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate, getLessonKindLabel } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

export default function LessonsPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useLessons({ size: 20 });

  const columns: ColumnDef<Lesson>[] = [
    {
      header: "Title",
      accessorKey: "title",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-text-primary">{row.original.title}</span>
          <span className="text-[11px] text-text-muted uppercase tracking-wider">
            {getLessonKindLabel(row.original.lesson_kind)}
          </span>
        </div>
      )
    },
    {
      header: "XP",
      accessorKey: "xp_reward",
      cell: ({ row }) => (
        <span className="font-medium text-primary">+{row.original.xp_reward} XP</span>
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
        <div className="flex items-center gap-3">
          <Link 
            href={`/lessons/${row.original.id}`} 
            className="text-primary hover:underline text-[13px] font-medium"
          >
            View
          </Link>
          <Link 
            href={`/lessons/${row.original.id}/edit`} 
            className="text-text-secondary hover:text-text-primary text-[13px]"
          >
            Edit
          </Link>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Lessons" 
          subtitle="Manage your curriculum content and interactive lessons."
        />
        <Link href="/lessons/new">
          <Button className="gap-2">
            <Plus size={18} />
            New Lesson
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center bg-white p-4 rounded-xl shadow-sm border border-border/40">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <Input 
            placeholder="Search lessons..." 
            className="pl-10 bg-gray-50 border-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2 border-border/60">
          <Filter size={18} />
          Filters
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border/40 overflow-hidden">
        <DataTable 
          columns={columns} 
          data={data?.items ?? []} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
}
