import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeStore {
  mode: 'light' | 'dark';
  toggle: () => void;
}

const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      mode: 'light',
      toggle: () =>
        set((state) => ({ mode: state.mode === 'dark' ? 'light' : 'dark' }))
    }),
    {
      name: 'theme'
    }
  )
);

export default useThemeStore;
