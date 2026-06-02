import { Text, View } from 'react-native';
import { GlassCard } from '@/components/ui/GlassCard';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { useTheme } from '@/hooks/useTheme';
import type { TelemetrySeries } from '@/types/telemetry.types';

type TelemetryChartProps = {
  series: TelemetrySeries[];
  colonyName?: string;
};

function Sparkline({ series }: { series: TelemetrySeries }) {
  const { palette } = useTheme();
  const values = series.readings.map((r) => r.value);
  if (values.length === 0) {
    return null;
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const latest = values[values.length - 1] ?? values[0] ?? 0;

  return (
    <View className="mb-3">
      <View className="mb-2 flex-row items-end justify-between">
        <Text className="text-sm font-medium text-astra-text">{series.label}</Text>
        <Text className="text-sm font-semibold" style={{ color: palette.chartCyan }}>
          {latest.toFixed(1)} {series.unit}
        </Text>
      </View>
      <View className="h-14 flex-row items-end gap-1 rounded-xl bg-astra-panel p-2">
        {values.map((value, index) => {
          const heightPct = ((value - min) / range) * 100;
          const usePurple = index % 3 === 1;
          return (
            <View
              key={`${series.metricKey}-${index}`}
              className="flex-1 rounded-sm"
              style={{
                height: `${Math.max(14, heightPct)}%`,
                backgroundColor: usePurple ? palette.chartPurple : palette.chartCyan,
                opacity: 0.85,
              }}
            />
          );
        })}
      </View>
      <Text className="mt-1.5 text-[10px] text-astra-muted">
        {values.length} pts · {min.toFixed(1)}–{max.toFixed(1)} {series.unit}
      </Text>
    </View>
  );
}

export function TelemetryChart({ series, colonyName }: TelemetryChartProps) {
  if (series.length === 0) {
    return (
      <GlassCard>
        <Text className="text-sm text-astra-muted">
          No telemetry readings yet. Pull to refresh.
        </Text>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <SectionTitle
        title="Live telemetry"
        subtitle={colonyName ?? 'Primary colony'}
      />
      {series.map((item) => (
        <Sparkline key={item.metricKey} series={item} />
      ))}
    </GlassCard>
  );
}
