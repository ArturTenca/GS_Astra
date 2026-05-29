import { router } from 'expo-router';
import { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { AppScreenLayout } from '@/components/layout/AppScreenLayout';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { OptionPicker } from '@/components/ui/OptionPicker';
import { EmptyState, LoadingState, ScreenHeader } from '@/components/ui/ScreenPrimitives';
import { useMissions, useColonies } from '@/features/dashboard/hooks/useDashboard';
import { useCreateIncident } from '@/features/incidents/hooks/useIncidents';
import {
  INCIDENT_DESCRIPTION_MAX,
  INCIDENT_TITLE_MAX,
} from '@/features/incidents/schemas/incident.schema';
import { INCIDENT_SEVERITIES } from '@/types/domain';

export default function CreateIncidentScreen() {
  const { form, onSubmit, isPending, errorMessage } = useCreateIncident();
  const missionsQuery = useMissions();
  const missionId = form.watch('missionId');
  const coloniesQuery = useColonies(missionId || undefined);

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
        <LoadingState />
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()} className="mb-4">
          <Text className="text-sm text-astra-primary">← Back</Text>
        </Pressable>

        <ScreenHeader title="Report Incident" subtitle="Document an operational event" />

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

        <Button title="Submit Report" onPress={onSubmit} loading={isPending} />
      </ScrollView>
    </AppScreenLayout>
  );
}
