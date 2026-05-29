import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { queryKeys } from '@/constants/query-keys';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  createIncidentSchema,
  type CreateIncidentFormValues,
  updateIncidentStatusSchema,
  type UpdateIncidentStatusFormValues,
} from '@/features/incidents/schemas/incident.schema';
import { getUserFacingMessage } from '@/lib/errors';
import { incidentRepository } from '@/services/repositories';
import type { IncidentFilters } from '@/types/domain';

export function useIncidents(filters: IncidentFilters) {
  return useQuery({
    queryKey: [...queryKeys.incidents(), filters],
    queryFn: () => incidentRepository.list(filters),
  });
}

export function useIncident(id: string) {
  return useQuery({
    queryKey: queryKeys.incident(id),
    queryFn: () => incidentRepository.getById(id),
    enabled: Boolean(id),
  });
}

export function useIncidentHistory(incidentId: string) {
  return useQuery({
    queryKey: ['incident-history', incidentId],
    queryFn: () => incidentRepository.listStatusHistory(incidentId),
    enabled: Boolean(incidentId),
  });
}

export function useCreateIncident() {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  const form = useForm<CreateIncidentFormValues>({
    resolver: zodResolver(createIncidentSchema),
    defaultValues: {
      missionId: '',
      colonyId: '',
      title: '',
      description: '',
      severity: 'medium',
    },
    mode: 'onBlur',
  });

  const mutation = useMutation({
    mutationFn: async (values: CreateIncidentFormValues) => {
      if (!userId) {
        throw new Error('Not authenticated');
      }
      return incidentRepository.create({
        missionId: values.missionId,
        colonyId: values.colonyId || null,
        reporterId: userId,
        title: values.title,
        description: values.description,
        severity: values.severity,
      });
    },
    onSuccess: (incident) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.incidents() });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard() });
      router.replace(
        `/(app)/incidents/success?incidentId=${incident.id}&action=created` as Href,
      );
    },
  });

  const onSubmit = form.handleSubmit((values) => mutation.mutate(values));

  return {
    form,
    onSubmit,
    isPending: mutation.isPending,
    errorMessage: mutation.error ? getUserFacingMessage(mutation.error) : null,
  };
}

export function useUpdateIncidentStatus(incidentId: string) {
  const queryClient = useQueryClient();

  const form = useForm<UpdateIncidentStatusFormValues>({
    resolver: zodResolver(updateIncidentStatusSchema),
    defaultValues: { status: 'investigating', note: '' },
    mode: 'onBlur',
  });

  const mutation = useMutation({
    mutationFn: (values: UpdateIncidentStatusFormValues) =>
      incidentRepository.updateStatus({
        incidentId,
        status: values.status,
        note: values.note,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.incident(incidentId) });
      void queryClient.invalidateQueries({ queryKey: ['incident-history', incidentId] });
      void queryClient.invalidateQueries({ queryKey: queryKeys.incidents() });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard() });
      router.replace(
        `/(app)/incidents/success?incidentId=${incidentId}&action=updated` as Href,
      );
    },
  });

  const onSubmit = form.handleSubmit((values) => mutation.mutate(values));

  return {
    form,
    onSubmit,
    isPending: mutation.isPending,
    errorMessage: mutation.error ? getUserFacingMessage(mutation.error) : null,
  };
}

export function useIncidentFilters() {
  const [status, setStatus] = useState<IncidentFilters['status']>('all');
  const [severity, setSeverity] = useState<IncidentFilters['severity']>('all');

  return {
    filters: { status, severity } satisfies IncidentFilters,
    setStatus,
    setSeverity,
  };
}
