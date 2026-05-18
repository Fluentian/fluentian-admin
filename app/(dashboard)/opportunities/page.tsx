'use client';

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus, Globe, ExternalLink, Calendar, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { opportunitiesApi } from "@/lib/api/opportunities";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/shared/EmptyState";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OpportunitiesPage() {
  const router = useRouter();
  const { data: opportunities, isLoading } = useQuery({
    queryKey: ['opportunities'],
    queryFn: () => opportunitiesApi.getOpportunities()
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Opportunities" subtitle="Manage scholarships, internships, and events.">
        <Link href="/opportunities/new">
          <Button className="gap-2">
            <Plus size={16} />
            Post Opportunity
          </Button>
        </Link>
      </PageHeader>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <LoadingSpinner size={32} />
        </div>
      ) : opportunities && opportunities.items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {opportunities.items.map((op) => (
            <Card key={op.id} className="border-none shadow-sm overflow-hidden flex flex-col">
              <CardHeader className="bg-gray-50/50 border-b flex flex-row items-center justify-between py-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-white rounded-lg border">
                    <Globe size={16} className="text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-[15px]">{op.title}</CardTitle>
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{op.type}</span>
                  </div>
                </div>
                <StatusBadge status={op.is_active ? 'active' : 'inactive'} />
              </CardHeader>
              <CardContent className="p-6 flex-1 flex flex-col">
                <p className="text-[14px] text-text-secondary line-clamp-3 mb-6">
                  {op.description}
                </p>
                <div className="mt-auto space-y-4">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1.5 text-text-muted">
                      <Calendar size={14} />
                      <span className="text-[12px]">Deadline: {op.deadline ? formatDate(op.deadline) : 'Ongoing'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-4 border-t">
                    <Link href={`/opportunities/${op.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full h-9 gap-2">
                        <ExternalLink size={14} />
                        View Details
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-text-muted hover:text-danger hover:bg-danger/10">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={Globe}
          title="No opportunities posted"
          description="Create your first scholarship or event post to share with the student community."
          action={{
            label: "Create Post",
            onClick: () => router.push('/opportunities/new')
          }}
        />
      )}
    </div>
  );
}
