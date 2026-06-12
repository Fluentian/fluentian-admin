'use client';

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Send, History, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation } from "@tanstack/react-query";
import { notificationsApi } from "@/lib/api/notifications";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";

export default function NotificationsPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const { data: history, isLoading, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationsApi.getNotifications()
  });

  const { mutate: sendNotification, isPending } = useMutation({
    mutationFn: () => notificationsApi.sendNotification({
      user_id: "global",
      title,
      body
    }),
    onSuccess: (response) => {
      toast.success(response.detail ?? "Notification sent to all students");
      setTitle("");
      setBody("");
      refetch();
    },
    onError: () => {
      toast.error("Failed to send notification");
    }
  });

  return (
    <div className="space-y-8">
      <PageHeader title="Notifications" subtitle="Broadcast in-app announcements to students." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Send Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-[16px] flex items-center gap-2">
                <Send size={18} className="text-primary" />
                Broadcast New Message
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="p-4 bg-primary/5 border border-primary/10 rounded-lg flex gap-3">
                <Info size={18} className="text-primary shrink-0 mt-0.5" />
                <p className="text-[13px] text-primary/80">
                  Broadcast messages appear in each eligible student&apos;s in-app notification inbox. Students can mark them read in the mobile app.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input 
                  placeholder="e.g. New Course Available!" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Message Body</Label>
                <Textarea 
                  placeholder="Write your announcement details here..." 
                  className="min-h-[120px]"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
              </div>

              <div className="pt-4 flex justify-end">
                <Button 
                  onClick={() => sendNotification()} 
                  disabled={isPending || !title || !body}
                  className="px-8 gap-2 h-10 font-bold"
                >
                  {isPending ? <LoadingSpinner className="text-white" /> : <Send size={16} />}
                  Send Broadcast
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* History */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm h-full">
            <CardHeader className="border-b">
              <CardTitle className="text-[15px] flex items-center gap-2">
                <History size={16} className="text-text-muted" />
                Recent Inbox History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-8 flex justify-center"><LoadingSpinner /></div>
              ) : history && history.items.length > 0 ? (
                <div className="divide-y max-h-[500px] overflow-y-auto">
                  {history.items.map((n) => (
                    <div key={n.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <p className="text-[14px] font-bold text-text-primary mb-1">{n.title}</p>
                      <p className="text-[12px] text-text-secondary line-clamp-2 mb-2">{n.body}</p>
                      <p className="text-[10px] text-text-muted font-medium uppercase">{formatDate(n.created_at)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-text-muted text-[13px]">
                  No history found.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
