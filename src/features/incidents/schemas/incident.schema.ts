import { z } from 'zod';
import { sanitizeDisplayName } from '@/lib/sanitize';
import { INCIDENT_SEVERITIES, INCIDENT_STATUSES } from '@/types/domain';

export const INCIDENT_TITLE_MAX = 120;
export const INCIDENT_DESCRIPTION_MAX = 4000;
export const INCIDENT_NOTE_MAX = 500;

export const createIncidentSchema = z.object({
  missionId: z.string().uuid('Select a mission'),
  colonyId: z.union([z.string().uuid(), z.literal('')]),
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(INCIDENT_TITLE_MAX, `Title must be at most ${INCIDENT_TITLE_MAX} characters`)
    .transform(sanitizeDisplayName),
  description: z
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(
      INCIDENT_DESCRIPTION_MAX,
      `Description must be at most ${INCIDENT_DESCRIPTION_MAX} characters`,
    )
    .transform((v) => v.replace(/[\u0000-\u001F\u007F<>]/g, '').trim()),
  severity: z.enum(INCIDENT_SEVERITIES),
});

export type CreateIncidentFormValues = z.infer<typeof createIncidentSchema>;

export const updateIncidentStatusSchema = z.object({
  status: z.enum(INCIDENT_STATUSES),
  note: z
    .string()
    .max(INCIDENT_NOTE_MAX, `Note must be at most ${INCIDENT_NOTE_MAX} characters`)
    .optional(),
});

export type UpdateIncidentStatusFormValues = z.infer<typeof updateIncidentStatusSchema>;

export const updateIncidentSchema = z.object({
  missionId: z.string().uuid('Select a mission'),
  colonyId: z.union([z.string().uuid(), z.literal('')]),
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(INCIDENT_TITLE_MAX)
    .transform(sanitizeDisplayName),
  description: z
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(INCIDENT_DESCRIPTION_MAX)
    .transform((v) => v.replace(/[\u0000-\u001F\u007F<>]/g, '').trim()),
  severity: z.enum(INCIDENT_SEVERITIES),
  status: z.enum(INCIDENT_STATUSES),
  note: z.string().max(INCIDENT_NOTE_MAX).optional(),
});

export type UpdateIncidentFormValues = z.infer<typeof updateIncidentSchema>;
