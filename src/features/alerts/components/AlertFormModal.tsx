import { Controller } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { CalendarPicker } from '@/components/ui/CalendarPicker';
import { FormField } from '@/components/ui/FormField';
import { OptionPicker } from '@/components/ui/OptionPicker';
import { QuickViewModalShell } from '@/components/ui/QuickViewModalShell';
import { ListSkeleton } from '@/components/ui/Skeleton';
import { useColonies, useMissions } from '@/features/dashboard/hooks/useDashboard';
import { useAlertForm, useAlertMutations } from '@/features/alerts/hooks/useAlertCrud';
import {
  ALERT_MESSAGE_MAX,
  ALERT_TITLE_MAX,
} from '@/features/alerts/schemas/alert.schema';
import { formatDisplayDate } from '@/lib/dates/alert-dates';
import { getUserFacingMessage } from '@/lib/errors';
import { ALERT_SEVERITIES } from '@/types/alert.types';

type AlertFormModalProps = {
  visible: boolean;
  alertId: string | null;
  onClose: () => void;
};

export function AlertFormModal({ visible, alertId, onClose }: AlertFormModalProps) {
  const isEdit = alertId != null;
  const mutations = useAlertMutations(onClose);
  const { form, alertQuery } = useAlertForm(alertId, visible);
  const missionsQuery = useMissions();
  const missionId = form.watch('missionId');
  const coloniesQuery = useColonies(missionId || undefined);
  const hasDeadline = form.watch('hasDeadline');

  const isPending = mutations.create.isPending || mutations.update.isPending;
  const error =
    mutations.create.error ?? mutations.update.error ?? alertQuery.error ?? null;

  const missionOptions =
    missionsQuery.data?.map((m) => ({ value: m.id, label: `${m.name} (${m.code})` })) ?? [];

  const colonyOptions = [
    { value: '', label: 'No colony' },
    ...(coloniesQuery.data?.map((c) => ({ value: c.id, label: `${c.name} (${c.code})` })) ?? []),
  ];

  const severityOptions = ALERT_SEVERITIES.map((s) => ({ value: s, label: s }));

  const onSubmit = form.handleSubmit((values) => {
    if (isEdit && alertId) {
      mutations.update.mutate({ id: alertId, values });
    } else {
      mutations.create.mutate(values);
    }
  });

  return (
    <QuickViewModalShell
      visible={visible}
      title={isEdit ? 'Edit alert' : 'New alert'}
      onClose={onClose}
      showScrollIndicator
    >
      {isEdit && alertQuery.isLoading ? <ListSkeleton count={2} /> : null}

      {error ? (
        <View className="mb-4 rounded-lg border border-astra-danger/50 bg-astra-danger/10 p-3">
          <Text className="text-sm text-astra-danger">{getUserFacingMessage(error)}</Text>
        </View>
      ) : null}

      <Controller
        control={form.control}
        name="missionId"
        render={({ field: { value, onChange } }) => (
          <OptionPicker
            label="Mission"
            options={missionOptions}
            value={value}
            onChange={(id) => {
              onChange(id);
              form.setValue('colonyId', '');
            }}
          />
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

      <FormField
        control={form.control}
        name="title"
        label="Title"
        placeholder="Power fluctuation in Habitat B"
        maxLength={ALERT_TITLE_MAX}
        autoCapitalize="sentences"
      />
      <FormField
        control={form.control}
        name="message"
        label="Message"
        placeholder="Describe the operational alert..."
        maxLength={ALERT_MESSAGE_MAX}
        multiline
        autoCapitalize="sentences"
      />

      <Controller
        control={form.control}
        name="severity"
        render={({ field: { value, onChange } }) => (
          <OptionPicker label="Severity" options={severityOptions} value={value} onChange={onChange} />
        )}
      />

      <Text className="mb-2 text-xs font-semibold uppercase tracking-wider text-astra-muted">
        Active until (calendar)
      </Text>
      <Text className="mb-3 text-sm text-astra-muted">
        The alert stays active until the end of the selected day, then moves to expired.
      </Text>

      <Controller
        control={form.control}
        name="hasDeadline"
        render={({ field: { value, onChange } }) => (
          <View className="mb-3 flex-row gap-2">
            <Pressable
              onPress={() => onChange(true)}
              className={`flex-1 rounded-xl border px-3 py-2.5 ${
                value ? 'border-astra-primary bg-astra-primary/15' : 'border-astra-border'
              }`}
            >
              <Text
                className={`text-center text-sm font-semibold ${value ? 'text-astra-primary' : 'text-astra-muted'}`}
              >
                Set deadline
              </Text>
            </Pressable>
            <Pressable
              onPress={() => onChange(false)}
              className={`flex-1 rounded-xl border px-3 py-2.5 ${
                !value ? 'border-astra-primary bg-astra-primary/15' : 'border-astra-border'
              }`}
            >
              <Text
                className={`text-center text-sm font-semibold ${!value ? 'text-astra-primary' : 'text-astra-muted'}`}
              >
                No deadline
              </Text>
            </Pressable>
          </View>
        )}
      />

      {hasDeadline ? (
        <Controller
          control={form.control}
          name="activeUntil"
          render={({ field: { value, onChange }, fieldState: { error: fieldError } }) => (
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-astra-text">
                Selected: {formatDisplayDate(value ?? null)}
              </Text>
              <CalendarPicker value={value ?? null} onChange={onChange} />
              {fieldError ? (
                <Text className="mt-2 text-sm text-astra-danger">{fieldError.message}</Text>
              ) : null}
            </View>
          )}
        />
      ) : null}

      <Button
        title={isEdit ? 'Save changes' : 'Create alert'}
        onPress={onSubmit}
        loading={isPending}
      />
      <View className="mt-2">
        <Button title="Cancel" onPress={onClose} variant="ghost" />
      </View>
    </QuickViewModalShell>
  );
}
