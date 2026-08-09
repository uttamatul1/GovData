import { NavLink } from 'react-router-dom';
import { useAppStore } from '../../store/app.store';
import { cn } from '../../lib/utils';
import { Map, BarChart2, SlidersHorizontal, FileText } from 'lucide-react';

const navItems = [
  { id: 'explore', label: 'Explore Map', shortLabel: 'Explore', path: '/', icon: Map },
  { id: 'compare', label: 'Compare States', shortLabel: 'Compare', path: '/compare', icon: BarChart2 },
  { id: 'simulator', label: 'Policy Simulator', shortLabel: 'Simulator', path: '/simulator', icon: SlidersHorizontal },
  { id: 'reports', label: 'Reports & Timeline', shortLabel: 'Reports', path: '/reports', icon: FileText },
];

export function TabNav() {
  const { setActiveTab } = useAppStore();

  return (
    <nav className="border-b bg-muted/40 overflow-hidden">
      <div className="container mx-auto px-1 sm:px-4">
        <ul className="flex items-center justify-around sm:justify-start gap-0.5 sm:gap-1 py-0.5 whitespace-nowrap">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id} className="flex-1 sm:flex-initial text-center">
                <NavLink
                  to={item.path}
                  onClick={() => setActiveTab(item.id)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-center gap-1 sm:gap-2 px-1.5 sm:px-4 py-2 sm:py-3 text-[11px] sm:text-sm font-medium border-b-2 transition-colors',
                      isActive
                        ? 'border-primary text-primary font-semibold'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
                    )
                  }
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span className="hidden sm:inline">{item.label}</span>
                  <span className="sm:hidden">{item.shortLabel}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
