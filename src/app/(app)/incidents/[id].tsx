import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { AppScreenLayout } from '@/components/layout/AppScreenLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FormField } from '@/components/ui/FormField';
import { OptionPicker } from '@/components/ui/OptionPicker';
import {
  EmptyState,
  LoadingState,
  StatusBadge,
} from '@/components/ui/ScreenPrimitives';
import {
  useIncident,
  useIncidentHistory,
  useUpdateIncidentStatus,
} from '@/features/incidents/hooks/useIncidents';
import { INCIDENT_NOTE_MAX } from '@/features/incidents/schemas/incident.schema';
import { getUserFacingMessage } from '@/lib/errors';
import {
  formatRelativeDate,
  incidentSeverityVariant,
  incidentStatusVariant,
} from '@/lib/formatters/status';
import { INCIDENT_STATUSES } from '@/types/domain';
import { Controller } from 'react-hook-form';

export default function IncidentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const incidentQuery = useIncident(id ?? '');
  const historyQuery = useIncidentHistory(id ?? '');
  const updateStatus = useUpdateIncidentStatus(id ?? '');

  if (incidentQuery.isLoading) {
    return (
      <AppScreenLayout>
        <LoadingState />
      </AppScreenLayout>
    );
  }

  if (incidentQuery.isError || !incidentQuery.data) {
    return (
      <AppScreenLayout>
        <EmptyState
          title="Incident not found"
          message={getUserFacingMessage(incidentQuery.error)}
        />
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="text-center text-astra-primary">Go back</Text>
        </Pressable>
      </AppScreenLayout>
    );
  }

  const incident = incidentQuery.data;
  const statusOptions = INCIDENT_STATUSES.map((s) => ({ value: s, label: s }));
  const isClosed = incident.status === 'closed';

  return (
    <AppScreenLayout>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()} className="mb-4">
          <Text className="text-sm text-astra-primary">← Back to incidents</Text>
        </Pressable>

        <View className="mb-2 flex-row flex-wrap items-center gap-2">
          <Text className="flex-1 text-xl font-bold text-astra-text">{incident.title}</Text>
          <StatusBadge label={incident.status} variant={incidentStatusVariant(incident.status)} />
          <StatusBadge label={incident.severity} variant={incidentSeverityVariant(incident.severity)} />
        </View>

        <Text className="mb-4 text-xs text-astra-muted">
          Reported {formatRelativeDate(incident.createdAt)}
        </Text>

        <Card className="mb-4">
          <Text className="text-sm text-astra-muted">Description</Text>
          <Text className="mt-2 text-astra-text">{incident.description}</Text>
        </Card>

        <Text className="mb-3 text-sm font-semibold uppercase tracking-wider text-astra-muted">
          Status timeline
        </Text>

        {historyQuery.isLoading ? <LoadingState message="Loading history..." /> : null}

        {historyQuery.data && historyQuery.data.length === 0 ? (
          <Text className="mb-4 text-sm text-astra-muted">No status changes recorded yet.</Text>
        ) : null}

        {historyQuery.data?.map((entry) => (
          <Card key={entry.id} className="mb-2">
            <Text className="text-sm font-semibold text-astra-text">
              {entry.fromStatus ?? 'created'} → {entry.toStatus}
            </Text>
            <Text className="mt-1 text-xs text-astra-muted">
              {formatRelativeDate(entry.createdAt)}
            </Text>
            {entry.note ? (
              <Text className="mt-2 text-sm text-astra-muted">{entry.note}</Text>
            ) : null}
          </Card>
        ))}

        {!isClosed ? (
          <View className="mt-6">
            <Text className="mb-3 text-sm font-semibold uppercase tracking-wider text-astra-muted">
              Update status
            </Text>

            {updateStatus.errorMessage ? (
              <View className="mb-4 rounded-lg border border-astra-danger/50 bg-astra-danger/10 p-3">
                <Text className="text-sm text-astra-danger">{updateStatus.errorMessage}</Text>
              </View>
            ) : null}

            <Controller
              control={updateStatus.form.control}
              name="status"
              render={({ field: { value, onChange } }) => (
                <OptionPicker label="New status" options={statusOptions} value={value} onChange={onChange} />
              )}
            />

            <FormField
              control={updateStatus.form.control}
              name="note"
              label="Note (optional)"
              placeholder="Context for this status change..."
              maxLength={INCIDENT_NOTE_MAX}
              multiline
              autoCapitalize="sentences"
            />

            <Button
              title="Update Status"
              onPress={updateStatus.onSubmit}
              loading={updateStatus.isPending}
            />
          </View>
        ) : (
          <Card className="mt-6">
            <Text className="text-sm text-astra-muted">This incident is closed.</Text>
          </Card>
        )}
      </ScrollView>
    </AppScreenLayout>
  );
}
