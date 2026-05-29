import { z } from 'zod';
import { sanitizeDisplayName } from '@/lib/sanitize';
import {
  EMAIL_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from './login.schema';

const DISPLAY_NAME_MAX = 64;
const DISPLAY_NAME_MIN = 2;

const displayNameSchema = z
  .string()
  .trim()
  .min(DISPLAY_NAME_MIN, `Display name must be at least ${DISPLAY_NAME_MIN} characters`)
  .max(DISPLAY_NAME_MAX, `Display name must be at most ${DISPLAY_NAME_MAX} characters`)
  .regex(
    /^[\p{L}\p{N}\s'.-]+$/u,
    'Display name contains invalid characters',
  )
  .transform(sanitizeDisplayName);

const emailSchema = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .max(EMAIL_MAX_LENGTH, `Email must be at most ${EMAIL_MAX_LENGTH} characters`)
  .email('Invalid email address');

const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
  .max(PASSWORD_MAX_LENGTH, `Password must be at most ${PASSWORD_MAX_LENGTH} characters`)
  .regex(/[A-Z]/, 'Include at least one uppercase letter')
  .regex(/[a-z]/, 'Include at least one lowercase letter')
  .regex(/[0-9]/, 'Include at least one number');

export const registerSchema = z
  .object({
    displayName: displayNameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z
      .string()
      .max(PASSWORD_MAX_LENGTH, `Password must be at most ${PASSWORD_MAX_LENGTH} characters`),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const FIELD_LIMITS = {
  email: EMAIL_MAX_LENGTH,
  password: PASSWORD_MAX_LENGTH,
  displayName: DISPLAY_NAME_MAX,
} as const;
