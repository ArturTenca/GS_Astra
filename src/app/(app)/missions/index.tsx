import { useState } from 'react';
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';
import { AppScreenLayout } from '@/components/layout/AppScreenLayout';
import { ListSkeleton } from '@/components/ui/Skeleton';
import {
  EmptyState,
  ListItem,
  ScreenHeader,
} from '@/components/ui/ScreenPrimitives';
import { ColonyQuickViewModal } from '@/features/colonies/components/ColonyQuickViewModal';
import { ColonyFormModal } from '@/features/colonies/components/ColonyFormModal';
import { useMissions } from '@/features/dashboard/hooks/useDashboard';
import { MissionFormModal } from '@/features/missions/components/MissionFormModal';
import { MissionQuickViewModal } from '@/features/missions/components/MissionQuickViewModal';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { getUserFacingMessage } from '@/lib/errors';
import { missionStatusVariant } from '@/lib/formatters/status';

export default function MissionsListScreen() {
  const { isAuthenticated } = useAuth();
  const { data, isLoading, isError, error, refetch, isRefetching } = useMissions();
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [selectedColonyId, setSelectedColonyId] = useState<string | null>(null);
  const [missionFormId, setMissionFormId] = useState<string | 'create' | null>(null);
  const [colonyFormId, setColonyFormId] = useState<string | 'create' | null>(null);

  const showAdd = isAuthenticated;

  return (
    <AppScreenLayout>
      <MissionQuickViewModal
        missionId={selectedMissionId}
        visible={selectedMissionId != null && missionFormId == null}
        onClose={() => setSelectedMissionId(null)}
        onEdit={() => {
          if (selectedMissionId) {
            setMissionFormId(selectedMissionId);
          }
        }}
        onColonyPress={(colonyId) => setSelectedColonyId(colonyId)}
        onDeleted={() => setSelectedMissionId(null)}
      />
      <MissionFormModal
        visible={missionFormId != null}
        missionId={missionFormId === 'create' ? null : missionFormId}
        onClose={() => {
          setMissionFormId(null);
        }}
      />
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
        defaultMissionId={selectedMissionId ?? undefined}
        onClose={() => setColonyFormId(null)}
      />

      <View className="mb-4 flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <ScreenHeader title="Missions" subtitle="Operations you are assigned to" />
        </View>
        {showAdd ? (
          <Pressable
            className="mt-8 shrink-0 rounded-lg border border-astra-primary/40 bg-astra-primary/10 px-3 py-2 active:opacity-80"
            onPress={() => setMissionFormId('create')}
          >
            <Text className="text-sm font-semibold text-astra-primary">+ Add</Text>
          </Pressable>
        ) : null}
      </View>

      {isLoading ? <ListSkeleton count={4} /> : null}
      {isError ? (
        <EmptyState title="Failed to load missions" message={getUserFacingMessage(error)} />
      ) : null}

      {data && data.length === 0 ? (
        <EmptyState
          title="No missions assigned"
          message="Create a mission or run supabase/seed.sql for demo data."
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
              onPress={() => setSelectedMissionId(item.id)}
            />
          )}
        />
      ) : null}
    </AppScreenLayout>
  );
}
