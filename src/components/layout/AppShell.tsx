import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppStore } from '../../store/app.store';
import { Header } from './Header';
import { TabNav } from './TabNav';

export function AppShell() {
  const { theme } = useAppStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 data-mesh-bg">
      <Header />
      <TabNav />
      <main className="flex-1 relative overflow-hidden flex flex-col z-10">
        <Outlet />
      </main>
    </div>
  );
}
