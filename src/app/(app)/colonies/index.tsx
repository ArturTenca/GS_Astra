import { useState } from 'react';
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { AppScreenLayout } from '@/components/layout/AppScreenLayout';
import { ListSkeleton } from '@/components/ui/Skeleton';
import {
  EmptyState,
  ListItem,
  ScreenHeader,
} from '@/components/ui/ScreenPrimitives';
import { ColonyFormModal } from '@/features/colonies/components/ColonyFormModal';
import { ColonyQuickViewModal } from '@/features/colonies/components/ColonyQuickViewModal';
import { useColonies } from '@/features/dashboard/hooks/useDashboard';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { getUserFacingMessage } from '@/lib/errors';
import { colonyStatusVariant } from '@/lib/formatters/status';

export default function ColoniesListScreen() {
  const { isAuthenticated } = useAuth();
  const { data, isLoading, isError, error, refetch, isRefetching } = useColonies();
  const [selectedColonyId, setSelectedColonyId] = useState<string | null>(null);
  const [colonyFormId, setColonyFormId] = useState<string | 'create' | null>(null);

  const showAdd = isAuthenticated;

  return (
    <AppScreenLayout>
      <ColonyQuickViewModal
        colonyId={selectedColonyId}
        visible={selectedColonyId != null && colonyFormId == null}
        onClose={() => setSelectedColonyId(null)}
        onEdit={() => {
          if (selectedColonyId) {
            setColonyFormId(selectedColonyId);
          }
        }}
        onDeleted={() => setSelectedColonyId(null)}
      />
      <ColonyFormModal
        visible={colonyFormId != null}
        colonyId={colonyFormId === 'create' ? null : colonyFormId}
        onClose={() => setColonyFormId(null)}
      />

      <View className="mb-4 flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <ScreenHeader title="Colonies" subtitle="Habitats and surface installations" />
        </View>
        {showAdd ? (
          <Pressable
            className="mt-8 shrink-0 rounded-lg border border-astra-primary/40 bg-astra-primary/10 px-3 py-2 active:opacity-80"
            onPress={() => setColonyFormId('create')}
          >
            <Text className="text-sm font-semibold text-astra-primary">+ Add</Text>
          </Pressable>
        ) : null}
      </View>

      {isLoading ? <ListSkeleton count={4} /> : null}
      {isError ? (
        <EmptyState title="Failed to load colonies" message={getUserFacingMessage(error)} />
      ) : null}

      {data && data.length === 0 ? (
        <EmptyState
          title="No colonies visible"
          message="Add a colony or join a mission to see habitats."
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
              meta={item.locationLabel ?? item.environmentSummary ?? undefined}
              badge={item.status}
              badgeVariant={colonyStatusVariant(item.status)}
              onPress={() => setSelectedColonyId(item.id)}
            />
          )}
        />
      ) : null}
    </AppScreenLayout>
  );
}
