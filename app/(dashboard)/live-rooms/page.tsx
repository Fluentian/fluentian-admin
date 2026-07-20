'use client';

import { useCallback, useEffect, useState } from 'react';
import apiClient from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type SafetyReport = {
  id: string;
  reporter_user_id: string;
  reported_user_id?: string;
  room_name: string;
  category: string;
  details: string;
  status: 'open' | 'reviewing' | 'resolved' | 'dismissed';
  created_at: string;
};

export default function LiveRoomsPage() {
  const [title, setTitle] = useState('Fluentian Live');
  const [description, setDescription] = useState('A hosted conversation with the Fluentian team.');
  const [active, setActive] = useState(false);
  const [scheduled, setScheduled] = useState('');
  const [message, setMessage] = useState('');
  const [reports, setReports] = useState<SafetyReport[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);

  const loadReports = useCallback(async () => {
    setLoadingReports(true);
    try {
      const { data } = await apiClient.get<SafetyReport[]>('/social/safety/reports');
      setReports(data);
    } finally {
      setLoadingReports(false);
    }
  }, []);

  useEffect(() => {
    apiClient.get('/social/live-rooms/special/config').then(({ data }) => {
      setTitle(data.title);
      setDescription(data.description);
      setActive(data.is_active);
      setScheduled(data.scheduled_at ? data.scheduled_at.slice(0, 16) : '');
    });
    void loadReports();
  }, [loadReports]);

  const save = async () => {
    await apiClient.put('/social/live-rooms/special', {
      title,
      description,
      is_active: active,
      scheduled_at: scheduled ? new Date(scheduled).toISOString() : null,
    });
    setMessage(active ? 'The special room is live now.' : 'The special room schedule was saved.');
  };

  const updateReport = async (id: string, status: SafetyReport['status']) => {
    await apiClient.patch(`/social/safety/reports/${id}`, { status });
    await loadReports();
  };

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Live Rooms & Safety</h1>
        <p className="text-text-muted">Manage the featured room and review confidential community reports.</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader><CardTitle>Special room</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Room title" />
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
          <label className="block text-sm font-semibold">Scheduled start</label>
          <Input type="datetime-local" value={scheduled} onChange={(e) => setScheduled(e.target.value)} />
          <label className="flex gap-2"><input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /> Start manually now</label>
          <Button onClick={save}>Save room</Button>
          {message && <p className="text-sm text-success">{message}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Community safety queue</CardTitle>
            <p className="mt-1 text-sm text-text-muted">Reports are confidential and should only be used for moderation.</p>
          </div>
          <Button variant="outline" onClick={loadReports}>Refresh</Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {loadingReports ? <p className="py-8 text-center text-text-muted">Loading safety reports…</p> : reports.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center text-text-muted">No safety reports. The community queue is clear.</div>
          ) : reports.map((report) => (
            <div key={report.id} className="rounded-xl border bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold capitalize">{report.category.replace('_', ' ')}</span>
                    <Badge variant={report.status === 'open' ? 'destructive' : 'secondary'}>{report.status}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-text-muted">{report.room_name} · {new Date(report.created_at).toLocaleString()}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {report.status === 'open' && <Button size="sm" variant="outline" onClick={() => updateReport(report.id, 'reviewing')}>Start review</Button>}
                  <Button size="sm" onClick={() => updateReport(report.id, 'resolved')}>Resolve</Button>
                  <Button size="sm" variant="ghost" onClick={() => updateReport(report.id, 'dismissed')}>Dismiss</Button>
                </div>
              </div>
              {report.details && <p className="mt-3 rounded-lg bg-muted/50 p-3 text-sm">{report.details}</p>}
              <p className="mt-3 text-xs text-text-muted">Reporter: {report.reporter_user_id} · Reported: {report.reported_user_id ?? 'Room-level report'}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
