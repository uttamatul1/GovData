import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedStates: string[]; // State codes for comparison
  toggleStateSelection: (stateCode: string) => void;
  clearStateSelection: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      activeTab: 'explore',
      setActiveTab: (tab) => set({ activeTab: tab }),
      selectedStates: [],
      toggleStateSelection: (stateCode) =>
        set((state) => {
          const selected = state.selectedStates;
          if (selected.includes(stateCode)) {
            return { selectedStates: selected.filter((code) => code !== stateCode) };
          }
          if (selected.length >= 4) {
            return { selectedStates: selected }; // Cap at 4
          }
          return { selectedStates: [...selected, stateCode] };
        }),
      clearStateSelection: () => set({ selectedStates: [] }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({ theme: state.theme }), // Only persist theme
    }
  )
);
