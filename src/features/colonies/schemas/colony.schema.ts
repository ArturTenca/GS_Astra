import { z } from 'zod';
import { sanitizeDisplayName } from '@/lib/sanitize';
import { COLONY_STATUSES } from '@/types/domain';

export const COLONY_NAME_MAX = 120;
export const COLONY_CODE_MAX = 32;
export const COLONY_TEXT_MAX = 500;

export const colonyFormSchema = z.object({
  missionId: z.string().uuid('Select a mission'),
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(COLONY_NAME_MAX)
    .transform(sanitizeDisplayName),
  code: z
    .string()
    .trim()
    .min(2, 'Code must be at least 2 characters')
    .max(COLONY_CODE_MAX)
    .transform((v) => v.toUpperCase()),
  locationLabel: z.string().max(COLONY_TEXT_MAX).transform((v) => v.trim()),
  environmentSummary: z.string().max(COLONY_TEXT_MAX).transform((v) => v.trim()),
  status: z.enum(COLONY_STATUSES),
});

export type ColonyFormValues = z.infer<typeof colonyFormSchema>;
