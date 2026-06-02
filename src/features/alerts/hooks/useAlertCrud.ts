import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { queryKeys } from '@/constants/query-keys';
import {
  alertFormSchema,
  type AlertFormValues,
} from '@/features/alerts/schemas/alert.schema';
import { todayLocalISODate } from '@/lib/dates/alert-dates';
import { alertRepository } from '@/services/repositories/alert.repository';
import type { Alert } from '@/types/alert.types';

const defaultValues: AlertFormValues = {
  missionId: '',
  colonyId: '',
  title: '',
  message: '',
  severity: 'info',
  hasDeadline: true,
  activeUntil: todayLocalISODate(),
};

function toFormValues(alert: Alert): AlertFormValues {
  return {
    missionId: alert.missionId,
    colonyId: alert.colonyId ?? '',
    title: alert.title,
    message: alert.message,
    severity: alert.severity,
    hasDeadline: alert.activeUntil != null,
    activeUntil: alert.activeUntil ?? todayLocalISODate(),
  };
}

function toCreatePayload(values: AlertFormValues) {
  return {
    missionId: values.missionId,
    colonyId: values.colonyId?.trim() ? values.colonyId : null,
    title: values.title,
    message: values.message,
    severity: values.severity,
    activeUntil: values.hasDeadline ? (values.activeUntil ?? null) : null,
  };
}

export function useAlertMutations(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.alerts() });
    void queryClient.invalidateQueries({ queryKey: queryKeys.alertsUnacknowledgedCount() });
    void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard() });
  };

  const create = useMutation({
    mutationFn: (values: AlertFormValues) => alertRepository.create(toCreatePayload(values)),
    onSuccess: () => {
      invalidate();
      onSuccess?.();
    },
  });

  const update = useMutation({
    mutationFn: ({ id, values }: { id: string; values: AlertFormValues }) =>
      alertRepository.update({
        id,
        ...toCreatePayload(values),
      }),
    onSuccess: (_data, variables) => {
      invalidate();
      void queryClient.invalidateQueries({ queryKey: queryKeys.alert(variables.id) });
      onSuccess?.();
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => alertRepository.delete(id),
    onSuccess: () => {
      invalidate();
      onSuccess?.();
    },
  });

  return { create, update, remove };
}

export function useAlertForm(alertId: string | null, enabled: boolean) {
  const alertQuery = useQuery({
    queryKey: queryKeys.alert(alertId ?? ''),
    queryFn: () => alertRepository.getById(alertId!),
    enabled: Boolean(alertId) && enabled,
  });

  const form = useForm<AlertFormValues>({
    resolver: zodResolver(alertFormSchema),
    defaultValues,
    mode: 'onBlur',
  });

  useEffect(() => {
    if (!enabled || !alertQuery.data) return;
    form.reset(toFormValues(alertQuery.data));
  }, [enabled, alertQuery.data, form]);

  useEffect(() => {
    if (enabled && !alertId) {
      form.reset({
        ...defaultValues,
        activeUntil: todayLocalISODate(),
      });
    }
  }, [enabled, alertId, form]);

  return { form, alertQuery };
}
