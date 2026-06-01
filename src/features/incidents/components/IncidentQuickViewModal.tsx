import { useMemo, useState } from 'react';
import { Image, Linking, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { FormField } from '@/components/ui/FormField';
import { OptionPicker } from '@/components/ui/OptionPicker';
import { ListSkeleton } from '@/components/ui/Skeleton';
import { EmptyState, LoadingState, StatusBadge } from '@/components/ui/ScreenPrimitives';
import {
  useIncident,
  useIncidentAttachments,
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

type IncidentQuickViewModalProps = {
  incidentId: string | null;
  visible: boolean;
  onClose: () => void;
};

function openOsmMap(latitude: number, longitude: number) {
  const url = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`;
  void Linking.openURL(url);
}

export function IncidentQuickViewModal({
  incidentId,
  visible,
  onClose,
}: IncidentQuickViewModalProps) {
  const [isEditing, setIsEditing] = useState(false);

  const incidentQuery = useIncident(incidentId ?? '');
  const historyQuery = useIncidentHistory(incidentId ?? '');
  const attachmentsQuery = useIncidentAttachments(incidentId ?? '');
  const updateStatus = useUpdateIncidentStatus(incidentId ?? '');

  const statusOptions = useMemo(
    () => INCIDENT_STATUSES.map((s) => ({ value: s, label: s })),
    [],
  );

  const incident = incidentQuery.data;
  const hasLocation = incident?.latitude != null && incident?.longitude != null;
  const isClosed = incident?.status === 'closed';

  const close = () => {
    setIsEditing(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={close}
    >
      <Pressable className="flex-1 bg-black/60 p-4" onPress={close}>
        <Pressable
          className="max-h-[90%] w-full overflow-hidden rounded-2xl border border-astra-border bg-astra-bg"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="flex-row items-center justify-between border-b border-astra-border px-4 py-3">
            <Text className="text-sm font-semibold text-astra-text">Incident</Text>
            <Pressable onPress={close} className="px-2 py-1">
              <Text className="text-sm font-semibold text-astra-muted">Close</Text>
            </Pressable>
          </View>

          {incidentQuery.isLoading ? (
            <View className="p-4">
              <ListSkeleton count={2} />
            </View>
          ) : null}

          {incidentQuery.isError || !incident ? (
            <View className="p-4">
              <EmptyState
                title="Incident not found"
                message={getUserFacingMessage(incidentQuery.error)}
              />
            </View>
          ) : null}

          {incident ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
            >
              <View className="mb-2 flex-row flex-wrap items-center gap-2">
                <Text className="flex-1 text-lg font-bold text-astra-text">
                  {incident.title}
                </Text>
                <StatusBadge
                  label={incident.status}
                  variant={incidentStatusVariant(incident.status)}
                />
                <StatusBadge
                  label={incident.severity}
                  variant={incidentSeverityVariant(incident.severity)}
                />
              </View>

              <Text className="mb-4 text-xs text-astra-muted">
                Reported {formatRelativeDate(incident.createdAt)}
              </Text>

              <Card className="mb-4">
                <Text className="text-sm text-astra-muted">Description</Text>
                <Text className="mt-2 text-astra-text">{incident.description}</Text>
              </Card>

              <Card className="mb-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-astra-muted">GPS Coordinates</Text>
                  {hasLocation ? (
                    <Pressable
                      onPress={() => openOsmMap(incident.latitude!, incident.longitude!)}
                      className="px-2 py-1"
                    >
                      <Text className="text-sm font-semibold text-astra-primary">
                        Open map →
                      </Text>
                    </Pressable>
                  ) : null}
                </View>
                {hasLocation ? (
                  <Text className="mt-2 text-astra-text">
                    {incident.latitude!.toFixed(6)}, {incident.longitude!.toFixed(6)}
                  </Text>
                ) : (
                  <Text className="mt-2 text-sm text-astra-muted">
                    No location captured for this incident.
                  </Text>
                )}
              </Card>

              <Text className="mb-2 text-sm font-semibold uppercase tracking-wider text-astra-muted">
                Photo evidence
              </Text>

              {attachmentsQuery.isLoading ? (
                <LoadingState message="Loading photos..." />
              ) : null}

              {attachmentsQuery.data && attachmentsQuery.data.length === 0 ? (
                <Text className="mb-4 text-sm text-astra-muted">No photos attached.</Text>
              ) : null}

              {attachmentsQuery.data && attachmentsQuery.data.length > 0 ? (
                <View className="mb-4 flex-row flex-wrap gap-2">
                  {attachmentsQuery.data.map((attachment) => (
                    <View
                      key={attachment.id}
                      className="h-24 w-24 overflow-hidden rounded-lg border border-astra-border bg-astra-panel"
                    >
                      {attachment.signedUrl ? (
                        <Image
                          source={{ uri: attachment.signedUrl }}
                          className="h-24 w-24"
                          accessibilityLabel={attachment.fileName}
                        />
                      ) : (
                        <View className="flex-1 items-center justify-center p-2">
                          <Text className="text-center text-[10px] text-astra-muted">
                            {attachment.fileName}
                          </Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              ) : null}

              <Text className="mb-2 text-sm font-semibold uppercase tracking-wider text-astra-muted">
                Status timeline
              </Text>

              {historyQuery.isLoading ? <LoadingState message="Loading history..." /> : null}

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

              <View className="mt-4 flex-row gap-2">
                <View className="flex-1">
                  <Button
                    title={isEditing ? 'Stop editing' : 'Edit'}
                    onPress={() => setIsEditing((v) => !v)}
                    variant="ghost"
                  />
                </View>
                <View className="flex-1">
                  <Button title="Close" onPress={close} variant="ghost" />
                </View>
              </View>

              {isEditing && !isClosed ? (
                <View className="mt-6">
                  <Text className="mb-3 text-sm font-semibold uppercase tracking-wider text-astra-muted">
                    Update status
                  </Text>

                  {updateStatus.errorMessage ? (
                    <View className="mb-4 rounded-lg border border-astra-danger/50 bg-astra-danger/10 p-3">
                      <Text className="text-sm text-astra-danger">
                        {updateStatus.errorMessage}
                      </Text>
                    </View>
                  ) : null}

                  <Controller
                    control={updateStatus.form.control}
                    name="status"
                    render={({ field: { value, onChange } }) => (
                      <OptionPicker
                        label="New status"
                        options={statusOptions}
                        value={value}
                        onChange={onChange}
                      />
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
              ) : null}

              {isEditing && isClosed ? (
                <Card className="mt-6">
                  <Text className="text-sm text-astra-muted">This incident is closed.</Text>
                </Card>
              ) : null}
            </ScrollView>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

