import { router, type Href } from 'expo-router';
import { FlatList } from 'react-native';
import { AppScreenLayout } from '@/components/layout/AppScreenLayout';
import {
  EmptyState,
  ListItem,
  LoadingState,
  ScreenHeader,
} from '@/components/ui/ScreenPrimitives';
import { useColonies } from '@/features/dashboard/hooks/useDashboard';
import { getUserFacingMessage } from '@/lib/errors';
import { colonyStatusVariant } from '@/lib/formatters/status';

export default function ColoniesListScreen() {
  const { data, isLoading, isError, error } = useColonies();

  return (
    <AppScreenLayout>
      <ScreenHeader title="Colonies" subtitle="Habitats and surface installations" />

      {isLoading ? <LoadingState /> : null}
      {isError ? (
        <EmptyState title="Failed to load colonies" message={getUserFacingMessage(error)} />
      ) : null}

      {data && data.length === 0 ? (
        <EmptyState
          title="No colonies visible"
          message="You need mission membership to view colony data."
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
              meta={item.locationLabel ?? item.environmentSummary ?? undefined}
              badge={item.status}
              badgeVariant={colonyStatusVariant(item.status)}
              onPress={() => router.push(`/(app)/colonies/${item.id}` as Href)}
            />
          )}
        />
      ) : null}
    </AppScreenLayout>
  );
}
