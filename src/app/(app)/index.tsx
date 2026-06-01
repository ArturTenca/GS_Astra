import { router, type Href } from 'expo-router';
import { RefreshControl, ScrollView, View } from 'react-native';
import { AppScreenLayout } from '@/components/layout/AppScreenLayout';
import { StatCard } from '@/components/ui/Card';
import { ListSkeleton, StatSkeleton } from '@/components/ui/Skeleton';
import {
  EmptyState,
  ListItem,
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
              <StatCard label="Colonies" value={data.coloniesMonitored} accent="text-astra-primary" />
            </View>

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
          </>
        ) : null}
      </ScrollView>
    </AppScreenLayout>
  );
}
