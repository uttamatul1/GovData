import { Link } from 'react-router-dom';
import { useAppStore } from '../../store/app.store';
import { Moon, Sun, Brain } from 'lucide-react';
import { Button } from '../ui/button';
import { CommandPalette } from '../shared/CommandPalette';

export function Header() {
  const { theme, setTheme } = useAppStore();

  return (
    <header className="border-b bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 gradient-border-bottom">
      <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <Brain className="w-6 h-6 sm:w-7 sm:h-7 text-primary transition-transform group-hover:scale-110 shrink-0" />
              <div className="absolute -inset-1 bg-primary/10 rounded-full blur-sm group-hover:bg-primary/20 transition-colors" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg sm:text-xl font-data tracking-tight gradient-text">
                GovData India
              </span>
              <span className="text-[8px] sm:text-[9px] text-muted-foreground tracking-widest uppercase -mt-0.5 hidden sm:block">
                AI • Data • Intelligence
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <CommandPalette />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            title="Toggle theme"
            className="w-8 h-8 sm:w-9 sm:h-9 glow-hover rounded-xl"
          >
            {theme === 'light' ? <Moon className="w-4 h-4 sm:w-5 sm:h-5" /> : <Sun className="w-4 h-4 sm:w-5 sm:h-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
