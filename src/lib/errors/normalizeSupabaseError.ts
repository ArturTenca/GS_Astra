import {
  AppError,
  AuthError,
  ForbiddenError,
  NetworkError,
  NotFoundError,
  UnknownError,
} from './AppError';

type SupabaseLikeError = {
  message?: string;
  code?: string;
  status?: number;
};

export function normalizeSupabaseError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  const supabaseError = error as SupabaseLikeError;
  const message = (supabaseError.message ?? '').toLowerCase();
  const code = supabaseError.code ?? '';
  const status = supabaseError.status;

  if (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('failed to fetch')
  ) {
    return new NetworkError();
  }

  if (status === 401 || code === 'PGRST301') {
    return new AuthError('Your session has expired. Please sign in again.', 'SESSION_EXPIRED');
  }

  if (status === 403 || code === '42501') {
    return new ForbiddenError();
  }

  if (status === 404 || code === 'PGRST116') {
    return new NotFoundError();
  }

  return new UnknownError();
}
