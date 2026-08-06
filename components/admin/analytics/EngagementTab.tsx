'use client';

import { useQuery } from '@tanstack/react-query';
import { analyticsApi, type DateRangeParams } from '@/lib/api/analytics';
import { Activity, Flame, Users, Repeat } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { COLORS, StatCard, ChartCard, TabLoading, TabError } from './shared';

export function EngagementTab({ range }: { range: DateRangeParams }) {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics-engagement', range],
    queryFn: () => analyticsApi.getEngagement(range),
  });

  if (isLoading) return <TabLoading />;
  if (!data) return <TabError />;

  const d7 = data.retention.find((r) => r.cohort === 'D7')?.percent ?? 0;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="30D Active Users" value={data.mau_30d} icon={<Users className="text-primary" size={20} />} trend="Distinct learners active in last 30 days" />
        <StatCard title="D7 Retention" value={`${d7}%`} icon={<Repeat className="text-success" size={20} />} trend="Cohort stability at day 7" />
        <StatCard
          title="Peak Daily Active"
          value={data.dau_trend.length ? Math.max(...data.dau_trend.map((d) => d.active_users)) : 0}
          icon={<Activity className="text-info" size={20} />}
          trend="Highest single-day activity in range"
        />
        <StatCard
          title="Top Streak Band"
          value={data.streak_distribution.reduce((a, b) => (b.count > a.count ? b : a), data.streak_distribution[0] ?? { band: '—', count: 0 }).band}
          icon={<Flame className="text-warning" size={20} />}
          trend="Most common streak length"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ChartCard title="Daily Active Users" icon={<Activity size={18} className="text-text-muted" />} className="lg:col-span-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.dau_trend}>
              <defs>
                <linearGradient id="colorDau" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#259291" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#259291" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val: string) => val.split('-').slice(1).join('/')} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="active_users" stroke="#259291" fillOpacity={1} fill="url(#colorDau)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Retention Cohorts" icon={<Repeat size={18} className="text-text-muted" />}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.retention}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="cohort" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} unit="%" />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="percent" fill="#0A3B6A" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Streak Distribution" icon={<Flame size={18} className="text-text-muted" />}>
          <ResponsiveContainer width="100%" height="80%">
            <PieChart>
              <Pie data={data.streak_distribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="count" nameKey="band">
                {data.streak_distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-4 w-full mt-4">
            {data.streak_distribution.map((entry, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-[12px] text-text-secondary">
                  {entry.band}: {entry.count}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Session Frequency (Active Days in Range)" icon={<Activity size={18} className="text-text-muted" />}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.session_frequency}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="bucket" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="count" fill="#33C8C0" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
