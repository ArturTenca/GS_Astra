import { router } from 'expo-router';
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { Platform, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { AppScreenLayout } from '@/components/layout/AppScreenLayout';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { OptionPicker } from '@/components/ui/OptionPicker';
import { ListSkeleton } from '@/components/ui/Skeleton';
import { EmptyState, ScreenHeader } from '@/components/ui/ScreenPrimitives';
import { useMissions, useColonies } from '@/features/dashboard/hooks/useDashboard';
import {
  AttachmentSection,
  LocationCaptureSection,
} from '@/features/incidents/components/IncidentMobileSections';
import { useAttachmentPicker } from '@/features/incidents/hooks/useAttachmentPicker';
import { useCreateIncident } from '@/features/incidents/hooks/useIncidents';
import {
  INCIDENT_DESCRIPTION_MAX,
  INCIDENT_TITLE_MAX,
} from '@/features/incidents/schemas/incident.schema';
import { useLocationCapture } from '@/hooks/useLocationCapture';
import { INCIDENT_SEVERITIES } from '@/types/domain';

export default function CreateIncidentScreen() {
  const { form, submit, isPending, errorMessage } = useCreateIncident();
  const missionsQuery = useMissions();
  const missionId = form.watch('missionId');
  const coloniesQuery = useColonies(missionId || undefined);
  const location = useLocationCapture();
  const attachments = useAttachmentPicker();

  useEffect(() => {
    if (missionsQuery.data?.[0] && !form.getValues('missionId')) {
      form.setValue('missionId', missionsQuery.data[0].id);
    }
  }, [missionsQuery.data, form]);

  useEffect(() => {
    form.setValue('colonyId', '');
  }, [missionId, form]);

  if (missionsQuery.isLoading) {
    return (
      <AppScreenLayout>
        <ListSkeleton count={2} />
      </AppScreenLayout>
    );
  }

  if (!missionsQuery.data?.length) {
    return (
      <AppScreenLayout>
        <EmptyState
          title="No missions available"
          message="You need mission membership with operator role to report incidents."
        />
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="text-center text-astra-primary">Go back</Text>
        </Pressable>
      </AppScreenLayout>
    );
  }

  const missionOptions = missionsQuery.data.map((m) => ({
    value: m.id,
    label: m.code,
  }));

  const colonyOptions = [
    { value: '' as const, label: 'None' },
    ...(coloniesQuery.data ?? []).map((c) => ({ value: c.id, label: c.code })),
  ];

  const severityOptions = INCIDENT_SEVERITIES.map((s) => ({ value: s, label: s }));

  return (
    <AppScreenLayout>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={missionsQuery.isRefetching}
            onRefresh={() => missionsQuery.refetch()}
            tintColor="#3b82f6"
          />
        }
      >
        <Pressable onPress={() => router.back()} className="mb-4">
          <Text className="text-sm text-astra-primary">← Back</Text>
        </Pressable>

        <ScreenHeader title="Report Incident" subtitle="Document an operational event" />

        <Text className="mb-4 text-xs text-astra-muted">
          Draft auto-saves locally while you type (SecureStore).
        </Text>

        {errorMessage ? (
          <View className="mb-4 rounded-lg border border-astra-danger/50 bg-astra-danger/10 p-3">
            <Text className="text-sm text-astra-danger">{errorMessage}</Text>
          </View>
        ) : null}

        <Controller
          control={form.control}
          name="missionId"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <View>
              <OptionPicker label="Mission" options={missionOptions} value={value} onChange={onChange} />
              {error ? <Text className="mb-2 text-sm text-astra-danger">{error.message}</Text> : null}
            </View>
          )}
        />

        <Controller
          control={form.control}
          name="colonyId"
          render={({ field: { value, onChange } }) => (
            <OptionPicker
              label="Colony (optional)"
              options={colonyOptions}
              value={value ?? ''}
              onChange={onChange}
            />
          )}
        />

        <Controller
          control={form.control}
          name="severity"
          render={({ field: { value, onChange } }) => (
            <OptionPicker label="Severity" options={severityOptions} value={value} onChange={onChange} />
          )}
        />

        <FormField
          control={form.control}
          name="title"
          label="Title"
          placeholder="Brief incident title"
          maxLength={INCIDENT_TITLE_MAX}
          autoCapitalize="sentences"
        />

        <FormField
          control={form.control}
          name="description"
          label="Description"
          placeholder="Describe what happened, systems affected, and immediate actions taken..."
          maxLength={INCIDENT_DESCRIPTION_MAX}
          multiline
          autoCapitalize="sentences"
        />

        <LocationCaptureSection
          coords={location.coords}
          status={location.status}
          message={
            Platform.OS === 'web' && location.status === 'idle'
              ? 'GPS works best on a physical device. On web, location may be approximate or unavailable.'
              : location.message
          }
          isCapturing={location.isCapturing}
          onCapture={location.captureLocation}
          onClear={location.clearLocation}
        />

        <AttachmentSection
          attachments={attachments.attachments}
          error={attachments.error}
          onTakePhoto={attachments.takePhoto}
          onPickGallery={attachments.pickFromGallery}
          onRemove={attachments.removeAttachment}
        />

        <Button
          title="Submit Report"
          onPress={() => submit(location.coords, attachments.attachments)}
          loading={isPending}
        />
      </ScrollView>
    </AppScreenLayout>
  );
}
