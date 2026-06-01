import { router, type Href } from 'expo-router';
import { FlatList, RefreshControl } from 'react-native';
import { AppScreenLayout } from '@/components/layout/AppScreenLayout';
import { ListSkeleton } from '@/components/ui/Skeleton';
import {
  EmptyState,
  ListItem,
  ScreenHeader,
} from '@/components/ui/ScreenPrimitives';
import { useMissions } from '@/features/dashboard/hooks/useDashboard';
import { getUserFacingMessage } from '@/lib/errors';
import { missionStatusVariant } from '@/lib/formatters/status';

export default function MissionsListScreen() {
  const { data, isLoading, isError, error, refetch, isRefetching } = useMissions();

  return (
    <AppScreenLayout>
      <ScreenHeader title="Missions" subtitle="Operations you are assigned to" />

      {isLoading ? <ListSkeleton count={4} /> : null}
      {isError ? (
        <EmptyState title="Failed to load missions" message={getUserFacingMessage(error)} />
      ) : null}

      {data && data.length === 0 ? (
        <EmptyState
          title="No missions assigned"
          message="Apply migrations and run supabase/seed.sql to add demo missions."
        />
      ) : null}

      {data && data.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerClassName="gap-3 pb-8"
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} tintColor="#3b82f6" />
          }
          renderItem={({ item }) => (
            <ListItem
              title={item.name}
              subtitle={item.code}
              meta={item.description ?? undefined}
              badge={item.status}
              badgeVariant={missionStatusVariant(item.status)}
              onPress={() => router.push(`/(app)/missions/${item.id}` as Href)}
            />
          )}
        />
      ) : null}
    </AppScreenLayout>
  );
}
