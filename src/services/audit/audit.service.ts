import { logger } from '@/lib/logger';
import { auditRepository } from '@/services/repositories/audit.repository';
import type { AuditEventInput } from '@/types/audit.types';

const METADATA_BLOCKLIST = ['email', 'password', 'token', 'secret', 'authorization', 'jwt'];

function sanitizeMetadata(
  metadata?: Record<string, string | number | boolean>,
): Record<string, string | number | boolean> {
  if (!metadata) return {};

  const safe: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(metadata)) {
    const lower = key.toLowerCase();
    if (METADATA_BLOCKLIST.some((blocked) => lower.includes(blocked))) {
      continue;
    }
    safe[key] = value;
  }
  return safe;
}

/**
 * Best-effort security audit log. Never blocks user flows or throws to callers.
 */
export async function recordAuditEvent(
  actorId: string | null | undefined,
  input: AuditEventInput,
): Promise<void> {
  if (!actorId) return;

  try {
    await auditRepository.insert(actorId, {
      ...input,
      metadata: sanitizeMetadata(input.metadata),
    });
  } catch {
    logger.warn('audit_event_failed', { action: input.action });
  }
}
