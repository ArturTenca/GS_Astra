import { router, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { AppScreenLayout } from '@/components/layout/AppScreenLayout';
import { FilterChip, FilterRow } from '@/components/ui/FilterBar';
import { ListSkeleton } from '@/components/ui/Skeleton';
import {
  EmptyState,
  ListItem,
  ScreenHeader,
} from '@/components/ui/ScreenPrimitives';
import { IncidentQuickViewModal } from '@/features/incidents/components/IncidentQuickViewModal';
import {
  useIncidentFilters,
  useIncidents,
} from '@/features/incidents/hooks/useIncidents';
import { getUserFacingMessage } from '@/lib/errors';
import {
  formatRelativeDate,
  incidentStatusVariant,
} from '@/lib/formatters/status';
import { INCIDENT_SEVERITIES, INCIDENT_STATUSES } from '@/types/domain';

export default function IncidentsListScreen() {
  const { filters, setStatus, setSeverity } = useIncidentFilters();
  const { data, isLoading, isError, error, refetch, isRefetching } = useIncidents(filters);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);

  const hasModal = useMemo(() => selectedIncidentId != null, [selectedIncidentId]);

  return (
    <AppScreenLayout>
      <IncidentQuickViewModal
        incidentId={selectedIncidentId}
        visible={hasModal}
        onClose={() => setSelectedIncidentId(null)}
        onDeleted={() => setSelectedIncidentId(null)}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} tintColor="#3b82f6" />
        }
      >
        <View className="mb-4 flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <ScreenHeader title="Incidents" subtitle="Report and track operational events" />
          </View>
          <Pressable
            className="mt-8 shrink-0 rounded-lg border border-astra-primary/40 bg-astra-primary/10 px-3 py-2 active:opacity-80"
            onPress={() => router.push('/(app)/incidents/create' as Href)}
          >
            <Text className="text-sm font-semibold text-astra-primary">+ Report</Text>
          </Pressable>
        </View>

        <FilterRow label="Status">
          <FilterChip
            label="All"
            selected={filters.status === 'all'}
            onPress={() => setStatus('all')}
          />
          {INCIDENT_STATUSES.map((s) => (
            <FilterChip
              key={s}
              label={s}
              selected={filters.status === s}
              onPress={() => setStatus(s)}
            />
          ))}
        </FilterRow>

        <FilterRow label="Severity">
          <FilterChip
            label="All"
            selected={filters.severity === 'all'}
            onPress={() => setSeverity('all')}
          />
          {INCIDENT_SEVERITIES.map((s) => (
            <FilterChip
              key={s}
              label={s}
              selected={filters.severity === s}
              onPress={() => setSeverity(s)}
            />
          ))}
        </FilterRow>

        {isLoading ? <ListSkeleton count={4} /> : null}

        {isError ? (
          <EmptyState title="Failed to load" message={getUserFacingMessage(error)} />
        ) : null}

        {!isLoading && !isError && data?.length === 0 ? (
          <EmptyState
            title="No incidents found"
            message="Report a new incident or pull down to refresh."
          />
        ) : null}

        {data && data.length > 0 ? (
          <View className="mt-2 gap-3">
            {data.map((item) => (
              <ListItem
                key={item.id}
                title={item.title}
                subtitle={item.description.slice(0, 72)}
                meta={formatRelativeDate(item.createdAt)}
                badge={item.status}
                badgeVariant={incidentStatusVariant(item.status)}
                onPress={() => setSelectedIncidentId(item.id)}
              />
            ))}
          </View>
        ) : null}
      </ScrollView>
    </AppScreenLayout>
  );
}
