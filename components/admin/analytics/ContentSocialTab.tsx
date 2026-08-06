'use client';

import { useQuery } from '@tanstack/react-query';
import { analyticsApi, type DateRangeParams } from '@/lib/api/analytics';
import { Phone, Video, Users, Star, Handshake } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { COLORS, StatCard, ChartCard, TabLoading, TabError } from './shared';

function pivotCallVolume(rows: { date: string; call_kind: string; calls: number; total_minutes: number }[]) {
  const byDate = new Map<string, { date: string; audio: number; video: number }>();
  for (const row of rows) {
    const entry = byDate.get(row.date) ?? { date: row.date, audio: 0, video: 0 };
    if (row.call_kind === 'audio') entry.audio += row.total_minutes;
    else entry.video += row.total_minutes;
    byDate.set(row.date, entry);
  }
  return Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date));
}

export function ContentSocialTab({ range }: { range: DateRangeParams }) {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics-content-social', range],
    queryFn: () => analyticsApi.getContentSocial(range),
  });

  if (isLoading) return <TabLoading />;
  if (!data) return <TabError />;

  const totalMinutes = data.call_volume.reduce((sum, c) => sum + c.total_minutes, 0);
  const totalCalls = data.call_volume.reduce((sum, c) => sum + c.calls, 0);
  const avgAudio = data.avg_call_duration_minutes.find((a) => a.call_kind === 'audio');
  const avgVideo = data.avg_call_duration_minutes.find((a) => a.call_kind === 'video');
  const chartData = pivotCallVolume(data.call_volume);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Call Minutes" value={Math.round(totalMinutes)} icon={<Phone className="text-primary" size={20} />} trend={`${totalCalls} calls in range`} />
        <StatCard title="Avg. Audio Call" value={`${avgAudio?.avg_minutes ?? 0} min`} icon={<Phone className="text-info" size={20} />} trend={`${avgAudio?.count ?? 0} audio calls`} />
        <StatCard title="Avg. Video Call" value={`${avgVideo?.avg_minutes ?? 0} min`} icon={<Video className="text-success" size={20} />} trend={`${avgVideo?.count ?? 0} video calls`} />
        <StatCard title="Live Lobby Now" value={data.live_lobby_active_now} icon={<Users className="text-warning" size={20} />} trend="Browsing in last 5 minutes" />
      </div>

      <ChartCard title="Call Minutes by Day (Audio vs Video)" icon={<Phone size={18} className="text-text-muted" />}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val: string) => val.split('-').slice(1).join('/')} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            <Legend />
            <Bar dataKey="audio" stackId="minutes" fill="#0A3B6A" name="Audio" radius={[0, 0, 0, 0]} />
            <Bar dataKey="video" stackId="minutes" fill="#33C8C0" name="Video" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Accountability Partnership Status" icon={<Handshake size={18} className="text-text-muted" />}>
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie data={data.partnership_status} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="count" nameKey="status">
                {data.partnership_status.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-4 w-full mt-4">
            {data.partnership_status.map((entry, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-[12px] text-text-secondary capitalize">
                  {entry.status}: {entry.count}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Lesson Feedback by Category" icon={<Star size={18} className="text-text-muted" />}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.feedback_by_category}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="category" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} domain={[0, 5]} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="avg_rating" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={32} name="Avg. rating" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
