'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { opportunitiesApi } from "@/lib/api/opportunities";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, FileText, CheckCircle2, XCircle, Clock, ExternalLink, User } from "lucide-react";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from 'react';

export default function OpportunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params.id as string;
  const [selectedApp, setSelectedApp] = useState<any>(null);

  const { data: opportunity, isLoading: loadingOp } = useQuery({
    queryKey: ['opportunity', id],
    queryFn: () => opportunitiesApi.getOpportunity(id)
  });

  const { data: applications, isLoading: loadingApps } = useQuery({
    queryKey: ['applications', id],
    queryFn: () => opportunitiesApi.getApplications(id)
  });

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ appId, status }: { appId: string, status: string }) => 
      opportunitiesApi.updateApplicationStatus(appId, status),
    onSuccess: () => {
      toast.success("Status updated");
      queryClient.invalidateQueries({ queryKey: ['applications', id] });
    }
  });

  if (loadingOp) return <div className="p-12 flex justify-center"><LoadingSpinner size={32} /></div>;
  if (!opportunity) return <div className="p-12 text-center">Opportunity not found</div>;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-text-muted">
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-[24px] font-bold text-text-primary">{opportunity.title}</h1>
          <p className="text-text-muted text-[14px]">Posted on {formatDate(opportunity.created_at)}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Detail Panel */}
        <div className="col-span-1 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="border-b">
              <CardTitle className="text-[16px]">General Info</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label className="text-text-muted text-[11px] uppercase tracking-wider">Type</Label>
                <p className="text-[14px] font-medium capitalize">{opportunity.type}</p>
              </div>
              <div>
                <Label className="text-text-muted text-[11px] uppercase tracking-wider">Deadline</Label>
                <p className="text-[14px] font-medium">{opportunity.deadline ? formatDate(opportunity.deadline) : 'Ongoing'}</p>
              </div>
              <div>
                <Label className="text-text-muted text-[11px] uppercase tracking-wider">Status</Label>
                <div className="mt-1">
                  <StatusBadge status={opportunity.is_active ? 'active' : 'inactive'} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="border-b">
              <CardTitle className="text-[16px]">Description</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-[14px] text-text-secondary leading-relaxed whitespace-pre-wrap">
                {opportunity.description}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Applications Panel */}
        <div className="col-span-2 space-y-6">
          <Card className="border-none shadow-sm h-fit">
            <CardHeader className="border-b flex flex-row items-center justify-between">
              <CardTitle className="text-[16px]">Applications ({applications?.length || 0})</CardTitle>
              <Button variant="outline" size="sm" className="gap-2 h-8">
                <FileText size={14} />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {loadingApps ? (
                <div className="p-12 flex justify-center"><LoadingSpinner size={24} /></div>
              ) : applications && applications.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                      <TableHead className="pl-6">Applicant</TableHead>
                      <TableHead>Applied On</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right pr-6">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="pl-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[12px]">
                              {app.full_name?.charAt(0).toUpperCase() || app.user.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-[14px] font-semibold text-text-primary">{app.full_name || app.user.username}</p>
                              <p className="text-[12px] text-text-muted">{app.email || app.user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-[13px] text-text-muted">
                          {formatDate(app.created_at)}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={app.status} />
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setSelectedApp(app)}
                              className="h-8 gap-2"
                            >
                              <FileText size={14} />
                              Review
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => updateStatus({ appId: app.id, status: 'accepted' })}
                              className="text-success hover:bg-success/10 h-8 w-8"
                              title="Accept"
                            >
                              <CheckCircle2 size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => updateStatus({ appId: app.id, status: 'rejected' })}
                              className="text-danger hover:bg-danger/10 h-8 w-8"
                              title="Reject"
                            >
                              <XCircle size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-12 text-center">
                  <p className="text-text-muted text-[14px]">No applications yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Application Review Dialog */}
      <Dialog open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Review</DialogTitle>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-6 py-4">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[18px]">
                  {selectedApp.full_name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-text-primary">{selectedApp.full_name}</h3>
                  <p className="text-text-muted flex items-center gap-2">
                    <Mail size={14} /> {selectedApp.email}
                    {selectedApp.phone && <span className="ml-2">• {selectedApp.phone}</span>}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <section>
                  <h4 className="text-[11px] font-bold text-primary uppercase tracking-wider mb-2">Education</h4>
                  <p className="text-[14px] text-text-secondary whitespace-pre-wrap">{selectedApp.education || 'Not provided'}</p>
                </section>
                <section>
                  <h4 className="text-[11px] font-bold text-primary uppercase tracking-wider mb-2">Skills</h4>
                  <p className="text-[14px] text-text-secondary whitespace-pre-wrap">{selectedApp.skills || 'Not provided'}</p>
                </section>
              </div>

              <section>
                <h4 className="text-[11px] font-bold text-primary uppercase tracking-wider mb-2">Experience</h4>
                <p className="text-[14px] text-text-secondary whitespace-pre-wrap">{selectedApp.experience || 'Not provided'}</p>
              </section>

              <section className="p-4 border rounded-xl bg-white">
                <h4 className="text-[11px] font-bold text-primary uppercase tracking-wider mb-2">Motivation Letter</h4>
                <p className="text-[14px] text-text-primary leading-relaxed whitespace-pre-wrap">{selectedApp.motivation}</p>
              </section>

              {selectedApp.resume_url && (
                <section>
                  <h4 className="text-[11px] font-bold text-primary uppercase tracking-wider mb-2">Attachments</h4>
                  <a 
                    href={selectedApp.resume_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline text-[14px]"
                  >
                    <ExternalLink size={14} />
                    View Resume / Portfolio
                  </a>
                </section>
              )}

              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button variant="outline" onClick={() => setSelectedApp(null)}>Close</Button>
                <Button 
                  variant="ghost" 
                  className="text-danger hover:bg-danger/10"
                  onClick={() => { updateStatus({ appId: selectedApp.id, status: 'rejected' }); setSelectedApp(null); }}
                >
                  Reject
                </Button>
                <Button 
                  className="bg-success hover:bg-success/90"
                  onClick={() => { updateStatus({ appId: selectedApp.id, status: 'accepted' }); setSelectedApp(null); }}
                >
                  Accept Applicant
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode, className?: string }) {
  return <span className={className}>{children}</span>;
}
