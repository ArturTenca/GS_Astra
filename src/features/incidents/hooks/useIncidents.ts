import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { queryKeys } from '@/constants/query-keys';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useIncidentDraft } from '@/features/incidents/hooks/useIncidentDraft';
import {
  createIncidentSchema,
  type CreateIncidentFormValues,
  updateIncidentStatusSchema,
  type UpdateIncidentStatusFormValues,
} from '@/features/incidents/schemas/incident.schema';
import { getUserFacingMessage } from '@/lib/errors';
import { recordAuditEvent } from '@/services/audit/audit.service';
import type { LocationCoords } from '@/hooks/useLocationCapture';
import { attachmentRepository, incidentRepository } from '@/services/repositories';
import type { PendingAttachment } from '@/types/attachment.types';
import type { IncidentFilters } from '@/types/domain';

export function useIncidents(filters: IncidentFilters) {
  return useQuery({
    queryKey: [...queryKeys.incidents(), filters],
    queryFn: () => incidentRepository.list(filters),
    refetchOnMount: 'always',
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

export function useIncidentAttachments(incidentId: string) {
  return useQuery({
    queryKey: queryKeys.incidentAttachments(incidentId),
    queryFn: () => attachmentRepository.listByIncident(incidentId),
    enabled: Boolean(incidentId),
  });
}

type CreateIncidentPayload = {
  values: CreateIncidentFormValues;
  location: LocationCoords | null;
  attachments: PendingAttachment[];
};

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

  const { clearDraft } = useIncidentDraft(form);

  const mutation = useMutation({
    mutationFn: async ({ values, location, attachments }: CreateIncidentPayload) => {
      if (!userId) {
        throw new Error('Not authenticated');
      }

      const incident = await incidentRepository.create({
        missionId: values.missionId,
        colonyId: values.colonyId || null,
        reporterId: userId,
        title: values.title,
        description: values.description,
        severity: values.severity,
        latitude: location?.latitude ?? null,
        longitude: location?.longitude ?? null,
      });

      if (attachments.length > 0) {
        await attachmentRepository.uploadMany(incident.id, userId, attachments);
      }

      return incident;
    },
    onSuccess: async (incident, variables) => {
      await recordAuditEvent(userId, {
        action: 'incident.created',
        resourceType: 'incident',
        resourceId: incident.id,
        metadata: { severity: incident.severity },
      });
      if (variables.attachments.length > 0) {
        await recordAuditEvent(userId, {
          action: 'incident.attachment_uploaded',
          resourceType: 'incident',
          resourceId: incident.id,
          metadata: { count: variables.attachments.length },
        });
      }
      await clearDraft();
      void queryClient.invalidateQueries({ queryKey: queryKeys.incidents() });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard() });
      router.replace(
        `/(app)/incidents/success?incidentId=${incident.id}&action=created` as Href,
      );
    },
  });

  const submit = (location: LocationCoords | null, attachments: PendingAttachment[]) => {
    void form.handleSubmit((values) => {
      mutation.mutate({ values, location, attachments });
    })();
  };

  return {
    form,
    submit,
    isPending: mutation.isPending,
    errorMessage: mutation.error ? getUserFacingMessage(mutation.error) : null,
  };
}

export function useUpdateIncidentStatus(incidentId: string) {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

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
    onSuccess: async (_data, variables) => {
      await recordAuditEvent(userId, {
        action: 'incident.status_updated',
        resourceType: 'incident',
        resourceId: incidentId,
        metadata: { status: variables.status },
      });
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
