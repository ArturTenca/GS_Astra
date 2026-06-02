import { Text, View } from 'react-native';
import { GlassCard } from '@/components/ui/GlassCard';
import { useTheme } from '@/hooks/useTheme';

export type SeveritySlice = {
  key: string;
  label: string;
  count: number;
  color: string;
};

type SeverityDonutProps = {
  slices: SeveritySlice[];
  title?: string;
};

export function SeverityDonut({ slices, title = 'Incident load' }: SeverityDonutProps) {
  const { palette } = useTheme();
  const total = slices.reduce((sum, s) => sum + s.count, 0);

  if (total === 0) {
    return (
      <GlassCard>
        <Text className="text-sm font-semibold text-astra-text">{title}</Text>
        <Text className="mt-2 text-sm text-astra-muted">No incidents to chart yet.</Text>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <Text className="text-sm font-semibold text-astra-text">{title}</Text>
      <View className="mt-4 flex-row items-center gap-4">
        <View
          className="h-24 w-24 items-center justify-center rounded-full border-4"
          style={{ borderColor: palette.border }}
        >
          <Text className="text-xl font-bold text-astra-text">{total}</Text>
          <Text className="text-[10px] text-astra-muted">total</Text>
        </View>
        <View className="flex-1 gap-2">
          {slices.map((slice) => {
            const pct = Math.round((slice.count / total) * 100);
            return (
              <View key={slice.key}>
                <View className="mb-1 flex-row justify-between">
                  <Text className="text-xs text-astra-muted">{slice.label}</Text>
                  <Text className="text-xs font-medium text-astra-text">
                    {slice.count} · {pct}%
                  </Text>
                </View>
                <View className="h-1.5 overflow-hidden rounded-full bg-astra-panel">
                  <View
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, backgroundColor: slice.color }}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </GlassCard>
  );
}
