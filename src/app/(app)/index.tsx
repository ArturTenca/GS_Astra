import { useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { AppScreenLayout } from '@/components/layout/AppScreenLayout';
import { StatCard } from '@/components/ui/Card';
import { ListSkeleton, StatSkeleton } from '@/components/ui/Skeleton';
import { TelemetryChart } from '@/components/ui/TelemetryChart';
import {
  EmptyState,
  ListItem,
  ScreenHeader,
} from '@/components/ui/ScreenPrimitives';
import { useUnacknowledgedAlertCount } from '@/features/alerts/hooks/useAlerts';
import { useColonies, useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { IncidentQuickViewModal } from '@/features/incidents/components/IncidentQuickViewModal';
import { useColonyTelemetry } from '@/features/telemetry/hooks/useTelemetry';
import { getUserFacingMessage } from '@/lib/errors';
import {
  formatRelativeDate,
  incidentStatusVariant,
} from '@/lib/formatters/status';

export default function DashboardScreen() {
  const { data, isLoading, isError, error, refetch, isRefetching } = useDashboard();
  const { data: alertCount } = useUnacknowledgedAlertCount();
  const coloniesQuery = useColonies();
  const primaryColony = coloniesQuery.data?.[0] ?? null;
  const telemetryQuery = useColonyTelemetry(primaryColony?.id ?? null);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);

  return (
    <AppScreenLayout>
      <IncidentQuickViewModal
        incidentId={selectedIncidentId}
        visible={selectedIncidentId != null}
        onClose={() => setSelectedIncidentId(null)}
        onDeleted={() => setSelectedIncidentId(null)}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} tintColor="#3b82f6" />
        }
      >
        <ScreenHeader
          title="Mission Control"
          subtitle="Real-time overview of active operations"
        />

        {isLoading ? (
          <>
            <StatSkeleton />
            <View className="mt-6">
              <ListSkeleton count={3} />
            </View>
          </>
        ) : null}

        {isError ? (
          <EmptyState
            title="Unable to load dashboard"
            message={getUserFacingMessage(error)}
          />
        ) : null}

        {data ? (
          <>
            <View className="mb-6 flex-row flex-wrap gap-3">
              <StatCard label="Active Missions" value={data.activeMissions} />
              <StatCard label="Open Incidents" value={data.openIncidents} accent="text-astra-warning" />
              <StatCard
                label="Pending Alerts"
                value={alertCount ?? 0}
                accent="text-astra-danger"
              />
              <StatCard label="Colonies" value={data.coloniesMonitored} accent="text-astra-primary" />
            </View>

            <View className="mb-6">
              {telemetryQuery.isLoading ? <ListSkeleton count={2} /> : null}
              {telemetryQuery.data ? (
                <TelemetryChart
                  series={telemetryQuery.data}
                  colonyName={primaryColony?.name}
                />
              ) : null}
            </View>

            <Text className="mb-3 text-sm font-semibold uppercase tracking-wider text-astra-muted">
              Recent incidents
            </Text>

            {data.recentIncidents.length === 0 ? (
              <EmptyState
                title="No incidents reported"
                message="Run supabase/seed.sql after migrations to load demo data."
              />
            ) : (
              <View className="gap-3">
                {data.recentIncidents.map((incident) => (
                  <ListItem
                    key={incident.id}
                    title={incident.title}
                    subtitle={incident.description.slice(0, 80)}
                    meta={formatRelativeDate(incident.createdAt)}
                    badge={incident.status}
                    badgeVariant={incidentStatusVariant(incident.status)}
                    onPress={() => setSelectedIncidentId(incident.id)}
                  />
                ))}
              </View>
            )}
          </>
        ) : null}
      </ScrollView>
    </AppScreenLayout>
  );
}
