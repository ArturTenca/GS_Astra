import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { queryKeys } from '@/constants/query-keys';
import { useMission } from '@/features/dashboard/hooks/useDashboard';
import {
  missionFormSchema,
  type MissionFormValues,
} from '@/features/missions/schemas/mission.schema';
import { missionRepository } from '@/services/repositories/mission.repository';
import type { Mission } from '@/types/domain';

const defaultValues: MissionFormValues = {
  name: '',
  code: '',
  description: '',
  status: 'planned',
};

export function useMissionMutations(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.missions() });
    void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard() });
    void queryClient.invalidateQueries({ queryKey: queryKeys.colonies() });
  };

  const create = useMutation({
    mutationFn: (values: MissionFormValues) =>
      missionRepository.create({
        name: values.name,
        code: values.code,
        description: values.description || null,
        status: values.status,
      }),
    onSuccess: () => {
      invalidate();
      onSuccess?.();
    },
  });

  const update = useMutation({
    mutationFn: ({ id, values }: { id: string; values: MissionFormValues }) =>
      missionRepository.update({
        id,
        name: values.name,
        code: values.code,
        description: values.description || null,
        status: values.status,
      }),
    onSuccess: (_data, variables) => {
      invalidate();
      void queryClient.invalidateQueries({ queryKey: queryKeys.mission(variables.id) });
      onSuccess?.();
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => missionRepository.delete(id),
    onSuccess: () => {
      invalidate();
      onSuccess?.();
    },
  });

  return { create, update, remove };
}

export function useMissionForm(missionId: string | null, enabled: boolean) {
  const missionQuery = useMission(missionId ?? '');

  const form = useForm<MissionFormValues>({
    resolver: zodResolver(missionFormSchema),
    defaultValues,
    mode: 'onBlur',
  });

  useEffect(() => {
    if (!enabled || !missionQuery.data) return;
    const mission: Mission = missionQuery.data;
    form.reset({
      name: mission.name,
      code: mission.code,
      description: mission.description ?? '',
      status: mission.status,
    });
  }, [enabled, missionQuery.data, form]);

  useEffect(() => {
    if (enabled && !missionId) {
      form.reset(defaultValues);
    }
  }, [enabled, missionId, form]);

  return { form, missionQuery };
}
