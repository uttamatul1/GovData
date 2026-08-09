import type { Metric } from '../../types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Badge } from '../ui/badge';
import { SourceBadge } from './SourceBadge';
import { ArrowUpRight, ArrowDownRight, Info, CheckCircle2 } from 'lucide-react';

interface MetricInfoModalProps {
  metric: Metric | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MetricInfoModal({ metric, isOpen, onClose }: MetricInfoModalProps) {
  if (!metric) return null;

  const totalStatesWithData = metric.stateData.length;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="capitalize text-xs font-semibold">
              {metric.sector} Sector
            </Badge>
            <Badge variant="secondary" className="text-xs font-mono">
              Unit: {metric.unit || 'Score / Index'}
            </Badge>
          </div>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            {metric.label}
          </DialogTitle>
          <DialogDescription className="text-sm pt-2 text-foreground/80 leading-relaxed">
            {metric.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2 border-t mt-3 text-sm">
          {/* Desirable Direction */}
          <div className="flex items-center justify-between bg-muted/40 p-2.5 rounded-lg">
            <span className="text-xs font-medium text-muted-foreground">Desired Direction</span>
            <div className="flex items-center gap-1.5 font-medium text-xs">
              {metric.higherIsBetter ? (
                <>
                  <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Higher is Better</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="w-4 h-4 text-blue-500" />
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">Lower is Better</span>
                </>
              )}
            </div>
          </div>

          {/* Official Source */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">Official Source / Survey</span>
            <SourceBadge source={metric.sourceReport} />
          </div>

          {/* State Coverage */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">State & UT Coverage</span>
            <span className="text-xs font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              {totalStatesWithData} States/UTs Available
            </span>
          </div>

          {/* National Summary */}
          {metric.nationalData.length > 0 && (
            <div className="border-t pt-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                National Historical Trend
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {[...metric.nationalData].slice(-3).map((d) => (
                  <div key={d.year} className="border rounded p-2 text-center bg-muted/20">
                    <div className="text-[10px] text-muted-foreground">{d.year}</div>
                    <div className="text-sm font-bold">{d.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
