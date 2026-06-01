import { Controller } from 'react-hook-form';
import { Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { OptionPicker } from '@/components/ui/OptionPicker';
import { QuickViewModalShell } from '@/components/ui/QuickViewModalShell';
import { ListSkeleton } from '@/components/ui/Skeleton';
import { useMissions } from '@/features/dashboard/hooks/useDashboard';
import {
  useColonyForm,
  useColonyMutations,
} from '@/features/colonies/hooks/useColonyCrud';
import {
  COLONY_CODE_MAX,
  COLONY_NAME_MAX,
  COLONY_TEXT_MAX,
} from '@/features/colonies/schemas/colony.schema';
import { getUserFacingMessage } from '@/lib/errors';
import { COLONY_STATUSES } from '@/types/domain';

type ColonyFormModalProps = {
  visible: boolean;
  colonyId: string | null;
  defaultMissionId?: string;
  onClose: () => void;
};

export function ColonyFormModal({
  visible,
  colonyId,
  defaultMissionId,
  onClose,
}: ColonyFormModalProps) {
  const isEdit = colonyId != null;
  const missionsQuery = useMissions();
  const mutations = useColonyMutations(onClose);
  const { form, colonyQuery } = useColonyForm(colonyId, visible, defaultMissionId);

  const isPending = mutations.create.isPending || mutations.update.isPending;
  const error =
    mutations.create.error ?? mutations.update.error ?? colonyQuery.error ?? null;

  const missionOptions =
    missionsQuery.data?.map((m) => ({ value: m.id, label: `${m.name} (${m.code})` })) ?? [];

  const statusOptions = COLONY_STATUSES.map((s) => ({ value: s, label: s }));

  const onSubmit = form.handleSubmit((values) => {
    if (isEdit && colonyId) {
      mutations.update.mutate({ id: colonyId, values });
    } else {
      mutations.create.mutate(values);
    }
  });

  return (
    <QuickViewModalShell
      visible={visible}
      title={isEdit ? 'Edit colony' : 'New colony'}
      onClose={onClose}
    >
      {isEdit && colonyQuery.isLoading ? <ListSkeleton count={2} /> : null}

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
            onChange={onChange}
          />
        )}
      />
      <FormField
        control={form.control}
        name="name"
        label="Name"
        placeholder="Shackleton Base Alpha"
        maxLength={COLONY_NAME_MAX}
      />
      <FormField
        control={form.control}
        name="code"
        label="Code"
        placeholder="SBA-1"
        maxLength={COLONY_CODE_MAX}
        autoCapitalize="characters"
      />
      <FormField
        control={form.control}
        name="locationLabel"
        label="Location"
        placeholder="Lunar South Pole"
        maxLength={COLONY_TEXT_MAX}
        autoCapitalize="sentences"
      />
      <FormField
        control={form.control}
        name="environmentSummary"
        label="Environment"
        placeholder="O2 stable · temp nominal"
        maxLength={COLONY_TEXT_MAX}
        multiline
        autoCapitalize="sentences"
      />
      <Controller
        control={form.control}
        name="status"
        render={({ field: { value, onChange } }) => (
          <OptionPicker label="Status" options={statusOptions} value={value} onChange={onChange} />
        )}
      />

      <Button
        title={isEdit ? 'Save changes' : 'Create colony'}
        onPress={onSubmit}
        loading={isPending}
      />
      <View className="mt-2">
        <Button title="Cancel" onPress={onClose} variant="ghost" />
      </View>
    </QuickViewModalShell>
  );
}
