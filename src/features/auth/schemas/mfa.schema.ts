import { z } from 'zod';

export const mfaCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'Enter the 6-digit code from your authenticator app'),
});

export type MfaCodeFormValues = z.infer<typeof mfaCodeSchema>;
