type LogLevel = 'debug' | 'info' | 'warn' | 'error';

type LogContext = Record<string, string | number | boolean | undefined>;

const SENSITIVE_KEYS = ['password', 'token', 'session', 'authorization', 'jwt'];

function sanitizeContext(context?: LogContext): LogContext | undefined {
  if (!context) return undefined;

  const sanitized: LogContext = {};
  for (const [key, value] of Object.entries(context)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.some((s) => lowerKey.includes(s))) {
      sanitized[key] = '[redacted]';
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

function log(level: LogLevel, message: string, context?: LogContext) {
  if (__DEV__) {
    const payload = sanitizeContext(context);
    // eslint-disable-next-line no-console
    console[level](`[ASTRA:${level}] ${message}`, payload ?? '');
  }
}

export const logger = {
  debug: (message: string, context?: LogContext) => log('debug', message, context),
  info: (message: string, context?: LogContext) => log('info', message, context),
  warn: (message: string, context?: LogContext) => log('warn', message, context),
  error: (message: string, context?: LogContext) => log('error', message, context),
};
