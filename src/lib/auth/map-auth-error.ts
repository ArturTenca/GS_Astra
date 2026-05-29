import { AuthError } from '@/lib/errors';

const GENERIC_LOGIN = 'Invalid email or password. Please try again.';
const GENERIC_REGISTER = 'Unable to create account. Please try again.';
const GENERIC_SESSION = 'Your session has expired. Please sign in again.';
const RATE_LIMIT = 'Too many attempts. Please wait and try again.';
const NETWORK = 'Connection error. Check your network and try again.';
const EMAIL_NOT_CONFIRMED =
  'Please confirm your email before signing in. Check your inbox for the verification link.';
const PROFILE_PENDING =
  'Your account is awaiting activation. Confirm your email or contact mission support.';
const PROFILE_SUSPENDED =
  'Your account has been suspended. Contact mission support for assistance.';
const NO_PROFILE = 'Account setup is incomplete. Please try registering again or contact support.';

type AuthContext = 'login' | 'register' | 'session' | 'profile';

type SupabaseAuthLikeError = {
  message?: string;
  status?: number;
};

export function mapSupabaseAuthError(
  error: SupabaseAuthLikeError,
  context: AuthContext,
): AuthError {
  const msg = (error.message ?? '').toLowerCase();

  if (msg.includes('network') || msg.includes('fetch')) {
    return new AuthError(NETWORK, 'NETWORK');
  }

  if (error.status === 429 || msg.includes('rate')) {
    return new AuthError(RATE_LIMIT, 'RATE_LIMIT');
  }

  if (
    msg.includes('email not confirmed') ||
    msg.includes('not confirmed') ||
    msg.includes('email confirmation')
  ) {
    return new AuthError(EMAIL_NOT_CONFIRMED, 'AUTH');
  }

  switch (context) {
    case 'login':
      return new AuthError(GENERIC_LOGIN, 'INVALID_CREDENTIALS');
    case 'register':
      return new AuthError(GENERIC_REGISTER, 'REGISTRATION_FAILED');
    case 'session':
      return new AuthError(GENERIC_SESSION, 'SESSION_EXPIRED');
    case 'profile':
      return new AuthError(PROFILE_PENDING, 'FORBIDDEN');
    default:
      return new AuthError(GENERIC_LOGIN, 'AUTH');
  }
}

export type AccessBlockReason =
  | 'email_unconfirmed'
  | 'profile_pending'
  | 'profile_suspended'
  | 'no_profile';

export function getAccessBlockMessage(reason: AccessBlockReason): string {
  switch (reason) {
    case 'email_unconfirmed':
      return EMAIL_NOT_CONFIRMED;
    case 'profile_pending':
      return PROFILE_PENDING;
    case 'profile_suspended':
      return PROFILE_SUSPENDED;
    case 'no_profile':
      return NO_PROFILE;
    default:
      return GENERIC_LOGIN;
  }
}
