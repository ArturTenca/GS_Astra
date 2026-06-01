import { mapSupabaseAuthError } from '@/lib/auth/map-auth-error';
import { sanitizeEmail } from '@/lib/sanitize';
import { supabase } from '@/lib/supabase';
import type { LoginFormValues } from '../schemas/login.schema';
import type { RegisterFormValues } from '../schemas/register.schema';

export type SignInResult = {
  needsMfa: boolean;
};

export async function signInWithPassword({ email, password }: LoginFormValues): Promise<SignInResult> {
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

  const { data: assurance, error: assuranceError } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

  if (assuranceError) {
    throw mapSupabaseAuthError(assuranceError, 'login');
  }

  const needsMfa =
    assurance.currentLevel === 'aal1' && assurance.nextLevel === 'aal2';

  return { needsMfa };
}

export async function verifyMfaLogin(code: string) {
  const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
  if (factorsError) {
    throw mapSupabaseAuthError(factorsError, 'login');
  }

  const totpFactor = factors.totp.find((factor) => factor.status === 'verified');
  if (!totpFactor) {
    throw mapSupabaseAuthError({ message: 'MFA not configured' }, 'login');
  }

  const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
    factorId: totpFactor.id,
  });

  if (challengeError) {
    throw mapSupabaseAuthError(challengeError, 'login');
  }

  const { error: verifyError } = await supabase.auth.mfa.verify({
    factorId: totpFactor.id,
    challengeId: challenge.id,
    code: code.trim(),
  });

  if (verifyError) {
    throw mapSupabaseAuthError(verifyError, 'login');
  }
}

export async function listTotpFactors() {
  const { data, error } = await supabase.auth.mfa.listFactors();
  if (error) {
    throw mapSupabaseAuthError(error, 'session');
  }
  return data.totp;
}

export async function enrollTotpFactor() {
  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: 'totp',
    friendlyName: 'ASTRA Authenticator',
  });

  if (error) {
    throw mapSupabaseAuthError(error, 'session');
  }

  return data;
}

export async function verifyTotpEnrollment(factorId: string, code: string) {
  const { error } = await supabase.auth.mfa.challengeAndVerify({
    factorId,
    code: code.trim(),
  });

  if (error) {
    throw mapSupabaseAuthError(error, 'session');
  }
}

export async function unenrollTotpFactor(factorId: string) {
  const { error } = await supabase.auth.mfa.unenroll({ factorId });
  if (error) {
    throw mapSupabaseAuthError(error, 'session');
  }
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
