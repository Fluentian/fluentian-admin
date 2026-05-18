'use client';

import { PageHeader } from "@/components/layout/PageHeader";
import { useStudents } from "@/lib/hooks/useStudents";
import { Search, Filter, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { DataTable } from "@/components/shared/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/lib/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatLevel, formatDate } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: students, isLoading } = useStudents();

  const columns: ColumnDef<User>[] = [
    {
      header: "Student",
      accessorKey: "username",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[11px] font-bold">
            {row.original.username.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">{row.original.username}</span>
            <span className="text-[12px] text-text-muted">{row.original.email}</span>
          </div>
        </div>
      )
    },
    {
      header: "Level",
      accessorKey: "current_level",
      cell: ({ row }) => (
        <span className="bg-[#1A0A2E] text-white text-[11px] font-bold px-2 py-0.5 rounded">
          {formatLevel(row.original.current_level)}
        </span>
      )
    },
    {
      header: "XP",
      accessorKey: "xp_total",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <span className="text-text-muted">⚡</span>
          <span>{row.original.xp_total.toLocaleString()}</span>
        </div>
      )
    },
    {
      header: "Streak",
      accessorKey: "streak_days",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <span>🔥</span>
          <span>{row.original.streak_days} days</span>
        </div>
      )
    },
    {
      header: "Joined",
      accessorKey: "created_at",
      cell: ({ row }) => formatDate(row.original.created_at)
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <Link href={`/students/${row.original.id}`} className="text-primary text-[13px] font-medium hover:underline">
          View Profile
        </Link>
      )
    }
  ];

  const filteredStudents = students?.items.filter(s => 
    s.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) ?? [];

  return (
    <div className="space-y-6">
      <PageHeader title="Students" subtitle="Monitor learner progress and engagement." />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <Input 
            placeholder="Search students..." 
            className="pl-10 h-10" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="a0">A0</SelectItem>
            <SelectItem value="a1">A1</SelectItem>
            <SelectItem value="a2">A2</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Tier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tiers</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="plus">Plus</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable 
        columns={columns} 
        data={filteredStudents} 
        isLoading={isLoading} 
      />
    </div>
  );
}
