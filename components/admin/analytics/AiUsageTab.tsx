'use client';

import { useQuery } from '@tanstack/react-query';
import { analyticsApi, type DateRangeParams } from '@/lib/api/analytics';
import { Bot, Zap, MessageSquare, Users2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { StatCard, ChartCard, TabLoading, TabError } from './shared';

export function AiUsageTab({ range }: { range: DateRangeParams }) {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics-ai-usage', range],
    queryFn: () => analyticsApi.getAiUsage(range),
  });

  if (isLoading) return <TabLoading />;
  if (!data) return <TabError />;

  const totalTokens = data.token_trend.reduce((sum, t) => sum + t.total_tokens, 0);
  const totalRequests = data.by_feature.reduce((sum, f) => sum + f.requests, 0);
  const totalConversations = data.conversation_volume.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Tokens" value={totalTokens.toLocaleString()} icon={<Zap className="text-primary" size={20} />} trend="Prompt + completion, in range" />
        <StatCard title="AI Requests" value={totalRequests} icon={<Bot className="text-info" size={20} />} trend="Across all features" />
        <StatCard title="Conversations Started" value={totalConversations} icon={<MessageSquare className="text-success" size={20} />} trend="AI tutor sessions in range" />
        <StatCard title="Top Consumer" value={data.top_users[0]?.username ?? '—'} icon={<Users2 className="text-warning" size={20} />} trend={`${(data.top_users[0]?.total_tokens ?? 0).toLocaleString()} tokens`} />
      </div>

      <ChartCard title="Token Usage Trend" icon={<Zap size={18} className="text-text-muted" />}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.token_trend}>
            <defs>
              <linearGradient id="colorPrompt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0A3B6A" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#0A3B6A" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#33C8C0" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#33C8C0" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val: string) => val.split('-').slice(1).join('/')} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            <Legend />
            <Area type="monotone" dataKey="prompt_tokens" name="Prompt" stroke="#0A3B6A" fillOpacity={1} fill="url(#colorPrompt)" strokeWidth={2} />
            <Area type="monotone" dataKey="completion_tokens" name="Completion" stroke="#33C8C0" fillOpacity={1} fill="url(#colorCompletion)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Usage by Feature" icon={<Bot size={18} className="text-text-muted" />}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.by_feature} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
              <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis dataKey="feature" type="category" fontSize={12} tickLine={false} axisLine={false} width={90} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="total_tokens" fill="#0A3B6A" radius={[0, 4, 4, 0]} barSize={24} name="Total tokens" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Users by Token Usage" icon={<Users2 size={18} className="text-text-muted" />}>
          <div className="space-y-3 overflow-y-auto h-full pr-2">
            {data.top_users.map((u, i) => (
              <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0">
                <div>
                  <p className="text-[13px] font-medium text-text-primary">{u.username}</p>
                  <p className="text-[11px] text-text-muted">{u.requests} requests</p>
                </div>
                <span className="text-[13px] font-semibold text-primary">{u.total_tokens.toLocaleString()}</span>
              </div>
            ))}
            {data.top_users.length === 0 && <p className="text-center text-text-muted text-[14px] py-8">No AI usage recorded in this range.</p>}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
