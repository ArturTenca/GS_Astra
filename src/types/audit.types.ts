export const AUDIT_ACTIONS = [
  'auth.login',
  'auth.logout',
  'auth.mfa_enrolled',
  'auth.mfa_verified',
  'auth.mfa_removed',
  'incident.created',
  'incident.status_updated',
  'incident.attachment_uploaded',
  'security.access_denied',
] as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[number];

export type AuditEventInput = {
  action: AuditAction;
  resourceType?: string;
  resourceId?: string;
  metadata?: Record<string, string | number | boolean>;
};

export type AuditEvent = {
  id: string;
  actorId: string | null;
  action: AuditAction;
  resourceType: string | null;
  resourceId: string | null;
  metadata: Record<string, unknown>;
  platform: string | null;
  createdAt: string;
};
