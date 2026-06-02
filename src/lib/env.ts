import Constants from 'expo-constants';
import { z } from 'zod';

function rejectServiceRoleKey(value: string): boolean {
  const lower = value.toLowerCase();
  return !lower.includes('service_role') && !lower.includes('service-role');
}

const envSchema = z.object({
  EXPO_PUBLIC_SUPABASE_URL: z
    .string({
      required_error:
        'EXPO_PUBLIC_SUPABASE_URL is missing. Create a .env file from .env.example and restart Expo.',
    })
    .url('EXPO_PUBLIC_SUPABASE_URL must be a valid URL'),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: z
    .string({
      required_error:
        'EXPO_PUBLIC_SUPABASE_ANON_KEY is missing. Create a .env file from .env.example and restart Expo.',
    })
    .min(1, 'EXPO_PUBLIC_SUPABASE_ANON_KEY is required')
    .refine(
      rejectServiceRoleKey,
      'Never use the Supabase service_role key in the mobile app. Use the anon (public) key only.',
    ),
});

function getEnvValues() {
  const extra = Constants.expoConfig?.extra as Record<string, string | undefined> | undefined;

  // Vercel/CI: EXPO_PUBLIC_* at build time; dev: .env via dotenv in app.config
  return {
    EXPO_PUBLIC_SUPABASE_URL:
      process.env.EXPO_PUBLIC_SUPABASE_URL ??
      extra?.EXPO_PUBLIC_SUPABASE_URL ??
      '',
    EXPO_PUBLIC_SUPABASE_ANON_KEY:
      process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
      extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
      '',
  };
}

function parseEnv() {
  const result = envSchema.safeParse(getEnvValues());

  if (!result.success) {
    const message = result.error.issues.map((i) => i.message).join('; ');
    throw new Error(`Invalid environment configuration: ${message}`);
  }

  return result.data;
}

export const env = parseEnv();
