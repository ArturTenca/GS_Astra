export type AppErrorCode =
  | 'VALIDATION'
  | 'AUTH'
  | 'INVALID_CREDENTIALS'
  | 'REGISTRATION_FAILED'
  | 'SESSION_EXPIRED'
  | 'RATE_LIMIT'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'NETWORK'
  | 'UNKNOWN';

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly isOperational: boolean;

  constructor(
    message: string,
    code: AppErrorCode = 'UNKNOWN',
    isOperational = true,
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.isOperational = isOperational;
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION');
    this.name = 'ValidationError';
  }
}

export class AuthError extends AppError {
  constructor(message: string, code: AppErrorCode = 'AUTH') {
    super(message, code);
    this.name = 'AuthError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'You do not have access to this resource.') {
    super(message, 'FORBIDDEN');
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found.') {
    super(message, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Connection error. Check your network and try again.') {
    super(message, 'NETWORK');
    this.name = 'NetworkError';
  }
}

export class UnknownError extends AppError {
  constructor(message = 'Something went wrong. Please try again.') {
    super(message, 'UNKNOWN', false);
    this.name = 'UnknownError';
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function getUserFacingMessage(error: unknown): string {
  if (isAppError(error)) {
    return error.message;
  }
  return 'Something went wrong. Please try again.';
}
