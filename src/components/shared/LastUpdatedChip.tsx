import { useMemo } from 'react';
import { Clock } from 'lucide-react';
import { reportsData } from '../../data';
import { formatReportDate } from '../../utils/format.utils';

export function LastUpdatedChip({ reportId }: { reportId: string }) {
  const report = useMemo(() => reportsData.find(r => r.id === reportId), [reportId]);

  if (!report) return null;

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/40 px-2 py-1 rounded-md w-fit">
      <Clock className="w-3 h-3" />
      <span>Updated: {formatReportDate(report.lastRelease)}</span>
    </div>
  );
}
