import { z } from 'zod';
import { sanitizeDisplayName } from '@/lib/sanitize';
import { todayLocalISODate } from '@/lib/dates/alert-dates';
import { ALERT_SEVERITIES } from '@/types/alert.types';

export const ALERT_TITLE_MAX = 160;
export const ALERT_MESSAGE_MAX = 2000;

const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use a valid date')
  .refine((d) => d >= todayLocalISODate(), 'Deadline cannot be in the past');

export const alertFormSchema = z.object({
  missionId: z.string().uuid('Select a mission'),
  colonyId: z.union([z.string().uuid(), z.literal('')]),
  title: z
    .string()
    .trim()
    .min(2, 'Title must be at least 2 characters')
    .max(ALERT_TITLE_MAX)
    .transform(sanitizeDisplayName),
  message: z
    .string()
    .trim()
    .min(2, 'Message must be at least 2 characters')
    .max(ALERT_MESSAGE_MAX),
  severity: z.enum(ALERT_SEVERITIES),
  hasDeadline: z.boolean(),
  activeUntil: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.hasDeadline) {
    const parsed = isoDateSchema.safeParse(data.activeUntil ?? '');
    if (!parsed.success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: parsed.error.errors[0]?.message ?? 'Select a deadline date',
        path: ['activeUntil'],
      });
    }
  }
});

export type AlertFormValues = z.infer<typeof alertFormSchema>;
