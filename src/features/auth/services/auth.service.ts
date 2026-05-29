import { mapSupabaseAuthError } from '@/lib/auth/map-auth-error';
import { sanitizeEmail } from '@/lib/sanitize';
import { supabase } from '@/lib/supabase';
import type { LoginFormValues } from '../schemas/login.schema';
import type { RegisterFormValues } from '../schemas/register.schema';

export async function signInWithPassword({ email, password }: LoginFormValues) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: sanitizeEmail(email),
    password,
  });

  if (error) {
    throw mapSupabaseAuthError(error, 'login');
  }

  if (!data.session) {
    throw mapSupabaseAuthError({ message: 'Email not confirmed' }, 'login');
  }

  return data.session;
}

export async function signUp({ email, password, displayName }: RegisterFormValues) {
  const { data, error } = await supabase.auth.signUp({
    email: sanitizeEmail(email),
    password,
    options: {
      data: { display_name: displayName },
    },
  });

  if (error) {
    throw mapSupabaseAuthError(error, 'register');
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw mapSupabaseAuthError(error, 'session');
  }
}
