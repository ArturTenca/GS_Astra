import { Text, View } from 'react-native';
import { GlassCard } from '@/components/ui/GlassCard';
import { useTheme } from '@/hooks/useTheme';

type SystemHealthBarProps = {
  operational: number;
  degraded: number;
  critical: number;
  offline: number;
};

export function SystemHealthBar({
  operational,
  degraded,
  critical,
  offline,
}: SystemHealthBarProps) {
  const { palette } = useTheme();
  const total = operational + degraded + critical + offline || 1;

  const segments = [
    { label: 'Operational', count: operational, color: palette.success },
    { label: 'Degraded', count: degraded, color: palette.warning },
    { label: 'Critical', count: critical, color: palette.danger },
    { label: 'Offline', count: offline, color: palette.muted },
  ].filter((s) => s.count > 0);

  return (
    <GlassCard>
      <Text className="text-sm font-semibold text-astra-text">Colony health</Text>
      <View className="mt-3 h-2 flex-row overflow-hidden rounded-full bg-astra-panel">
        {segments.map((seg) => (
          <View
            key={seg.label}
            style={{
              flex: seg.count,
              backgroundColor: seg.color,
            }}
          />
        ))}
      </View>
      <View className="mt-3 flex-row flex-wrap gap-x-4 gap-y-1">
        {segments.map((seg) => (
          <Text key={seg.label} className="text-xs text-astra-muted">
            <Text style={{ color: seg.color }}>●</Text> {seg.label} {seg.count}
          </Text>
        ))}
      </View>
      <Text className="mt-2 text-xs text-astra-muted">
        {Math.round((operational / total) * 100)}% colonies operational
      </Text>
    </GlassCard>
  );
}
