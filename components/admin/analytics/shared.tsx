import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export const COLORS = ['#0A3B6A', '#259291', '#33C8C0', '#2C5E90', '#F59E0B', '#EF4444'];

export function StatCard({
  title,
  value,
  icon,
  trend,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: string;
}) {
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">{icon}</div>
        </div>
        <h3 className="text-text-muted text-[13px] font-medium">{title}</h3>
        <p className="text-[28px] font-bold text-text-primary mt-1">{value}</p>
        <p className="text-[11px] text-text-muted mt-2">{trend}</p>
      </CardContent>
    </Card>
  );
}

export function ChartCard({
  title,
  icon,
  children,
  className,
  height = 'h-[350px]',
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  height?: string;
}) {
  return (
    <Card className={`border-none shadow-sm ${className ?? ''}`}>
      <CardHeader>
        <CardTitle className="text-[16px] flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className={`${height} pt-4`}>{children}</CardContent>
    </Card>
  );
}

export function TabLoading() {
  return (
    <div className="p-12 flex justify-center">
      <LoadingSpinner size={32} />
    </div>
  );
}

export function TabError() {
  return <div className="p-12 text-center text-text-muted">Failed to load analytics for this section.</div>;
}
