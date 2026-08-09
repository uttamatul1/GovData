import { X, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { useHappiness } from '../../hooks/useHappiness';
import { cn } from '../../lib/utils';

export function HappinessDialog() {
  const { score, emoji, label, reasons, showDialog } = useHappiness();

  if (!showDialog || reasons.length === 0) return null;

  const getBgGradient = () => {
    if (score >= 60) return 'from-emerald-500/5 to-green-500/10 dark:from-emerald-500/10 dark:to-green-500/20';
    if (score >= 30) return 'from-yellow-500/5 to-amber-500/10 dark:from-yellow-500/10 dark:to-amber-500/20';
    return 'from-red-500/5 to-orange-500/10 dark:from-red-500/10 dark:to-orange-500/20';
  };

  const getBorderColor = () => {
    if (score >= 60) return 'border-emerald-500/30';
    if (score >= 30) return 'border-yellow-500/30';
    return 'border-red-500/30';
  };

  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)]',
        'rounded-2xl border shadow-2xl backdrop-blur-xl',
        'bg-gradient-to-br',
        getBgGradient(),
        getBorderColor(),
        'animate-slide-up bg-card/95'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl animate-bounce">{emoji}</span>
          <div>
            <h4 className="text-sm font-bold">Citizens are {label}</h4>
            <p className="text-[10px] text-muted-foreground">
              Happiness Score: {score}/100
            </p>
          </div>
        </div>
        <button
          className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition"
          aria-label="Close dialog"
          onClick={() => {/* Dialog auto-hides via timer */}}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Reasons */}
      <div className="px-4 pb-4 space-y-2 max-h-[260px] overflow-y-auto scrollbar-thin">
        {reasons.map((reason, i) => (
          <div
            key={i}
            className={cn(
              'flex items-start gap-2 p-2.5 rounded-lg text-xs',
              reason.impact === 'positive'
                ? 'bg-emerald-500/10 dark:bg-emerald-500/15'
                : reason.impact === 'negative'
                  ? 'bg-red-500/10 dark:bg-red-500/15'
                  : 'bg-muted/50'
            )}
          >
            <span className="shrink-0 mt-0.5">
              {reason.impact === 'positive' ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : reason.impact === 'negative' ? (
                <TrendingDown className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </span>
            <span className={cn(
              'leading-relaxed',
              reason.impact === 'positive' ? 'text-emerald-800 dark:text-emerald-300' :
              reason.impact === 'negative' ? 'text-red-800 dark:text-red-300' :
              'text-foreground'
            )}>
              {reason.text}
            </span>
            <span className={cn(
              'shrink-0 ml-auto text-[10px] font-bold',
              reason.impact === 'positive' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
            )}>
              {reason.points > 0 ? '+' : ''}{reason.points}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 pb-3 pt-1 border-t border-border/50">
        <p className="text-[9px] text-muted-foreground text-center italic">
          Happiness reflects how your budget allocations impact the daily lives of 1.4 billion citizens.
        </p>
      </div>

      {/* Auto-dismiss progress bar */}
      <div className="h-0.5 bg-muted rounded-b-2xl overflow-hidden">
        <div className="h-full bg-primary/50 animate-shrink-width" />
      </div>
    </div>
  );
}
