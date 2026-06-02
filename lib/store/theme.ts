import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDark: boolean;
  setDark: (value: boolean) => void;
  toggleDark: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: false,
      setDark: (value) => set({ isDark: value }),
      toggleDark: () => set((state) => ({ isDark: !state.isDark })),
    }),
    { name: 'fluentian-admin-theme' }
  )
);
