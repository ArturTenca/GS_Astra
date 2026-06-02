import { create } from 'zustand';
import { getPreference, setPreference } from '@/lib/preference-storage';
import type { ThemeMode } from '@/theme/palettes';
import { getPalette, type ThemePalette } from '@/theme/palettes';

const THEME_KEY = 'astra_theme_mode';

type ThemeState = {
  mode: ThemeMode;
  isHydrated: boolean;
  palette: ThemePalette;
  setMode: (mode: ThemeMode) => Promise<void>;
  toggleMode: () => Promise<void>;
  hydrate: () => Promise<void>;
};

async function persistMode(mode: ThemeMode): Promise<void> {
  await setPreference(THEME_KEY, mode);
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: 'dark',
  isHydrated: false,
  palette: getPalette('dark'),
  setMode: async (mode) => {
    await persistMode(mode);
    set({ mode, palette: getPalette(mode) });
  },
  toggleMode: async () => {
    const next = get().mode === 'dark' ? 'light' : 'dark';
    await get().setMode(next);
  },
  hydrate: async () => {
    try {
      const stored = await getPreference(THEME_KEY);
      const mode: ThemeMode = stored === 'light' || stored === 'dark' ? stored : 'dark';
      set({ mode, palette: getPalette(mode), isHydrated: true });
    } catch {
      set({ isHydrated: true });
    }
  },
}));
