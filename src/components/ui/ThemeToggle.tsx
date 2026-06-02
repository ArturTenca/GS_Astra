import { Pressable, Text, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

type ThemeToggleProps = {
  compact?: boolean;
};

export function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { mode, palette, setMode } = useTheme();

  if (compact) {
    return (
      <Pressable
        onPress={() => void setMode(mode === 'dark' ? 'light' : 'dark')}
        className="flex-row rounded-full border border-astra-border bg-astra-panel p-1"
        accessibilityRole="switch"
        accessibilityLabel={`Theme: ${mode}`}
      >
        <View
          className={`rounded-full px-3 py-1.5 ${mode === 'light' ? 'bg-astra-primary' : ''}`}
        >
          <Text
            className={`text-xs font-semibold ${mode === 'light' ? 'text-white' : 'text-astra-muted'}`}
          >
            Light
          </Text>
        </View>
        <View
          className={`rounded-full px-3 py-1.5 ${mode === 'dark' ? 'bg-astra-primary' : ''}`}
        >
          <Text
            className={`text-xs font-semibold ${mode === 'dark' ? 'text-white' : 'text-astra-muted'}`}
          >
            Dark
          </Text>
        </View>
      </Pressable>
    );
  }

  return (
    <View className="rounded-2xl border border-astra-border bg-astra-surface p-4">
      <Text className="text-base font-semibold text-astra-text">Appearance</Text>
      <Text className="mt-1 text-sm text-astra-muted">
        Choose a comfortable theme for mission control.
      </Text>
      <View className="mt-4">
        <ThemeToggle compact />
      </View>
      <Text className="mt-3 text-xs text-astra-muted" style={{ color: palette.muted }}>
        Current: {mode === 'dark' ? 'Dark (Nebula)' : 'Light (Loop)'} · saved on this device
      </Text>
    </View>
  );
}
