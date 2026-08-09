import { useState } from 'react';
import { useHappiness } from '../../hooks/useHappiness';
import { cn } from '../../lib/utils';
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function HappinessMeter() {
  const { score, emoji, label, reasons } = useHappiness();
  const [expanded, setExpanded] = useState(false);

  // Color gradient based on score
  const getGradient = () => {
    if (score >= 75) return 'from-emerald-500 to-green-400';
    if (score >= 60) return 'from-green-400 to-lime-400';
    if (score >= 45) return 'from-yellow-400 to-amber-400';
    if (score >= 30) return 'from-orange-400 to-red-400';
    return 'from-red-500 to-red-700';
  };

  const getBorderColor = () => {
    if (score >= 75) return 'border-emerald-500/30';
    if (score >= 60) return 'border-green-400/30';
    if (score >= 45) return 'border-yellow-400/30';
    if (score >= 30) return 'border-orange-400/30';
    return 'border-red-500/30';
  };

  const getGlowColor = () => {
    if (score >= 75) return 'shadow-emerald-500/20';
    if (score >= 60) return 'shadow-green-400/20';
    if (score >= 45) return 'shadow-yellow-400/20';
    if (score >= 30) return 'shadow-orange-400/20';
    return 'shadow-red-500/20';
  };

  const positiveReasons = reasons.filter(r => r.impact === 'positive');
  const negativeReasons = reasons.filter(r => r.impact === 'negative');

  return (
    <div
      className={cn(
        'rounded-xl border transition-all duration-500',
        'bg-card hover:shadow-lg',
        getBorderColor(),
        getGlowColor(),
        'shadow-md'
      )}
    >
      {/* Main meter bar */}
      <div className="flex items-center gap-2.5 sm:gap-4 px-3 sm:px-5 py-2.5 sm:py-3">
        {/* Emoji face - animated */}
        <div className="relative shrink-0">
          <span
            className="text-3xl sm:text-4xl transition-all duration-500 block"
            style={{ transform: `scale(${0.8 + (score / 100) * 0.4})` }}
          >
            {emoji}
          </span>
          {/* Pulse ring */}
          <div
            className={cn(
              'absolute inset-0 rounded-full animate-ping opacity-20',
              score >= 60 ? 'bg-green-400' : score >= 30 ? 'bg-yellow-400' : 'bg-red-400'
            )}
            style={{ animationDuration: '2s' }}
          />
        </div>

        {/* Meter bar */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1 sm:mb-1.5">
            <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">
              Citizen Happiness
            </span>
            <div className="flex items-center gap-1">
              <span className="text-base sm:text-lg font-bold">{score}</span>
              <span className="text-[9px] sm:text-[10px] text-muted-foreground">/100</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-3 bg-muted rounded-full overflow-hidden relative">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r',
                getGradient()
              )}
              style={{ width: `${score}%` }}
            >
              {/* Shimmer effect */}
              <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
            {/* Tick marks */}
            {[25, 50, 75].map((tick) => (
              <div
                key={tick}
                className="absolute top-0 bottom-0 w-px bg-foreground/10"
                style={{ left: `${tick}%` }}
              />
            ))}
          </div>

          <div className="flex justify-between mt-1">
            <span className="text-[9px] text-muted-foreground">😭 Miserable</span>
            <span className={cn(
              'text-[10px] font-semibold',
              score >= 60 ? 'text-green-600 dark:text-green-400' : score >= 30 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
            )}>
              {label}
            </span>
            <span className="text-[9px] text-muted-foreground">Ecstatic 🤩</span>
          </div>
        </div>

        {/* Toggle button for logic breakdown */}
        {reasons.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="shrink-0 p-1.5 rounded-lg hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground"
            title={expanded ? 'Hide logic' : 'Show scoring logic'}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Expandable logic breakdown */}
      {expanded && reasons.length > 0 && (
        <div className="border-t px-5 py-3 space-y-2 animate-slide-up">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              How is this calculated?
            </p>
            <p className="text-[10px] text-muted-foreground">
              Base: 50 pts {positiveReasons.length > 0 && <span className="text-green-600 dark:text-green-400">+ {positiveReasons.reduce((s, r) => s + r.points, 0)} pts</span>}
              {negativeReasons.length > 0 && <span className="text-red-600 dark:text-red-400"> {negativeReasons.reduce((s, r) => s + r.points, 0)} pts</span>}
              {' '}= {score}
            </p>
          </div>

          <div className="space-y-1.5">
            {reasons.map((reason, i) => (
              <div
                key={i}
                className={cn(
                  'flex items-start gap-2 text-[11px] rounded-lg px-2.5 py-1.5',
                  reason.impact === 'positive' ? 'bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-300' :
                  reason.impact === 'negative' ? 'bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300' :
                  'bg-muted/30 text-muted-foreground'
                )}
              >
                <span className="shrink-0 mt-0.5">
                  {reason.impact === 'positive' ? <TrendingUp className="w-3 h-3" /> :
                   reason.impact === 'negative' ? <TrendingDown className="w-3 h-3" /> :
                   <Minus className="w-3 h-3" />}
                </span>
                <span className="flex-1">{reason.text}</span>
                <span className={cn(
                  'shrink-0 font-mono font-bold text-[10px]',
                  reason.points > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                )}>
                  {reason.points > 0 ? '+' : ''}{reason.points}
                </span>
              </div>
            ))}
          </div>

          {reasons.length === 0 && (
            <p className="text-[11px] text-muted-foreground italic text-center py-2">
              Budget matches defaults — no changes to citizen happiness.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
