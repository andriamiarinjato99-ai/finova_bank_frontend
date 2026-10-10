import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const systemPrefersDark = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;

const resolve = (mode) => (mode === 'system' ? (systemPrefersDark() ? 'dark' : 'light') : mode);

const apply = (resolved) => {
  document.documentElement.classList.toggle('dark', resolved === 'dark');
};

export const useThemeStore = create(
  persist(
    (set, get) => ({
      mode: 'system', // 'light' | 'dark' | 'system'
      resolved: 'light',
      setMode: (mode) => {
        const resolved = resolve(mode);
        apply(resolved);
        set({ mode, resolved });
      },
      /** À appeler au démarrage et quand la préférence système change. */
      sync: () => {
        const resolved = resolve(get().mode);
        apply(resolved);
        set({ resolved });
      },
    }),
    { name: 'finova-theme', partialize: (s) => ({ mode: s.mode }) },
  ),
);
