'use client';

import { useQuery } from '@tanstack/react-query';
import { analyticsApi, type DateRangeParams } from '@/lib/api/analytics';
import { BookOpen, GraduationCap, Target, Brain } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { COLORS, StatCard, ChartCard, TabLoading, TabError } from './shared';

export function LearningTab({ range }: { range: DateRangeParams }) {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics-learning', range],
    queryFn: () => analyticsApi.getLearning(range),
  });

  if (isLoading) return <TabLoading />;
  if (!data) return <TabError />;

  const totalStarted = data.course_completion.reduce((sum, c) => sum + c.started, 0);
  const totalCompleted = data.course_completion.reduce((sum, c) => sum + c.completed, 0);
  const overallRate = totalStarted ? Math.round((totalCompleted / totalStarted) * 1000) / 10 : 0;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Lessons Started (Range)" value={totalStarted} icon={<BookOpen className="text-primary" size={20} />} trend="All courses combined" />
        <StatCard title="Completion Rate" value={`${overallRate}%`} icon={<Target className="text-success" size={20} />} trend="Started vs. completed" />
        <StatCard
          title="Placement Attempts"
          value={data.placement_levels.reduce((sum, p) => sum + p.count, 0)}
          icon={<GraduationCap className="text-info" size={20} />}
          trend="Level tests taken in range"
        />
        <StatCard
          title="SRS Items Mastered"
          value={data.srs_distribution.find((s) => s.bucket.startsWith('Mastered'))?.count ?? 0}
          icon={<Brain className="text-warning" size={20} />}
          trend="Easiness factor 3.0+"
        />
      </div>

      <ChartCard title="Completion Rate by Course" icon={<BookOpen size={18} className="text-text-muted" />}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.course_completion}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="course" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis fontSize={12} tickLine={false} axisLine={false} unit="%" />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            <Bar dataKey="rate" fill="#0A3B6A" radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ChartCard title="Mastery Score Distribution" icon={<Target size={18} className="text-text-muted" />}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data.mastery_distribution} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={5} dataKey="count" nameKey="bucket">
                {data.mastery_distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Placement Test Levels" icon={<GraduationCap size={18} className="text-text-muted" />}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.placement_levels}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="level" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="count" fill="#33C8C0" radius={[4, 4, 0, 0]} barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Spaced Repetition Mastery" icon={<Brain size={18} className="text-text-muted" />}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data.srs_distribution} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={5} dataKey="count" nameKey="bucket">
                {data.srs_distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
