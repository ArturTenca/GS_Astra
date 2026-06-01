import { supabase } from '@/lib/supabase';
import type { Alert, AlertFilters } from '@/types/alert.types';
import { BaseRepository } from './base.repository';

const ALERT_SELECT =
  'id, mission_id, colony_id, incident_id, title, message, severity, acknowledged_at, acknowledged_by, created_at';

type AlertRow = {
  id: string;
  mission_id: string;
  colony_id: string | null;
  incident_id: string | null;
  title: string;
  message: string;
  severity: Alert['severity'];
  acknowledged_at: string | null;
  acknowledged_by: string | null;
  created_at: string;
};

function mapAlert(row: AlertRow): Alert {
  return {
    id: row.id,
    missionId: row.mission_id,
    colonyId: row.colony_id,
    incidentId: row.incident_id,
    title: row.title,
    message: row.message,
    severity: row.severity,
    acknowledgedAt: row.acknowledged_at,
    acknowledgedBy: row.acknowledged_by,
    createdAt: row.created_at,
  };
}

export class AlertRepository extends BaseRepository {
  async list(filters?: AlertFilters): Promise<Alert[]> {
    let query = supabase
      .from('alerts')
      .select(ALERT_SELECT)
      .order('created_at', { ascending: false });

    if (filters?.status === 'unacknowledged') {
      query = query.is('acknowledged_at', null);
    }

    const { data, error } = await query;

    if (error) {
      this.handleError(error);
    }

    return (data ?? []).map(mapAlert);
  }

  async countUnacknowledged(): Promise<number> {
    const { count, error } = await supabase
      .from('alerts')
      .select('id', { count: 'exact', head: true })
      .is('acknowledged_at', null);

    if (error) {
      this.handleError(error);
    }

    return count ?? 0;
  }

  async getById(id: string): Promise<Alert | null> {
    const { data, error } = await supabase
      .from('alerts')
      .select(ALERT_SELECT)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      this.handleError(error);
    }

    return data ? mapAlert(data) : null;
  }

  async acknowledge(id: string, userId: string): Promise<Alert> {
    const { data, error } = await supabase
      .from('alerts')
      .update({
        acknowledged_at: new Date().toISOString(),
        acknowledged_by: userId,
      })
      .eq('id', id)
      .is('acknowledged_at', null)
      .select(ALERT_SELECT)
      .single();

    if (error) {
      this.handleError(error);
    }

    return mapAlert(data);
  }
}

export const alertRepository = new AlertRepository();
