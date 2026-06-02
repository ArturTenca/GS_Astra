import { router, type Href } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { MetricCard } from '@/components/ui/MetricCard';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { SeverityDonut, type SeveritySlice } from '@/components/ui/SeverityDonut';
import { SystemHealthBar } from '@/components/ui/SystemHealthBar';
import { TelemetryChart } from '@/components/ui/TelemetryChart';
import { useDashboardInsights } from '@/features/dashboard/hooks/useDashboardInsights';
import { useTheme } from '@/hooks/useTheme';
import type { DashboardSummary } from '@/types/domain';
import type { TelemetrySeries } from '@/types/telemetry.types';

type DashboardOverviewProps = {
  summary: DashboardSummary;
  alertCount: number;
  telemetrySeries: TelemetrySeries[] | undefined;
  colonyName?: string;
};

export function DashboardOverview({
  summary,
  alertCount,
  telemetrySeries,
  colonyName,
}: DashboardOverviewProps) {
  const { palette } = useTheme();
  const insightsQuery = useDashboardInsights();

  const severitySlices: SeveritySlice[] = insightsQuery.data
    ? [
        {
          key: 'low',
          label: 'Low',
          count: insightsQuery.data.severityCounts.low,
          color: palette.chartCyan,
        },
        {
          key: 'medium',
          label: 'Medium',
          count: insightsQuery.data.severityCounts.medium,
          color: palette.primary,
        },
        {
          key: 'high',
          label: 'High',
          count: insightsQuery.data.severityCounts.high,
          color: palette.warning,
        },
        {
          key: 'critical',
          label: 'Critical',
          count: insightsQuery.data.severityCounts.critical,
          color: palette.danger,
        },
      ].filter((s) => s.count > 0)
    : [];

  const colony = insightsQuery.data?.colonyStatusCounts;

  return (
    <View className="gap-4">
      <View className="flex-row flex-wrap gap-3">
        <MetricCard
          label="Active missions"
          value={summary.activeMissions}
          accentColor={palette.chartCyan}
        />
        <MetricCard
          label="Open incidents"
          value={summary.openIncidents}
          accentColor={palette.warning}
        />
        <MetricCard
          label="Pending alerts"
          value={alertCount}
          accentColor={palette.danger}
          hint={alertCount > 0 ? 'Requires review' : 'All clear'}
        />
        <MetricCard
          label="Colonies"
          value={summary.coloniesMonitored}
          accentColor={palette.chartPurple}
        />
      </View>

      <View className="flex-row gap-2">
        <Pressable
          className="flex-1 rounded-xl border border-astra-border bg-astra-panel px-3 py-2.5 active:opacity-80"
          onPress={() => router.push('/(app)/alerts' as Href)}
        >
          <Text className="text-center text-xs font-semibold text-astra-text">View alerts</Text>
        </Pressable>
        <Pressable
          className="flex-1 rounded-xl border border-astra-border bg-astra-panel px-3 py-2.5 active:opacity-80"
          onPress={() => router.push('/(app)/incidents/create' as Href)}
        >
          <Text className="text-center text-xs font-semibold text-astra-text">Report incident</Text>
        </Pressable>
      </View>

      {colony ? (
        <SystemHealthBar
          operational={colony.operational}
          degraded={colony.degraded}
          critical={colony.critical}
          offline={colony.offline}
        />
      ) : null}

      {severitySlices.length > 0 ? <SeverityDonut slices={severitySlices} /> : null}

      {telemetrySeries ? (
        <TelemetryChart series={telemetrySeries} colonyName={colonyName} />
      ) : null}

      <SectionTitle title="Recent incidents" subtitle="Tap an item for details" />
    </View>
  );
}
