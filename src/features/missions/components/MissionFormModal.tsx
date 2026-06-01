import { Controller } from 'react-hook-form';
import { Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { OptionPicker } from '@/components/ui/OptionPicker';
import { QuickViewModalShell } from '@/components/ui/QuickViewModalShell';
import { ListSkeleton } from '@/components/ui/Skeleton';
import {
  useMissionForm,
  useMissionMutations,
} from '@/features/missions/hooks/useMissionCrud';
import {
  MISSION_CODE_MAX,
  MISSION_DESCRIPTION_MAX,
  MISSION_NAME_MAX,
} from '@/features/missions/schemas/mission.schema';
import { getUserFacingMessage } from '@/lib/errors';
import { MISSION_STATUSES } from '@/types/domain';

type MissionFormModalProps = {
  visible: boolean;
  missionId: string | null;
  onClose: () => void;
};

export function MissionFormModal({ visible, missionId, onClose }: MissionFormModalProps) {
  const isEdit = missionId != null;
  const closeAll = () => onClose();

  const mutations = useMissionMutations(closeAll);
  const { form, missionQuery } = useMissionForm(missionId, visible);

  const isPending = mutations.create.isPending || mutations.update.isPending;
  const error =
    mutations.create.error ?? mutations.update.error ?? missionQuery.error ?? null;

  const statusOptions = MISSION_STATUSES.map((s) => ({ value: s, label: s }));

  const onSubmit = form.handleSubmit((values) => {
    if (isEdit && missionId) {
      mutations.update.mutate({ id: missionId, values });
    } else {
      mutations.create.mutate(values);
    }
  });

  return (
    <QuickViewModalShell
      visible={visible}
      title={isEdit ? 'Edit mission' : 'New mission'}
      onClose={closeAll}
    >
      {isEdit && missionQuery.isLoading ? <ListSkeleton count={2} /> : null}

      {error ? (
        <View className="mb-4 rounded-lg border border-astra-danger/50 bg-astra-danger/10 p-3">
          <Text className="text-sm text-astra-danger">{getUserFacingMessage(error)}</Text>
        </View>
      ) : null}

      <FormField
        control={form.control}
        name="name"
        label="Name"
        placeholder="Artemis Surface Support"
        maxLength={MISSION_NAME_MAX}
      />
      <FormField
        control={form.control}
        name="code"
        label="Code"
        placeholder="ART-01"
        maxLength={MISSION_CODE_MAX}
        autoCapitalize="characters"
      />
      <FormField
        control={form.control}
        name="description"
        label="Description"
        placeholder="Mission objectives..."
        maxLength={MISSION_DESCRIPTION_MAX}
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
        title={isEdit ? 'Save changes' : 'Create mission'}
        onPress={onSubmit}
        loading={isPending}
      />
      <View className="mt-2">
        <Button title="Cancel" onPress={closeAll} variant="ghost" />
      </View>
    </QuickViewModalShell>
  );
}
