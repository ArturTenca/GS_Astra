import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { queryKeys } from '@/constants/query-keys';
import { useColony } from '@/features/dashboard/hooks/useDashboard';
import {
  colonyFormSchema,
  type ColonyFormValues,
} from '@/features/colonies/schemas/colony.schema';
import { colonyRepository } from '@/services/repositories/colony.repository';
import type { Colony } from '@/types/domain';

const defaultValues: ColonyFormValues = {
  missionId: '',
  name: '',
  code: '',
  locationLabel: '',
  environmentSummary: '',
  status: 'operational',
};

export function useColonyMutations(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.colonies() });
    void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard() });
    void queryClient.invalidateQueries({ queryKey: queryKeys.missions() });
  };

  const create = useMutation({
    mutationFn: (values: ColonyFormValues) =>
      colonyRepository.create({
        missionId: values.missionId,
        name: values.name,
        code: values.code,
        locationLabel: values.locationLabel || null,
        environmentSummary: values.environmentSummary || null,
        status: values.status,
      }),
    onSuccess: () => {
      invalidate();
      onSuccess?.();
    },
  });

  const update = useMutation({
    mutationFn: ({ id, values }: { id: string; values: ColonyFormValues }) =>
      colonyRepository.update({
        id,
        name: values.name,
        code: values.code,
        locationLabel: values.locationLabel || null,
        environmentSummary: values.environmentSummary || null,
        status: values.status,
      }),
    onSuccess: (_data, variables) => {
      invalidate();
      void queryClient.invalidateQueries({ queryKey: queryKeys.colony(variables.id) });
      onSuccess?.();
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => colonyRepository.delete(id),
    onSuccess: () => {
      invalidate();
      onSuccess?.();
    },
  });

  return { create, update, remove };
}

export function useColonyForm(colonyId: string | null, enabled: boolean, defaultMissionId?: string) {
  const colonyQuery = useColony(colonyId ?? '');

  const form = useForm<ColonyFormValues>({
    resolver: zodResolver(colonyFormSchema),
    defaultValues: {
      ...defaultValues,
      missionId: defaultMissionId ?? '',
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    if (!enabled || !colonyQuery.data) return;
    const colony: Colony = colonyQuery.data;
    form.reset({
      missionId: colony.missionId,
      name: colony.name,
      code: colony.code,
      locationLabel: colony.locationLabel ?? '',
      environmentSummary: colony.environmentSummary ?? '',
      status: colony.status,
    });
  }, [enabled, colonyQuery.data, form]);

  useEffect(() => {
    if (enabled && !colonyId) {
      form.reset({
        ...defaultValues,
        missionId: defaultMissionId ?? '',
      });
    }
  }, [enabled, colonyId, defaultMissionId, form]);

  return { form, colonyQuery };
}
