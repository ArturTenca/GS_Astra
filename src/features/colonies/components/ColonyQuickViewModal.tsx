import { Text, View } from 'react-native';
import { QuickViewModalShell } from '@/components/ui/QuickViewModalShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CrudActionBar } from '@/components/ui/CrudActionBar';
import { ListSkeleton } from '@/components/ui/Skeleton';
import { EmptyState, StatusBadge } from '@/components/ui/ScreenPrimitives';
import { useColony } from '@/features/dashboard/hooks/useDashboard';
import { useColonyMutations } from '@/features/colonies/hooks/useColonyCrud';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { confirmDestructiveAction } from '@/lib/confirm-action';
import { getUserFacingMessage } from '@/lib/errors';
import { canManageColonyRecord } from '@/lib/permissions';
import { colonyStatusVariant, formatRelativeDate } from '@/lib/formatters/status';

type ColonyQuickViewModalProps = {
  colonyId: string | null;
  visible: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDeleted?: () => void;
};

export function ColonyQuickViewModal({
  colonyId,
  visible,
  onClose,
  onEdit,
  onDeleted,
}: ColonyQuickViewModalProps) {
  const { isAuthenticated } = useAuth();
  const colonyQuery = useColony(colonyId ?? '');
  const { remove } = useColonyMutations(() => {
    onDeleted?.();
    onClose();
  });

  const colony = colonyQuery.data;
  const showCrud = canManageColonyRecord(isAuthenticated);

  const handleDelete = () => {
    if (!colonyId) return;
    confirmDestructiveAction({
      title: 'Delete colony?',
      message: 'This habitat will be permanently removed from the mission.',
      onConfirm: () => remove.mutate(colonyId),
    });
  };

  return (
    <QuickViewModalShell visible={visible} title="Colony" onClose={onClose}>
      {colonyQuery.isLoading ? <ListSkeleton count={2} /> : null}

      {colonyQuery.isError || (!colonyQuery.isLoading && !colony) ? (
        <EmptyState
          title="Colony not found"
          message={getUserFacingMessage(colonyQuery.error)}
        />
      ) : null}

      {colony ? (
        <>
          <View className="mb-2 flex-row flex-wrap items-center gap-2">
            <Text className="flex-1 text-lg font-bold text-astra-text">{colony.name}</Text>
            <StatusBadge label={colony.status} variant={colonyStatusVariant(colony.status)} />
          </View>
          <Text className="mb-4 text-sm text-astra-accent">{colony.code}</Text>

          <Text className="mb-4 text-xs text-astra-muted">
            Registered {formatRelativeDate(colony.createdAt)}
          </Text>

          <Card className="mb-4">
            <Text className="text-sm text-astra-muted">Location</Text>
            <Text className="mt-2 text-astra-text">
              {colony.locationLabel ?? 'Coordinates classified'}
            </Text>
          </Card>

          <Card className="mb-4">
            <Text className="text-sm text-astra-muted">Environment</Text>
            <Text className="mt-2 text-astra-text">
              {colony.environmentSummary ?? 'Telemetry pending sync.'}
            </Text>
          </Card>

          {showCrud ? (
            <CrudActionBar
              onEdit={onEdit}
              onDelete={handleDelete}
              isDeleting={remove.isPending}
            />
          ) : null}

          <Button title="Close" onPress={onClose} variant="ghost" />
        </>
      ) : null}
    </QuickViewModalShell>
  );
}
