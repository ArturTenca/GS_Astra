import { useMemo, useState } from 'react';
import { Image, Linking, Pressable, Text, View } from 'react-native';
import { Controller } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CrudActionBar } from '@/components/ui/CrudActionBar';
import { FormField } from '@/components/ui/FormField';
import { OptionPicker } from '@/components/ui/OptionPicker';
import { QuickViewModalShell } from '@/components/ui/QuickViewModalShell';
import { ListSkeleton } from '@/components/ui/Skeleton';
import { EmptyState, LoadingState, StatusBadge } from '@/components/ui/ScreenPrimitives';
import { useMissions, useColonies } from '@/features/dashboard/hooks/useDashboard';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  useDeleteIncident,
  useIncident,
  useIncidentAttachments,
  useIncidentHistory,
  useUpdateIncident,
} from '@/features/incidents/hooks/useIncidents';
import {
  INCIDENT_DESCRIPTION_MAX,
  INCIDENT_NOTE_MAX,
  INCIDENT_TITLE_MAX,
} from '@/features/incidents/schemas/incident.schema';
import { confirmDestructiveAction } from '@/lib/confirm-action';
import { getUserFacingMessage } from '@/lib/errors';
import { canDeleteIncident, canEditIncident } from '@/lib/permissions';
import {
  formatRelativeDate,
  incidentSeverityVariant,
  incidentStatusVariant,
} from '@/lib/formatters/status';
import { INCIDENT_SEVERITIES, INCIDENT_STATUSES } from '@/types/domain';

type IncidentQuickViewModalProps = {
  incidentId: string | null;
  visible: boolean;
  onClose: () => void;
  onDeleted?: () => void;
};

function openOsmMap(latitude: number, longitude: number) {
  const url = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`;
  void Linking.openURL(url);
}

export function IncidentQuickViewModal({
  incidentId,
  visible,
  onClose,
  onDeleted,
}: IncidentQuickViewModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { userId, isAuthenticated } = useAuth();

  const incidentQuery = useIncident(incidentId ?? '');
  const historyQuery = useIncidentHistory(incidentId ?? '');
  const attachmentsQuery = useIncidentAttachments(incidentId ?? '');
  const updateIncident = useUpdateIncident(incidentId ?? '', {
    onSuccess: () => setIsEditing(false),
  });
  const deleteIncident = useDeleteIncident({
    onSuccess: () => {
      onDeleted?.();
      onClose();
    },
  });

  const missionId = updateIncident.form.watch('missionId');
  const missionsQuery = useMissions();
  const coloniesQuery = useColonies(missionId || undefined);

  const statusOptions = useMemo(
    () => INCIDENT_STATUSES.map((s) => ({ value: s, label: s })),
    [],
  );
  const severityOptions = useMemo(
    () => INCIDENT_SEVERITIES.map((s) => ({ value: s, label: s })),
    [],
  );
  const missionOptions = useMemo(
    () => missionsQuery.data?.map((m) => ({ value: m.id, label: `${m.name} (${m.code})` })) ?? [],
    [missionsQuery.data],
  );
  const colonyOptions = useMemo(() => {
    const none = { value: '', label: 'None' };
    const items =
      coloniesQuery.data?.map((c) => ({ value: c.id, label: `${c.name} (${c.code})` })) ?? [];
    return [none, ...items];
  }, [coloniesQuery.data]);

  const incident = incidentQuery.data;
  const hasLocation = incident?.latitude != null && incident?.longitude != null;
  const allowEdit = canEditIncident(isAuthenticated, userId);
  const allowDelete = canDeleteIncident(isAuthenticated, userId);

  const close = () => {
    setIsEditing(false);
    onClose();
  };

  const handleDelete = () => {
    if (!incidentId) return;
    confirmDestructiveAction({
      title: 'Delete incident?',
      message: 'This will permanently remove the incident and its attachments.',
      onConfirm: () => deleteIncident.mutate(incidentId),
    });
  };

  return (
    <QuickViewModalShell visible={visible} title="Incident" onClose={close}>
      {incidentQuery.isLoading ? <ListSkeleton count={2} /> : null}

      {!incidentQuery.isLoading && (incidentQuery.isError || !incident) ? (
        <EmptyState
          title="Incident not found"
          message={getUserFacingMessage(incidentQuery.error)}
        />
      ) : null}

      {incident && isEditing ? (
        <>
          {updateIncident.errorMessage ? (
            <View className="mb-4 rounded-lg border border-astra-danger/50 bg-astra-danger/10 p-3">
              <Text className="text-sm text-astra-danger">{updateIncident.errorMessage}</Text>
            </View>
          ) : null}

          <Controller
            control={updateIncident.form.control}
            name="missionId"
            render={({ field: { value, onChange } }) => (
              <OptionPicker label="Mission" options={missionOptions} value={value} onChange={onChange} />
            )}
          />
          <Controller
            control={updateIncident.form.control}
            name="colonyId"
            render={({ field: { value, onChange } }) => (
              <OptionPicker label="Colony" options={colonyOptions} value={value} onChange={onChange} />
            )}
          />
          <FormField
            control={updateIncident.form.control}
            name="title"
            label="Title"
            placeholder="Incident title"
            maxLength={INCIDENT_TITLE_MAX}
          />
          <FormField
            control={updateIncident.form.control}
            name="description"
            label="Description"
            placeholder="What happened?"
            maxLength={INCIDENT_DESCRIPTION_MAX}
            multiline
            autoCapitalize="sentences"
          />
          <Controller
            control={updateIncident.form.control}
            name="severity"
            render={({ field: { value, onChange } }) => (
              <OptionPicker
                label="Severity"
                options={severityOptions}
                value={value}
                onChange={onChange}
              />
            )}
          />
          <Controller
            control={updateIncident.form.control}
            name="status"
            render={({ field: { value, onChange } }) => (
              <OptionPicker label="Status" options={statusOptions} value={value} onChange={onChange} />
            )}
          />
          <FormField
            control={updateIncident.form.control}
            name="note"
            label="Status note (optional)"
            placeholder="Context for status change..."
            maxLength={INCIDENT_NOTE_MAX}
            multiline
            autoCapitalize="sentences"
          />

          <Button
            title="Save changes"
            onPress={updateIncident.onSubmit}
            loading={updateIncident.isPending}
          />
          <View className="mt-2">
            <Button title="Cancel" onPress={() => setIsEditing(false)} variant="ghost" />
          </View>
        </>
      ) : null}

      {incident && !isEditing ? (
        <>
          <View className="mb-2 flex-row flex-wrap items-center gap-2">
            <Text className="flex-1 text-lg font-bold text-astra-text">{incident.title}</Text>
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
                  <Text className="text-sm font-semibold text-astra-primary">Open map →</Text>
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

          {attachmentsQuery.isLoading ? <LoadingState message="Loading photos..." /> : null}

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

          {allowEdit || allowDelete ? (
            <CrudActionBar
              onEdit={allowEdit ? () => setIsEditing(true) : undefined}
              onDelete={allowDelete ? handleDelete : undefined}
              isDeleting={deleteIncident.isPending}
            />
          ) : null}

          <Button title="Close" onPress={close} variant="ghost" />
        </>
      ) : null}
    </QuickViewModalShell>
  );
}
