'use client';
import { useEffect, useState } from 'react';
import apiClient from '@/lib/api/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type Report = { id: string; call_id: string; user_id: string; topic?: string; goal_completed: boolean; corrections: { original?: string; corrected?: string; explanation?: string }[]; vocabulary: string[]; focus_tip: string; cultural_note?: string; created_at: string };

export default function AiCallReportsPage() {
  const [reports, setReports] = useState<Report[]>([]); const [loading, setLoading] = useState(true);
  const load = async () => { setLoading(true); try { setReports((await apiClient.get<Report[]>('/admin/ai-call-reports')).data); } finally { setLoading(false); } };
  useEffect(() => { void load(); }, []);
  return <div className="max-w-5xl space-y-6"><div><h1 className="text-2xl font-bold">AI Call Reports</h1><p className="text-text-muted">Review text-only learning feedback generated after AI practice calls.</p></div><Button variant="outline" onClick={load}>Refresh</Button>{loading ? <p>Loading reports…</p> : reports.length === 0 ? <Card><CardContent className="py-10 text-center text-text-muted">No AI call reports yet.</CardContent></Card> : reports.map((r) => <Card key={r.id}><CardHeader className="flex-row items-center justify-between"><div><CardTitle>{r.topic || 'AI practice'}</CardTitle><p className="text-xs text-text-muted">{new Date(r.created_at).toLocaleString()} · User {r.user_id}</p></div><Badge variant={r.goal_completed ? 'default' : 'secondary'}>{r.goal_completed ? 'Goal complete' : 'Practice'}</Badge></CardHeader><CardContent className="space-y-3"><div><strong>Focus tip:</strong> {r.focus_tip}</div>{r.corrections.length > 0 && <div><strong>Corrections:</strong> {r.corrections.map((c, i) => <p key={i} className="text-sm text-text-muted">{c.original} → {c.corrected}</p>)}</div>}{r.vocabulary.length > 0 && <div><strong>Vocabulary:</strong> {r.vocabulary.join(' · ')}</div>}{r.cultural_note && <div><strong>Cultural note:</strong> {r.cultural_note}</div>}</CardContent></Card>)}</div>;
}
