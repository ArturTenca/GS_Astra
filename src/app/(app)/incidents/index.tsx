import { router, type Href } from 'expo-router';
import { FlatList, Pressable, ScrollView, Text, View } from 'react-native';
import { AppScreenLayout } from '@/components/layout/AppScreenLayout';
import { FilterChip } from '@/components/ui/OptionPicker';
import {
  EmptyState,
  ListItem,
  LoadingState,
  ScreenHeader,
} from '@/components/ui/ScreenPrimitives';
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
  const { data, isLoading, isError, error } = useIncidents(filters);

  return (
    <AppScreenLayout>
      <ScreenHeader title="Incidents" subtitle="Report and track operational events" />

      <Pressable
        className="mb-4 self-end"
        onPress={() => router.push('/(app)/incidents/create' as Href)}
      >
        <Text className="font-semibold text-astra-primary">+ Report incident</Text>
      </Pressable>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        <View className="flex-row gap-2">
          <FilterChip label="All status" selected={filters.status === 'all'} onPress={() => setStatus('all')} />
          {INCIDENT_STATUSES.map((s) => (
            <FilterChip
              key={s}
              label={s}
              selected={filters.status === s}
              onPress={() => setStatus(s)}
            />
          ))}
        </View>
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        <View className="flex-row gap-2">
          <FilterChip label="All severity" selected={filters.severity === 'all'} onPress={() => setSeverity('all')} />
          {INCIDENT_SEVERITIES.map((s) => (
            <FilterChip
              key={s}
              label={s}
              selected={filters.severity === s}
              onPress={() => setSeverity(s)}
            />
          ))}
        </View>
      </ScrollView>

      {isLoading ? <LoadingState message="Loading incidents..." /> : null}
      {isError ? (
        <EmptyState title="Failed to load" message={getUserFacingMessage(error)} />
      ) : null}

      {data && data.length === 0 ? (
        <EmptyState
          title="No incidents found"
          message="Adjust filters or report a new incident."
        />
      ) : null}

      {data && data.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerClassName="gap-3 pb-8"
          renderItem={({ item }) => (
            <ListItem
              title={item.title}
              subtitle={item.description.slice(0, 72)}
              meta={formatRelativeDate(item.createdAt)}
              badge={item.status}
              badgeVariant={incidentStatusVariant(item.status)}
              onPress={() => router.push(`/(app)/incidents/${item.id}` as Href)}
            />
          )}
        />
      ) : null}
    </AppScreenLayout>
  );
}
