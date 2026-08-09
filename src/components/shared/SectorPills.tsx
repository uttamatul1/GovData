import type { Sector } from '../../types';
import { cn } from '../../lib/utils';
import { useMapStore } from '../../store/map.store';
import { HeartPulse, Users, GraduationCap, TrendingUp, Briefcase, Wheat, Shield, ShieldCheck } from 'lucide-react';

const sectors: { id: Sector; label: string; icon: any }[] = [
  { id: 'population', label: 'Population', icon: Users },
  { id: 'health', label: 'Health', icon: HeartPulse },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'economy', label: 'Economy', icon: TrendingUp },
  { id: 'labour', label: 'Labour', icon: Briefcase },
  { id: 'agriculture', label: 'Agriculture', icon: Wheat },
  { id: 'social', label: 'Social', icon: Shield },
  { id: 'safety', label: 'Safety & Justice', icon: ShieldCheck },
];

export function SectorPills() {
  const { activeSector, setActiveSector } = useMapStore();
  const currentSectorObj = sectors.find((s) => s.id === activeSector) || sectors[0];
  const ActiveIcon = currentSectorObj.icon;

  return (
    <>
      {/* Mobile view dropdown */}
      <div className="sm:hidden my-2 px-1">
        <label className="text-[11px] font-semibold text-muted-foreground mb-1 block uppercase tracking-wider">
          Select Sector
        </label>
        <div className="relative flex items-center">
          <ActiveIcon className="w-4 h-4 text-primary absolute left-3 pointer-events-none" />
          <select
            value={activeSector}
            onChange={(e) => setActiveSector(e.target.value as Sector)}
            className="w-full appearance-none bg-background border border-input rounded-lg pl-9 pr-8 py-2 text-xs font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {sectors.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 pointer-events-none text-muted-foreground text-xs">
            ▼
          </div>
        </div>
      </div>

      {/* Tablet & Desktop view horizontal pills */}
      <div className="hidden sm:flex items-center gap-2 overflow-x-auto no-scrollbar py-2 my-2 justify-center whitespace-nowrap px-1">
        {sectors.map((s) => {
          const Icon = s.icon;
          const isActive = activeSector === s.id;

          return (
            <button
              key={s.id}
              onClick={() => setActiveSector(s.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border transition-all text-xs sm:text-sm font-medium shadow-sm hover:shadow-md shrink-0',
                isActive
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-foreground hover:bg-muted'
              )}
            >
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {s.label}
            </button>
          );
        })}
      </div>
    </>
  );
}
