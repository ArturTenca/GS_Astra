import { useState } from 'react';
import { Pressable, RefreshControl, Text, View } from 'react-native';
import { AppScreenLayout } from '@/components/layout/AppScreenLayout';
import { AlertFormModal } from '@/features/alerts/components/AlertFormModal';
import { AlertQuickViewModal } from '@/features/alerts/components/AlertQuickViewModal';
import { EntityGrid } from '@/components/ui/EntityGrid';
import { FilterChip, FilterRow } from '@/components/ui/FilterBar';
import { GridSkeleton } from '@/components/ui/Skeleton';
import {
  EmptyState,
  GridCard,
  ScreenHeader,
} from '@/components/ui/ScreenPrimitives';
import { useAlerts } from '@/features/alerts/hooks/useAlerts';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { getUserFacingMessage } from '@/lib/errors';
import { getAlertListBadge } from '@/lib/formatters/alert-status';
import { formatDisplayDate } from '@/lib/dates/alert-dates';
import { formatRelativeDate } from '@/lib/formatters/status';
import type { AlertFilters } from '@/types/alert.types';

export default function AlertsScreen() {
  const { isAuthenticated } = useAuth();
  const [status, setStatus] = useState<AlertFilters['status']>('active');
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [alertFormId, setAlertFormId] = useState<string | 'create' | null>(null);
  const filters = { status } satisfies AlertFilters;

  const { data, isLoading, isError, error, refetch, isRefetching } = useAlerts(filters);

  return (
    <AppScreenLayout>
      <AlertQuickViewModal
        alertId={selectedAlertId}
        visible={selectedAlertId != null && alertFormId == null}
        onClose={() => setSelectedAlertId(null)}
        onEdit={() => {
          if (selectedAlertId) {
            setAlertFormId(selectedAlertId);
          }
        }}
        onDeleted={() => setSelectedAlertId(null)}
      />
      <AlertFormModal
        visible={alertFormId != null}
        alertId={alertFormId === 'create' ? null : alertFormId}
        onClose={() => setAlertFormId(null)}
      />

      <View className="mb-4 flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <ScreenHeader
            title="Alerts"
            subtitle="Notifications with optional deadline calendar"
          />
        </View>
        {isAuthenticated ? (
          <Pressable
            className="mt-8 shrink-0 rounded-lg border border-astra-primary/40 bg-astra-primary/10 px-3 py-2 active:opacity-80"
            onPress={() => setAlertFormId('create')}
          >
            <Text className="text-sm font-semibold text-astra-primary">+ Add</Text>
          </Pressable>
        ) : null}
      </View>

      <FilterRow label="Status">
        <FilterChip label="Active" selected={status === 'active'} onPress={() => setStatus('active')} />
        <FilterChip label="All" selected={status === 'all'} onPress={() => setStatus('all')} />
        <FilterChip
          label="Expired"
          selected={status === 'expired'}
          onPress={() => setStatus('expired')}
        />
        <FilterChip
          label="Ack"
          selected={status === 'acknowledged'}
          onPress={() => setStatus('acknowledged')}
        />
      </FilterRow>

      {isLoading ? <GridSkeleton count={4} /> : null}

      {isError ? (
        <EmptyState
          title="Failed to load alerts"
          message={`${getUserFacingMessage(error)} If this persists, apply migration 20260604100000_alerts_deadline_crud.sql in Supabase.`}
        />
      ) : null}

      {data && data.length === 0 ? (
        <EmptyState
          title="No alerts"
          message="Tap + Add to create an alert with a calendar deadline, or pull to refresh."
        />
      ) : null}

      {data && data.length > 0 ? (
        <View className="flex-1">
          <EntityGrid
            data={data}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={() => refetch()}
                tintColor="#3b82f6"
              />
            }
            renderItem={(item) => {
              const badge = getAlertListBadge(item);
              const meta = item.activeUntil
                ? `Until ${formatDisplayDate(item.activeUntil)}`
                : formatRelativeDate(item.createdAt);

              return (
                <GridCard
                  title={item.title}
                  subtitle={item.message.slice(0, 60)}
                  meta={meta}
                  badge={badge.label}
                  badgeVariant={badge.variant}
                  onPress={() => setSelectedAlertId(item.id)}
                />
              );
            }}
          />
        </View>
      ) : null}

      <View className="mt-2">
        <Text className="text-center text-xs text-astra-muted">
          Active = before deadline · Expired = past deadline, not acknowledged
        </Text>
      </View>
    </AppScreenLayout>
  );
}
