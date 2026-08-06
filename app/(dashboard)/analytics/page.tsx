'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Download } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DateRangeFilter, rangeForPreset, type DateRange } from '@/components/admin/analytics/DateRangeFilter';
import { OverviewTab } from '@/components/admin/analytics/OverviewTab';
import { EngagementTab } from '@/components/admin/analytics/EngagementTab';
import { LearningTab } from '@/components/admin/analytics/LearningTab';
import { ContentSocialTab } from '@/components/admin/analytics/ContentSocialTab';
import { AiUsageTab } from '@/components/admin/analytics/AiUsageTab';
import { analyticsApi, type AnalyticsDomain } from '@/lib/api/analytics';
import { getErrorMessage } from '@/lib/utils/api-error';

const TABS: { value: AnalyticsDomain; label: string }[] = [
  { value: 'overview', label: 'Overview' },
  { value: 'engagement', label: 'Engagement' },
  { value: 'learning', label: 'Learning' },
  { value: 'content-social', label: 'Content & Social' },
  { value: 'ai-usage', label: 'AI Usage' },
];

export default function AnalyticsPage() {
  const [range, setRange] = useState<DateRange>(() => rangeForPreset(30));
  const [activeTab, setActiveTab] = useState<AnalyticsDomain>('overview');
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      await analyticsApi.exportCsv(activeTab, range);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <PageHeader title="Analytics" subtitle="Engagement, learning performance, content & social activity, and AI usage across Fluentian.">
        <Button variant="outline" size="sm" onClick={handleExport} disabled={exporting} className="gap-2">
          <Download size={14} />
          {exporting ? 'Exporting…' : 'Export CSV'}
        </Button>
      </PageHeader>

      <DateRangeFilter value={range} onChange={setRange} />

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as AnalyticsDomain)}>
        <TabsList>
          {TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab range={range} />
        </TabsContent>
        <TabsContent value="engagement">
          <EngagementTab range={range} />
        </TabsContent>
        <TabsContent value="learning">
          <LearningTab range={range} />
        </TabsContent>
        <TabsContent value="content-social">
          <ContentSocialTab range={range} />
        </TabsContent>
        <TabsContent value="ai-usage">
          <AiUsageTab range={range} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
