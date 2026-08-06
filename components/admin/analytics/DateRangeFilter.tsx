'use client';

import { format, subDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface DateRange {
  startDate: string;
  endDate: string;
}

const PRESETS = [
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
];

export function rangeForPreset(days: number): DateRange {
  const end = new Date();
  return {
    startDate: format(subDays(end, days), 'yyyy-MM-dd'),
    endDate: format(end, 'yyyy-MM-dd'),
  };
}

export function DateRangeFilter({
  value,
  onChange,
}: {
  value: DateRange;
  onChange: (range: DateRange) => void;
}) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const activePresetDays = PRESETS.find((p) => {
    const preset = rangeForPreset(p.days);
    return value.startDate === preset.startDate && value.endDate === preset.endDate;
  })?.days;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1 rounded-md bg-gray-50 p-1">
        {PRESETS.map((preset) => (
          <Button
            key={preset.label}
            size="sm"
            variant={activePresetDays === preset.days ? 'default' : 'ghost'}
            className="h-7 px-3 text-[12px]"
            onClick={() => onChange(rangeForPreset(preset.days))}
          >
            {preset.label}
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="date"
          value={value.startDate}
          max={value.endDate}
          onChange={(e) => onChange({ ...value, startDate: e.target.value })}
          className="h-8 w-[150px] text-[12px]"
        />
        <span className="text-text-muted text-[12px]">to</span>
        <Input
          type="date"
          value={value.endDate}
          min={value.startDate}
          max={today}
          onChange={(e) => onChange({ ...value, endDate: e.target.value })}
          className="h-8 w-[150px] text-[12px]"
        />
      </div>
    </div>
  );
}
