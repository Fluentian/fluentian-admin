'use client';

import { PageHeader } from "@/components/layout/PageHeader";
import { OpportunityForm } from "@/components/opportunities/OpportunityForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { opportunitiesApi } from "@/lib/api/opportunities";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function NewOpportunityPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: createOpportunity, isPending } = useMutation({
    mutationFn: opportunitiesApi.createOpportunity,
    onSuccess: () => {
      toast.success("Opportunity posted successfully");
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      router.push('/opportunities');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to post opportunity");
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Post Opportunity" 
        subtitle="Share a new scholarship, internship, or event with the community."
      />
      <OpportunityForm onSubmit={(data) => createOpportunity(data)} isLoading={isPending} />
    </div>
  );
}
