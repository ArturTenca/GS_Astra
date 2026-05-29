import { router, type Href } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { AppScreenLayout } from '@/components/layout/AppScreenLayout';
import { StatCard } from '@/components/ui/Card';
import {
  EmptyState,
  ListItem,
  LoadingState,
  ScreenHeader,
} from '@/components/ui/ScreenPrimitives';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import { getUserFacingMessage } from '@/lib/errors';
import {
  formatRelativeDate,
  incidentStatusVariant,
} from '@/lib/formatters/status';

export default function DashboardScreen() {
  const { data, isLoading, isError, error, refetch, isRefetching } = useDashboard();

  return (
    <AppScreenLayout>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ScreenHeader
          title="Mission Control"
          subtitle="Real-time overview of active operations"
        />

        {isLoading ? <LoadingState message="Syncing mission data..." /> : null}

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
              <StatCard label="Colonies" value={data.coloniesMonitored} accent="text-astra-primary" />
            </View>

            <Text className="mb-3 text-sm font-semibold uppercase tracking-wider text-astra-muted">
              Recent Incidents
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
                    onPress={() => router.push(`/(app)/incidents/${incident.id}` as Href)}
                  />
                ))}
              </View>
            )}

            {isRefetching ? (
              <Text className="mt-4 text-center text-xs text-astra-muted">Refreshing...</Text>
            ) : (
              <Text
                className="mt-4 text-center text-xs text-astra-primary"
                onPress={() => refetch()}
              >
                Tap to refresh
              </Text>
            )}
          </>
        ) : null}
      </ScrollView>
    </AppScreenLayout>
  );
}
