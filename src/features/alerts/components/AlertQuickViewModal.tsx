import { Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CrudActionBar } from '@/components/ui/CrudActionBar';
import { QuickViewModalShell } from '@/components/ui/QuickViewModalShell';
import { ListSkeleton } from '@/components/ui/Skeleton';
import { EmptyState, StatusBadge } from '@/components/ui/ScreenPrimitives';
import { useAcknowledgeAlert } from '@/features/alerts/hooks/useAlerts';
import { useAlertMutations } from '@/features/alerts/hooks/useAlertCrud';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { confirmDestructiveAction } from '@/lib/confirm-action';
import { formatDisplayDate } from '@/lib/dates/alert-dates';
import { getUserFacingMessage } from '@/lib/errors';
import { getAlertStatusLine } from '@/lib/formatters/alert-status';
import { canManageAlertRecord } from '@/lib/permissions';
import { alertSeverityVariant, formatRelativeDate } from '@/lib/formatters/status';
import { alertRepository } from '@/services/repositories/alert.repository';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';

type AlertQuickViewModalProps = {
  alertId: string | null;
  visible: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDeleted?: () => void;
};

export function AlertQuickViewModal({
  alertId,
  visible,
  onClose,
  onEdit,
  onDeleted,
}: AlertQuickViewModalProps) {
  const { isAuthenticated } = useAuth();
  const alertQuery = useQuery({
    queryKey: queryKeys.alert(alertId ?? ''),
    queryFn: () => alertRepository.getById(alertId!),
    enabled: Boolean(alertId) && visible,
  });

  const { remove } = useAlertMutations(() => {
    onDeleted?.();
    onClose();
  });

  const acknowledge = useAcknowledgeAlert(onClose);
  const alert = alertQuery.data;
  const isAcknowledged = alert?.acknowledgedAt != null;
  const canAcknowledge = alert != null && !isAcknowledged;
  const showCrud = canManageAlertRecord(isAuthenticated);

  const handleDelete = () => {
    if (!alertId) return;
    confirmDestructiveAction({
      title: 'Delete alert?',
      message: 'This notification will be permanently removed.',
      onConfirm: () => remove.mutate(alertId),
    });
  };

  return (
    <QuickViewModalShell visible={visible} title="Alert" onClose={onClose}>
      {alertQuery.isLoading ? <ListSkeleton count={2} /> : null}

      {alertQuery.isError || (!alertQuery.isLoading && !alert) ? (
        <EmptyState
          title="Alert not found"
          message={getUserFacingMessage(alertQuery.error)}
        />
      ) : null}

      {alert ? (
        <>
          <View className="mb-2 flex-row flex-wrap items-center gap-2">
            <Text className="flex-1 text-lg font-bold text-astra-text">{alert.title}</Text>
            <StatusBadge label={alert.severity} variant={alertSeverityVariant(alert.severity)} />
          </View>

          <Text className="mb-1 text-xs text-astra-muted">
            Created {formatRelativeDate(alert.createdAt)}
          </Text>
          <Text className="mb-4 text-sm font-medium text-astra-text">
            {getAlertStatusLine(alert)}
          </Text>

          <Card className="mb-4">
            <Text className="text-sm text-astra-muted">Message</Text>
            <Text className="mt-2 text-astra-text">{alert.message}</Text>
          </Card>

          <Card className="mb-4">
            <Text className="text-sm text-astra-muted">Deadline</Text>
            <Text className="mt-2 text-astra-text">
              {alert.activeUntil
                ? formatDisplayDate(alert.activeUntil)
                : 'No deadline — stays active until acknowledged'}
            </Text>
          </Card>

          {acknowledge.error ? (
            <View className="mb-4 rounded-lg border border-astra-danger/50 bg-astra-danger/10 p-3">
              <Text className="text-sm text-astra-danger">
                {getUserFacingMessage(acknowledge.error)}
              </Text>
            </View>
          ) : null}

          {canAcknowledge ? (
            <Button
              title="Acknowledge alert"
              onPress={() => acknowledge.mutate(alert.id)}
              loading={acknowledge.isPending}
            />
          ) : null}

          {isAcknowledged ? (
            <Card className="mb-4">
              <Text className="text-sm text-astra-muted">
                Acknowledged {formatRelativeDate(alert.acknowledgedAt!)}
              </Text>
            </Card>
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
