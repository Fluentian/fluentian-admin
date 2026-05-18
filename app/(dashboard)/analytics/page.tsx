'use client';

import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/lib/api/analytics";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Award,
  Calendar,
  CheckCircle2,
  Filter,
  BarChart3,
  AlertTriangle,
  Zap
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

const COLORS = ['#6C3BF5', '#9F7AEA', '#B794F4', '#E9D8FD'];

export default function AnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics-dashboard'],
    queryFn: () => analyticsApi.getDashboard()
  });

  if (isLoading) return <div className="p-12 flex justify-center"><LoadingSpinner size={32} /></div>;
  if (!data) return <div className="p-12 text-center">Failed to load analytics</div>;

  const { summary, timeline, funnel, content_performance } = data;

  return (
    <div className="space-y-8 pb-20">
      <PageHeader 
        title="Deep Analytics Dashboard" 
        description="Explore detailed user behavior, retention cohorts, and content performance metrics."
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Learners" 
          value={summary.total_users} 
          icon={<Users className="text-primary" size={20} />} 
          trend="Total registrations"
        />
        <StatCard 
          title="7D Active Users" 
          value={summary.active_users_7d} 
          icon={<Zap className="text-warning" size={20} />} 
          trend={`${((summary.active_users_7d / summary.total_users) * 100).toFixed(1)}% of total`}
        />
        <StatCard 
          title="7D Retention" 
          value={`${summary.retention_7d_percent}%`} 
          icon={<TrendingUp className="text-success" size={20} />} 
          trend="D7 cohort stability"
        />
        <StatCard 
          title="Avg. Mastery" 
          value={`${summary.average_score}%`} 
          icon={<Award className="text-info" size={20} />} 
          trend="Knowledge acquisition"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Registration & Activity Timeline */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[16px] flex items-center gap-2">
              <Calendar size={18} className="text-text-muted" />
              Growth & Activity (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[350px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline.activity}>
                <defs>
                  <linearGradient id="colorStarted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6C3BF5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6C3BF5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => val.split('-').slice(1).join('/')}
                />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="started" stroke="#6C3BF5" fillOpacity={1} fill="url(#colorStarted)" strokeWidth={3} />
                <Area type="monotone" dataKey="completed" stroke="#10b981" fillOpacity={0} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* XP Distribution */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-[16px] flex items-center gap-2">
              <Award size={18} className="text-text-muted" />
              User XP Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[350px] flex flex-col items-center">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={content_performance.xp_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="range"
                >
                  {content_performance.xp_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 w-full mt-4">
              {content_performance.xp_distribution.map((entry, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-[12px] text-text-secondary">{entry.range}: {entry.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Conversion Funnel */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-[16px] flex items-center gap-2">
              <Filter size={18} className="text-text-muted" />
              Learning Funnel (Absolute)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[350px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={funnel} margin={{ left: 40, right: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="stage" 
                  type="category" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#6C3BF5" 
                  radius={[0, 4, 4, 0]} 
                  barSize={32}
                  label={{ position: 'right', fill: '#64748b', fontSize: 12 }}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Drop-off Analysis */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-[16px] flex items-center gap-2">
              <AlertTriangle size={18} className="text-warning" />
              Highest Drop-off Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {content_performance.dropoffs.map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[14px]">
                    <span className="font-medium text-text-primary">{item.title}</span>
                    <span className="text-danger font-medium">{item.rate}% success rate</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-danger/60" 
                      style={{ width: `${100 - item.rate}%`, marginLeft: 'auto' }}
                    />
                  </div>
                  <p className="text-[11px] text-text-muted">
                    High friction detected. Consider reviewing lesson content or quiz difficulty.
                  </p>
                </div>
              ))}
              {content_performance.dropoffs.length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle2 size={32} className="text-success/30 mx-auto mb-2" />
                  <p className="text-text-muted text-[14px]">No significant drop-offs detected.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend }: { title: string, value: string | number, icon: React.ReactNode, trend: string }) {
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
            {icon}
          </div>
        </div>
        <h3 className="text-text-muted text-[13px] font-medium">{title}</h3>
        <p className="text-[28px] font-bold text-text-primary mt-1">{value}</p>
        <p className="text-[11px] text-text-muted mt-2">{trend}</p>
      </CardContent>
    </Card>
  );
}
