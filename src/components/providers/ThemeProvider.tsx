import { useEffect } from 'react';
import { Platform, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useThemeStore } from '@/stores/theme.store';

type ThemeProviderProps = {
  children: React.ReactNode;
};

function applyWebTheme(isDark: boolean) {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const hydrate = useThemeStore((s) => s.hydrate);
  const isHydrated = useThemeStore((s) => s.isHydrated);
  const isDark = useThemeStore((s) => s.mode === 'dark');

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (isHydrated) {
      applyWebTheme(isDark);
    }
  }, [isDark, isHydrated]);

  return (
    <View className={`flex-1 ${isDark ? 'dark' : ''}`} style={{ flex: 1 }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {children}
    </View>
  );
}
