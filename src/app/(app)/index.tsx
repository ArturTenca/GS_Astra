import { useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { AppScreenLayout } from '@/components/layout/AppScreenLayout';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ListSkeleton, StatSkeleton } from '@/components/ui/Skeleton';
import {
  EmptyState,
  ListItem,
  ScreenHeader,
} from '@/components/ui/ScreenPrimitives';
import { useUnacknowledgedAlertCount } from '@/features/alerts/hooks/useAlerts';
import { useColonies, useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { DashboardOverview } from '@/features/dashboard/components/DashboardOverview';
import { IncidentQuickViewModal } from '@/features/incidents/components/IncidentQuickViewModal';
import { useColonyTelemetry } from '@/features/telemetry/hooks/useTelemetry';
import { useTheme } from '@/hooks/useTheme';
import { getUserFacingMessage } from '@/lib/errors';
import {
  formatRelativeDate,
  incidentStatusVariant,
} from '@/lib/formatters/status';

export default function DashboardScreen() {
  const { palette } = useTheme();
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
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => refetch()}
            tintColor={palette.primary}
          />
        }
      >
        <ScreenHeader
          title="Mission Control"
          subtitle="Operational overview"
          trailing={<ThemeToggle compact />}
        />

        {isLoading ? (
          <>
            <StatSkeleton />
            <View className="mt-4">
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
            <DashboardOverview
              summary={data}
              alertCount={alertCount ?? 0}
              telemetrySeries={telemetryQuery.data}
              colonyName={primaryColony?.name}
            />

            {data.recentIncidents.length === 0 ? (
              <EmptyState
                title="No incidents reported"
                message="Use Report incident to log your first event."
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
