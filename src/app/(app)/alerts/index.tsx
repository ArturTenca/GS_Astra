import { useState } from 'react';
import { RefreshControl, Text, View } from 'react-native';
import { AppScreenLayout } from '@/components/layout/AppScreenLayout';
import { EntityGrid } from '@/components/ui/EntityGrid';
import { FilterChip, FilterRow } from '@/components/ui/FilterBar';
import { GridSkeleton } from '@/components/ui/Skeleton';
import {
  EmptyState,
  GridCard,
  ScreenHeader,
} from '@/components/ui/ScreenPrimitives';
import { AlertQuickViewModal } from '@/features/alerts/components/AlertQuickViewModal';
import { useAlerts } from '@/features/alerts/hooks/useAlerts';
import { getUserFacingMessage } from '@/lib/errors';
import { alertSeverityVariant, formatRelativeDate } from '@/lib/formatters/status';
import type { AlertFilters } from '@/types/alert.types';

export default function AlertsScreen() {
  const [status, setStatus] = useState<AlertFilters['status']>('all');
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const filters = { status } satisfies AlertFilters;

  const { data, isLoading, isError, error, refetch, isRefetching } = useAlerts(filters);

  return (
    <AppScreenLayout>
      <AlertQuickViewModal
        alertId={selectedAlertId}
        visible={selectedAlertId != null}
        onClose={() => setSelectedAlertId(null)}
      />

      <ScreenHeader
        title="Alerts"
        subtitle="Operational notifications · live updates"
      />

      <FilterRow label="Status">
        <FilterChip label="All" selected={status === 'all'} onPress={() => setStatus('all')} />
        <FilterChip
          label="Pending"
          selected={status === 'unacknowledged'}
          onPress={() => setStatus('unacknowledged')}
        />
      </FilterRow>

      {isLoading ? <GridSkeleton count={4} /> : null}

      {isError ? (
        <EmptyState title="Failed to load alerts" message={getUserFacingMessage(error)} />
      ) : null}

      {data && data.length === 0 ? (
        <EmptyState
          title="No alerts"
          message="High or critical incidents generate alerts automatically."
        />
      ) : null}

      {data && data.length > 0 ? (
        <View className="flex-1">
        <EntityGrid
          data={data}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} tintColor="#3b82f6" />
          }
          renderItem={(item) => (
            <GridCard
              title={item.title}
              subtitle={item.message.slice(0, 60)}
              meta={formatRelativeDate(item.createdAt)}
              badge={item.acknowledgedAt ? 'ack' : item.severity}
              badgeVariant={
                item.acknowledgedAt ? 'success' : alertSeverityVariant(item.severity)
              }
              onPress={() => setSelectedAlertId(item.id)}
            />
          )}
        />
        </View>
      ) : null}

      <View className="mt-2">
        <Text className="text-center text-xs text-astra-muted">
          Pull to refresh · Live updates when Supabase Realtime is on for alerts
        </Text>
      </View>
    </AppScreenLayout>
  );
}
