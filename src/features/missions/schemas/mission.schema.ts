import { z } from 'zod';
import { sanitizeDisplayName } from '@/lib/sanitize';
import { MISSION_STATUSES } from '@/types/domain';

export const MISSION_NAME_MAX = 120;
export const MISSION_CODE_MAX = 16;
export const MISSION_DESCRIPTION_MAX = 2000;

export const missionFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(MISSION_NAME_MAX)
    .transform(sanitizeDisplayName),
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9-]{2,16}$/, 'Code: 2–16 chars, uppercase letters, numbers, hyphen'),
  description: z
    .string()
    .max(MISSION_DESCRIPTION_MAX)
    .transform((v) => v.trim()),
  status: z.enum(MISSION_STATUSES),
});

export type MissionFormValues = z.infer<typeof missionFormSchema>;
