import { router, type Href } from 'expo-router';
import { FlatList } from 'react-native';
import { AppScreenLayout } from '@/components/layout/AppScreenLayout';
import {
  EmptyState,
  ListItem,
  LoadingState,
  ScreenHeader,
} from '@/components/ui/ScreenPrimitives';
import { useMissions } from '@/features/dashboard/hooks/useDashboard';
import { getUserFacingMessage } from '@/lib/errors';
import { missionStatusVariant } from '@/lib/formatters/status';

export default function MissionsListScreen() {
  const { data, isLoading, isError, error } = useMissions();

  return (
    <AppScreenLayout>
      <ScreenHeader title="Missions" subtitle="Operations you are assigned to" />

      {isLoading ? <LoadingState /> : null}
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
