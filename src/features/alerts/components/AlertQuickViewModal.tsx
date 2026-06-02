import { Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { QuickViewModalShell } from '@/components/ui/QuickViewModalShell';
import { ListSkeleton } from '@/components/ui/Skeleton';
import { EmptyState, StatusBadge } from '@/components/ui/ScreenPrimitives';
import { useAcknowledgeAlert } from '@/features/alerts/hooks/useAlerts';
import { alertRepository } from '@/services/repositories/alert.repository';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import { getUserFacingMessage } from '@/lib/errors';
import { alertSeverityVariant, formatRelativeDate } from '@/lib/formatters/status';

type AlertQuickViewModalProps = {
  alertId: string | null;
  visible: boolean;
  onClose: () => void;
};

export function AlertQuickViewModal({ alertId, visible, onClose }: AlertQuickViewModalProps) {
  const alertQuery = useQuery({
    queryKey: queryKeys.alert(alertId ?? ''),
    queryFn: () => alertRepository.getById(alertId!),
    enabled: Boolean(alertId) && visible,
  });

  const acknowledge = useAcknowledgeAlert(onClose);
  const alert = alertQuery.data;
  const isAcknowledged = alert?.acknowledgedAt != null;

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

          <Text className="mb-4 text-xs text-astra-muted">
            {formatRelativeDate(alert.createdAt)}
            {isAcknowledged ? ' · Acknowledged' : ' · Pending'}
          </Text>

          <Card className="mb-4">
            <Text className="text-sm text-astra-muted">Message</Text>
            <Text className="mt-2 text-astra-text">{alert.message}</Text>
          </Card>

          {acknowledge.error ? (
            <View className="mb-4 rounded-lg border border-astra-danger/50 bg-astra-danger/10 p-3">
              <Text className="text-sm text-astra-danger">
                {getUserFacingMessage(acknowledge.error)}
              </Text>
            </View>
          ) : null}

          {!isAcknowledged ? (
            <Button
              title="Acknowledge alert"
              onPress={() => acknowledge.mutate(alert.id)}
              loading={acknowledge.isPending}
            />
          ) : (
            <Card className="mb-4">
              <Text className="text-sm text-astra-muted">
                Acknowledged {formatRelativeDate(alert.acknowledgedAt!)}
              </Text>
            </Card>
          )}
        </>
      ) : null}
    </QuickViewModalShell>
  );
}
