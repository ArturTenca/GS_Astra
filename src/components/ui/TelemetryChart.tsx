import { Text, View } from 'react-native';
import type { TelemetrySeries } from '@/types/telemetry.types';

type TelemetryChartProps = {
  series: TelemetrySeries[];
  colonyName?: string;
};

function Sparkline({ series }: { series: TelemetrySeries }) {
  const values = series.readings.map((r) => r.value);
  if (values.length === 0) {
    return null;
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const latest = values[values.length - 1] ?? values[0] ?? 0;

  return (
    <View className="mb-4 rounded-xl border border-astra-border bg-astra-surface/80 p-4">
      <View className="mb-2 flex-row items-end justify-between">
        <Text className="text-sm font-semibold text-astra-text">{series.label}</Text>
        <Text className="text-sm text-astra-primary">
          {latest.toFixed(1)} {series.unit}
        </Text>
      </View>
      <View className="h-16 flex-row items-end gap-1">
        {values.map((value, index) => {
          const heightPct = ((value - min) / range) * 100;
          return (
            <View
              key={`${series.metricKey}-${index}`}
              className="flex-1 rounded-sm bg-astra-primary/70"
              style={{ height: `${Math.max(12, heightPct)}%` }}
            />
          );
        })}
      </View>
      <Text className="mt-2 text-xs text-astra-muted">
        Last {values.length} readings · min {min.toFixed(1)} · max {max.toFixed(1)} {series.unit}
      </Text>
    </View>
  );
}

export function TelemetryChart({ series, colonyName }: TelemetryChartProps) {
  if (series.length === 0) {
    return (
      <View className="rounded-xl border border-dashed border-astra-border px-4 py-6">
        <Text className="text-center text-sm text-astra-muted">
          No telemetry data yet. Run seed after migration 20260603100000.
        </Text>
      </View>
    );
  }

  return (
    <View>
      {colonyName ? (
        <Text className="mb-3 text-sm font-semibold uppercase tracking-wider text-astra-muted">
          {colonyName} telemetry
        </Text>
      ) : null}
      {series.map((item) => (
        <Sparkline key={item.metricKey} series={item} />
      ))}
    </View>
  );
}
