import { Pressable, Text, View } from 'react-native';
import { QuickViewModalShell } from '@/components/ui/QuickViewModalShell';
import { Card } from '@/components/ui/Card';
import { CrudActionBar } from '@/components/ui/CrudActionBar';
import { ListSkeleton } from '@/components/ui/Skeleton';
import {
  EmptyState,
  LoadingState,
  StatusBadge,
} from '@/components/ui/ScreenPrimitives';
import { useColonies, useMission } from '@/features/dashboard/hooks/useDashboard';
import { useMissionMutations } from '@/features/missions/hooks/useMissionCrud';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { confirmDestructiveAction } from '@/lib/confirm-action';
import { getUserFacingMessage } from '@/lib/errors';
import { canManageMissionRecord } from '@/lib/permissions';
import {
  colonyStatusVariant,
  formatRelativeDate,
  missionStatusVariant,
} from '@/lib/formatters/status';

type MissionQuickViewModalProps = {
  missionId: string | null;
  visible: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onColonyPress?: (colonyId: string) => void;
  onDeleted?: () => void;
};

function formatScheduleDate(value: string | null): string {
  if (!value) return '—';
  return new Date(value).toLocaleDateString();
}

export function MissionQuickViewModal({
  missionId,
  visible,
  onClose,
  onEdit,
  onColonyPress,
  onDeleted,
}: MissionQuickViewModalProps) {
  const { isAuthenticated } = useAuth();
  const missionQuery = useMission(missionId ?? '');
  const coloniesQuery = useColonies(missionId ?? undefined);
  const { remove } = useMissionMutations(() => {
    onDeleted?.();
    onClose();
  });

  const mission = missionQuery.data;
  const showCrud = canManageMissionRecord(isAuthenticated);

  const handleDelete = () => {
    if (!missionId) return;
    confirmDestructiveAction({
      title: 'Delete mission?',
      message: 'All colonies and incidents linked to this mission will be removed.',
      onConfirm: () => remove.mutate(missionId),
    });
  };

  return (
    <QuickViewModalShell visible={visible} title="Mission" onClose={onClose}>
      {missionQuery.isLoading ? <ListSkeleton count={2} /> : null}

      {missionQuery.isError || (!missionQuery.isLoading && !mission) ? (
        <EmptyState
          title="Mission not found"
          message={getUserFacingMessage(missionQuery.error)}
        />
      ) : null}

      {mission ? (
        <>
          <View className="mb-2 flex-row flex-wrap items-center gap-2">
            <Text className="flex-1 text-lg font-bold text-astra-text">{mission.name}</Text>
            <StatusBadge label={mission.status} variant={missionStatusVariant(mission.status)} />
          </View>
          <Text className="mb-4 text-sm text-astra-accent">{mission.code}</Text>

          <Card className="mb-4">
            <Text className="text-sm text-astra-muted">Description</Text>
            <Text className="mt-2 text-astra-text">
              {mission.description ?? 'No description available.'}
            </Text>
          </Card>

          <Card className="mb-4">
            <Text className="text-sm text-astra-muted">Schedule</Text>
            <Text className="mt-2 text-astra-text">Start: {formatScheduleDate(mission.startAt)}</Text>
            <Text className="mt-1 text-astra-text">End: {formatScheduleDate(mission.endAt)}</Text>
            <Text className="mt-2 text-xs text-astra-muted">
              Created {formatRelativeDate(mission.createdAt)}
            </Text>
          </Card>

          <Text className="mb-3 text-sm font-semibold uppercase tracking-wider text-astra-muted">
            Colonies in this mission
          </Text>

          {coloniesQuery.isLoading ? <LoadingState message="Loading colonies…" /> : null}

          {coloniesQuery.data?.length === 0 ? (
            <EmptyState
              title="No colonies"
              message="No habitats linked to this mission yet."
            />
          ) : null}

          {coloniesQuery.data && coloniesQuery.data.length > 0 ? (
            <View className="mb-4 gap-2">
              {coloniesQuery.data.map((colony) => (
                <Pressable
                  key={colony.id}
                  className="rounded-xl border border-astra-border bg-astra-surface/80 p-4 active:opacity-80"
                  onPress={() => onColonyPress?.(colony.id)}
                  disabled={!onColonyPress}
                >
                  <View className="flex-row items-center justify-between gap-2">
                    <View className="flex-1">
                      <Text className="font-semibold text-astra-text">{colony.name}</Text>
                      <Text className="text-sm text-astra-muted">{colony.code}</Text>
                      {colony.locationLabel ? (
                        <Text className="mt-1 text-xs text-astra-muted">{colony.locationLabel}</Text>
                      ) : null}
                    </View>
                    <StatusBadge
                      label={colony.status}
                      variant={colonyStatusVariant(colony.status)}
                    />
                  </View>
                  {onColonyPress ? (
                    <Text className="mt-2 text-xs font-semibold text-astra-primary">
                      View details →
                    </Text>
                  ) : null}
                </Pressable>
              ))}
            </View>
          ) : null}

          {showCrud ? (
            <CrudActionBar
              onEdit={onEdit}
              onDelete={handleDelete}
              isDeleting={remove.isPending}
            />
          ) : null}
        </>
      ) : null}
    </QuickViewModalShell>
  );
}
