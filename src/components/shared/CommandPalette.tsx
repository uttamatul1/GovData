import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '../ui/command';
import { Map, BarChart2, CalendarClock, SlidersHorizontal, FileText, MapPin, TrendingUp, Search as SearchIcon } from 'lucide-react';
import { statesData, allMetrics, reportsData } from '../../data';
import { useMapStore } from '../../store/map.store';
import { Button } from '../ui/button';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { setActiveSector, setActiveMetricId, setSelectedStateCode } = useMapStore();

  // Listen for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const pages = useMemo(
    () => [
      { label: 'Explore Map', path: '/', icon: Map },
      { label: 'Compare States', path: '/compare', icon: BarChart2 },
      { label: 'Report Timeline', path: '/timeline', icon: CalendarClock },
      { label: 'Policy Simulator', path: '/simulator', icon: SlidersHorizontal },
      { label: 'Reports Library', path: '/reports', icon: FileText },
    ],
    []
  );

  const handleSelectPage = useCallback(
    (path: string) => {
      navigate(path);
      setOpen(false);
    },
    [navigate]
  );

  const handleSelectState = useCallback(
    (code: string) => {
      setSelectedStateCode(code);
      navigate('/');
      setOpen(false);
    },
    [navigate, setSelectedStateCode]
  );

  const handleSelectMetric = useCallback(
    (metricId: string, sector: string) => {
      setActiveSector(sector as any);
      setActiveMetricId(metricId);
      navigate('/');
      setOpen(false);
    },
    [navigate, setActiveSector, setActiveMetricId]
  );

  const handleSelectReport = useCallback(
    (_reportId: string) => {
      navigate('/reports');
      setOpen(false);
    },
    [navigate]
  );

  return (
    <>
      {/* Clickable search button for desktop and mobile */}
      <button
        onClick={() => setOpen(true)}
        className="hidden sm:flex gap-2 text-muted-foreground w-48 sm:w-64 justify-start items-center px-2.5 py-1.5 h-8 sm:h-9 rounded-md border border-input bg-background text-xs sm:text-sm hover:bg-muted transition-colors"
      >
        <SearchIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
        <span className="flex-1 text-left truncate">Search states, metrics...</span>
        <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <Button
        variant="outline"
        size="icon"
        onClick={() => setOpen(true)}
        className="flex sm:hidden w-8 h-8 text-muted-foreground shrink-0"
        title="Search"
      >
        <SearchIcon className="w-4 h-4" />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search states, metrics, reports..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Pages">
            {pages.map((page) => {
              const Icon = page.icon;
              return (
                <CommandItem key={page.path} onSelect={() => handleSelectPage(page.path)}>
                  <Icon className="mr-2 h-4 w-4" />
                  {page.label}
                </CommandItem>
              );
            })}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="States & UTs">
            {statesData.map((state) => (
              <CommandItem key={state.code} onSelect={() => handleSelectState(state.code)}>
                <MapPin className="mr-2 h-4 w-4" />
                <span>{state.name}</span>
                <span className="ml-auto text-xs text-muted-foreground capitalize">{state.region}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Metrics">
            {allMetrics.map((m) => (
              <CommandItem key={m.id} onSelect={() => handleSelectMetric(m.id, m.sector)}>
                <TrendingUp className="mr-2 h-4 w-4" />
                <span>{m.label}</span>
                <span className="ml-auto text-xs text-muted-foreground capitalize">{m.sector}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Reports">
            {reportsData.map((r) => (
              <CommandItem key={r.id} onSelect={() => handleSelectReport(r.id)}>
                <FileText className="mr-2 h-4 w-4" />
                <span>{r.shortName}</span>
                <span className="ml-auto text-xs text-muted-foreground">{r.ministry.slice(0, 30)}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
