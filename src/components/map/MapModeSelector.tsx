import { useMapStore } from '../../store/map.store';
import type { MapMode } from '../../store/map.store';

const MODES: { id: MapMode; label: string; emoji: string; description: string }[] = [
  {
    id: 'night',
    label: 'Night',
    emoji: '🌙',
    description: 'Dark ocean background with vivid neon fills',
  },
  {
    id: 'rank',
    label: 'Rank',
    emoji: '🏆',
    description: 'States labelled by national rank (1 = best)',
  },
];

export function MapModeSelector() {
  const { mapMode, setMapMode } = useMapStore();

  return (
    <div
      className="
        flex items-center gap-1 p-1 rounded-xl
        bg-background/85 backdrop-blur border shadow-lg
        max-w-full overflow-x-auto scrollbar-thin
      "
      role="toolbar"
      aria-label="Map mode selector"
    >
      {MODES.map((mode) => {
        const isActive = mapMode === mode.id;
        return (
          <button
            key={mode.id}
            onClick={() => setMapMode(mode.id)}
            title={mode.description}
            aria-label={`${mode.label} mode — ${mode.description}`}
            aria-pressed={isActive}
            className={`
              relative flex items-center sm:flex-col justify-center gap-1 sm:gap-0.5
              rounded-lg px-2.5 py-1.5 sm:py-1 text-xs font-medium
              transition-all duration-200 select-none shrink-0 min-h-[32px] sm:min-h-0
              ${isActive
                ? 'bg-primary text-primary-foreground shadow-md scale-105'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }
            `}
          >
            <span className="text-sm leading-none">{mode.emoji}</span>
            <span className="text-[11px] sm:text-[10px] leading-tight font-semibold">{mode.label}</span>

            {/* Active indicator dot */}
            {isActive && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-400 ring-1 ring-background" />
            )}
          </button>
        );
      })}
    </div>
  );
}
