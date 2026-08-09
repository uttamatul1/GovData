import { cn } from '../../lib/utils';
import { formatValue } from '../../utils/format.utils';
import { Card, CardContent } from '../ui/card';

interface StatCardProps {
  label: string;
  value: number;
  unit?: string;
  sectorColorClass?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function StatCard({ label, value, unit, sectorColorClass, trend: _trend }: StatCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className={cn("h-1 w-full", sectorColorClass || "bg-primary")} />
      <CardContent className="p-4 flex flex-col justify-center h-full">
        <p className="text-sm font-medium text-muted-foreground truncate" title={label}>
          {label}
        </p>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-2xl font-bold">{formatValue(value)}</span>
          {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
        </div>
      </CardContent>
    </Card>
  );
}
