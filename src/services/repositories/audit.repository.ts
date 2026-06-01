import { Platform } from 'react-native';
import { supabase } from '@/lib/supabase';
import type { Json } from '@/types/database.generated';
import type { AuditEvent, AuditEventInput } from '@/types/audit.types';
import { BaseRepository } from './base.repository';

type AuditRow = {
  id: string;
  actor_id: string | null;
  action: AuditEvent['action'];
  resource_type: string | null;
  resource_id: string | null;
  metadata: Json;
  platform: string | null;
  created_at: string;
};

function metadataAsRecord(metadata: Json): Record<string, unknown> {
  if (metadata && typeof metadata === 'object' && !Array.isArray(metadata)) {
    return metadata as Record<string, unknown>;
  }
  return {};
}

function mapAuditEvent(row: AuditRow): AuditEvent {
  return {
    id: row.id,
    actorId: row.actor_id,
    action: row.action,
    resourceType: row.resource_type,
    resourceId: row.resource_id,
    metadata: metadataAsRecord(row.metadata),
    platform: row.platform,
    createdAt: row.created_at,
  };
}

export class AuditRepository extends BaseRepository {
  async insert(actorId: string, input: AuditEventInput): Promise<void> {
    const { error } = await supabase.from('audit_events').insert({
      actor_id: actorId,
      action: input.action,
      resource_type: input.resourceType ?? null,
      resource_id: input.resourceId ?? null,
      metadata: input.metadata ?? {},
      platform: Platform.OS,
    });

    if (error) {
      this.handleError(error);
    }
  }

  async listRecent(limit = 50): Promise<AuditEvent[]> {
    const { data, error } = await supabase
      .from('audit_events')
      .select('id, actor_id, action, resource_type, resource_id, metadata, platform, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      this.handleError(error);
    }

    return (data ?? []).map(mapAuditEvent);
  }
}

export const auditRepository = new AuditRepository();
