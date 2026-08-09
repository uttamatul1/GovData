import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Lightbulb, Sparkles } from 'lucide-react';
import { didYouKnowFacts } from '../../data/didYouKnow.data';
import type { Sector } from '../../types';
import { cn } from '../../lib/utils';

const SECTOR_LABELS: { key: Sector | 'all'; label: string; emoji: string }[] = [
  { key: 'all', label: 'All', emoji: '🌟' },
  { key: 'population', label: 'Population', emoji: '👥' },
  { key: 'health', label: 'Health', emoji: '🏥' },
  { key: 'education', label: 'Education', emoji: '📚' },
  { key: 'economy', label: 'Economy', emoji: '💰' },
  { key: 'labour', label: 'Labour', emoji: '👷' },
  { key: 'agriculture', label: 'Agriculture', emoji: '🌾' },
  { key: 'social', label: 'Social', emoji: '🤝' },
  { key: 'safety', label: 'Safety', emoji: '⚖️' },
];

const AUTO_ROTATE_MS = 6000;

export function DidYouKnow() {
  const [sectorFilter, setSectorFilter] = useState<Sector | 'all'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  const filteredFacts = sectorFilter === 'all'
    ? didYouKnowFacts
    : didYouKnowFacts.filter((f) => f.sector === sectorFilter);

  const total = filteredFacts.length;

  // Reset index when filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [sectorFilter]);

  const goTo = useCallback(
    (idx: number, dir: 'left' | 'right') => {
      if (isAnimating) return;
      setDirection(dir);
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(((idx % total) + total) % total);
        setIsAnimating(false);
      }, 300);
    },
    [isAnimating, total]
  );

  const goNext = useCallback(() => goTo(currentIndex + 1, 'right'), [currentIndex, goTo]);
  const goPrev = useCallback(() => goTo(currentIndex - 1, 'left'), [currentIndex, goTo]);

  // Auto-rotate
  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(goNext, AUTO_ROTATE_MS);
    return () => clearInterval(timer);
  }, [goNext, total]);

  if (total === 0) return null;

  const fact = filteredFacts[currentIndex];

  return (
    <div className="mt-6 mb-2">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20 px-3 py-1.5 rounded-full border border-amber-500/20">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">Did You Know?</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
        </div>
        <span className="text-[11px] text-muted-foreground">
          {currentIndex + 1} of {total} facts
        </span>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {SECTOR_LABELS.map((s) => (
          <button
            key={s.key}
            onClick={() => setSectorFilter(s.key)}
            className={cn(
              'px-2.5 py-1 rounded-full text-[11px] font-medium transition-all duration-200 border',
              sectorFilter === s.key
                ? 'bg-primary text-primary-foreground border-primary shadow-sm scale-105'
                : 'bg-muted/50 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground'
            )}
          >
            {s.emoji} {s.label}
          </button>
        ))}
      </div>

      {/* Fact Card */}
      <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-card via-card to-amber-500/5 dark:to-amber-500/10 shadow-sm">
        <div
          className={cn(
            'p-5 transition-all duration-300 ease-in-out',
            isAnimating && direction === 'right' && 'translate-x-full opacity-0',
            isAnimating && direction === 'left' && '-translate-x-full opacity-0',
            !isAnimating && 'translate-x-0 opacity-100'
          )}
        >
          <div className="flex gap-4">
            {/* Emoji & highlight */}
            <div className="shrink-0 flex flex-col items-center gap-1.5">
              <span className="text-3xl">{fact.emoji}</span>
              <div className="bg-primary/10 dark:bg-primary/20 px-2 py-1 rounded-lg">
                <span className="text-sm font-bold text-primary whitespace-nowrap">
                  {fact.highlight}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm leading-relaxed text-foreground mb-2">{fact.fact}</p>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                <span className="bg-muted px-1.5 py-0.5 rounded">{fact.source}</span>
                <span>📅 {fact.year}</span>
                <span className="capitalize bg-muted/50 px-1.5 py-0.5 rounded">{fact.sector}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nav buttons */}
        <button
          onClick={goPrev}
          className="absolute left-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur border shadow-sm flex items-center justify-center hover:bg-background transition-colors"
          aria-label="Previous fact"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={goNext}
          className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 backdrop-blur border shadow-sm flex items-center justify-center hover:bg-background transition-colors"
          aria-label="Next fact"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Progress dots */}
        <div className="flex justify-center gap-1 pb-3">
          {filteredFacts.slice(0, Math.min(total, 20)).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > currentIndex ? 'right' : 'left')}
              className={cn(
                'rounded-full transition-all duration-300',
                i === currentIndex
                  ? 'w-4 h-1.5 bg-primary'
                  : 'w-1.5 h-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              )}
              aria-label={`Go to fact ${i + 1}`}
            />
          ))}
          {total > 20 && (
            <span className="text-[9px] text-muted-foreground ml-1">+{total - 20} more</span>
          )}
        </div>
      </div>
    </div>
  );
}
