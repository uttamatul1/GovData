import { Link } from 'react-router-dom';
import { useAppStore } from '../../store/app.store';
import { Moon, Sun, BarChart3 } from 'lucide-react';
import { Button } from '../ui/button';
import { CommandPalette } from '../shared/CommandPalette';

export function Header() {
  const { theme, setTheme } = useAppStore();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 text-primary font-bold text-lg sm:text-xl">
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
            <span className="truncate">GovData India</span>
          </Link>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <CommandPalette />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            title="Toggle theme"
            className="w-8 h-8 sm:w-9 sm:h-9"
          >
            {theme === 'light' ? <Moon className="w-4 h-4 sm:w-5 sm:h-5" /> : <Sun className="w-4 h-4 sm:w-5 sm:h-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
