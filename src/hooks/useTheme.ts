import { useThemeStore } from '@/stores/theme.store';

export function useTheme() {
  const mode = useThemeStore((s) => s.mode);
  const palette = useThemeStore((s) => s.palette);
  const isDark = mode === 'dark';
  const toggleMode = useThemeStore((s) => s.toggleMode);
  const setMode = useThemeStore((s) => s.setMode);

  return { mode, palette, isDark, toggleMode, setMode };
}
