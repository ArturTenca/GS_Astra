import { supabase } from '@/lib/supabase';
import { isAlertActive, isAlertExpired, todayLocalISODate } from '@/lib/dates/alert-dates';
import type {
  Alert,
  AlertFilters,
  CreateAlertInput,
  UpdateAlertInput,
} from '@/types/alert.types';
import { BaseRepository } from './base.repository';

const ALERT_SELECT_BASE =
  'id, mission_id, colony_id, incident_id, title, message, severity, acknowledged_at, acknowledged_by, created_at';

const ALERT_SELECT_WITH_DEADLINE = `${ALERT_SELECT_BASE}, active_until`;

type AlertRow = {
  id: string;
  mission_id: string;
  colony_id: string | null;
  incident_id: string | null;
  title: string;
  message: string;
  severity: Alert['severity'];
  active_until?: string | null;
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
    activeUntil: row.active_until ?? null,
    acknowledgedAt: row.acknowledged_at,
    acknowledgedBy: row.acknowledged_by,
    createdAt: row.created_at,
  };
}

function isMissingDeadlineColumn(error: unknown): boolean {
  const record = error as { code?: string; message?: string };
  const msg = record.message ?? '';
  return (
    record.code === '42703' ||
    record.code === 'PGRST204' ||
    msg.includes('active_until') ||
    msg.includes('schema cache')
  );
}

function applyStatusFilter(alerts: Alert[], status?: AlertFilters['status']): Alert[] {
  if (!status || status === 'all') return alerts;
  if (status === 'acknowledged') {
    return alerts.filter((a) => a.acknowledgedAt != null);
  }
  if (status === 'active') {
    return alerts.filter((a) => isAlertActive(a));
  }
  if (status === 'expired') {
    return alerts.filter((a) => isAlertExpired(a));
  }
  return alerts;
}

function activeDeadlineOrFilter(today: string): string {
  return `active_until.is.null,active_until.gte."${today}"`;
}

export class AlertRepository extends BaseRepository {
  private deadlineColumnSupported: boolean | null = null;

  private async runListQuery(
    select: string,
    useServerDeadlineFilter: boolean,
    filters?: AlertFilters,
  ): Promise<{ data: AlertRow[] | null; error: unknown }> {
    const today = todayLocalISODate();
    let query = supabase.from('alerts').select(select).order('created_at', { ascending: false });

    if (useServerDeadlineFilter) {
      if (filters?.status === 'active') {
        query = query.is('acknowledged_at', null).or(activeDeadlineOrFilter(today));
      } else if (filters?.status === 'expired') {
        query = query
          .is('acknowledged_at', null)
          .not('active_until', 'is', null)
          .lt('active_until', today);
      } else if (filters?.status === 'acknowledged') {
        query = query.not('acknowledged_at', 'is', null);
      }
    } else if (filters?.status === 'acknowledged') {
      query = query.not('acknowledged_at', 'is', null);
    } else if (filters?.status === 'active') {
      query = query.is('acknowledged_at', null);
    } else if (filters?.status === 'expired') {
      return { data: [], error: null };
    }

    const { data, error } = await query;
    return { data: data as AlertRow[] | null, error };
  }

  private async listRows(filters?: AlertFilters): Promise<AlertRow[]> {
    const select =
      this.deadlineColumnSupported === false ? ALERT_SELECT_BASE : ALERT_SELECT_WITH_DEADLINE;
    const useServerFilter = this.deadlineColumnSupported !== false;

    let { data, error } = await this.runListQuery(select, useServerFilter, filters);

    if (error && isMissingDeadlineColumn(error)) {
      this.deadlineColumnSupported = false;
      ({ data, error } = await this.runListQuery(ALERT_SELECT_BASE, false, filters));
    } else if (!error) {
      this.deadlineColumnSupported = true;
    }

    if (error) {
      this.handleError(error);
    }

    return data ?? [];
  }

  async list(filters?: AlertFilters): Promise<Alert[]> {
    const rows = await this.listRows(filters);
    let alerts = rows.map(mapAlert);
    if (this.deadlineColumnSupported === false) {
      alerts = applyStatusFilter(alerts, filters?.status);
    }
    return alerts;
  }

  async countActive(): Promise<number> {
    const today = todayLocalISODate();

    if (this.deadlineColumnSupported !== false) {
      const { count, error } = await supabase
        .from('alerts')
        .select('id', { count: 'exact', head: true })
        .is('acknowledged_at', null)
        .or(activeDeadlineOrFilter(today));

      if (!error) {
        this.deadlineColumnSupported = true;
        return count ?? 0;
      }
      if (!isMissingDeadlineColumn(error)) {
        this.handleError(error);
      }
      this.deadlineColumnSupported = false;
    }

    const { count, error } = await supabase
      .from('alerts')
      .select('id', { count: 'exact', head: true })
      .is('acknowledged_at', null);

    if (error) {
      this.handleError(error);
    }

    return count ?? 0;
  }

  async countUnacknowledged(): Promise<number> {
    return this.countActive();
  }

  private async selectOne(id: string): Promise<Alert | null> {
    const trySelect = async (columns: string) => {
      return supabase.from('alerts').select(columns).eq('id', id).maybeSingle();
    };

    let { data, error } = await trySelect(ALERT_SELECT_WITH_DEADLINE);

    if (error && isMissingDeadlineColumn(error)) {
      this.deadlineColumnSupported = false;
      ({ data, error } = await trySelect(ALERT_SELECT_BASE));
    } else if (!error) {
      this.deadlineColumnSupported = true;
    }

    if (error) {
      this.handleError(error);
    }

    return data ? mapAlert(data as unknown as AlertRow) : null;
  }

  async getById(id: string): Promise<Alert | null> {
    return this.selectOne(id);
  }

  async create(input: CreateAlertInput): Promise<Alert> {
    const baseInsert = {
      mission_id: input.missionId,
      colony_id: input.colonyId ?? null,
      title: input.title,
      message: input.message,
      severity: input.severity,
    };

    let { data, error } = await supabase
      .from('alerts')
      .insert({ ...baseInsert, active_until: input.activeUntil ?? null })
      .select(ALERT_SELECT_WITH_DEADLINE)
      .single();

    if (error && isMissingDeadlineColumn(error)) {
      this.deadlineColumnSupported = false;
      ({ data, error } = await supabase
        .from('alerts')
        .insert(baseInsert)
        .select(ALERT_SELECT_BASE)
        .single());
    } else if (!error) {
      this.deadlineColumnSupported = true;
    }

    if (error) {
      this.handleError(error);
    }

    return mapAlert(data as unknown as AlertRow);
  }

  async update(input: UpdateAlertInput): Promise<Alert> {
    const basePatch = {
      ...(input.missionId != null ? { mission_id: input.missionId } : {}),
      ...(input.colonyId !== undefined ? { colony_id: input.colonyId } : {}),
      ...(input.title != null ? { title: input.title } : {}),
      ...(input.message != null ? { message: input.message } : {}),
      ...(input.severity != null ? { severity: input.severity } : {}),
    };

    let { data, error } = await supabase
      .from('alerts')
      .update({
        ...basePatch,
        ...(input.activeUntil !== undefined ? { active_until: input.activeUntil } : {}),
      })
      .eq('id', input.id)
      .select(ALERT_SELECT_WITH_DEADLINE)
      .single();

    if (error && isMissingDeadlineColumn(error)) {
      this.deadlineColumnSupported = false;
      ({ data, error } = await supabase
        .from('alerts')
        .update(basePatch)
        .eq('id', input.id)
        .select(ALERT_SELECT_BASE)
        .single());
    } else if (!error) {
      this.deadlineColumnSupported = true;
    }

    if (error) {
      this.handleError(error);
    }

    return mapAlert(data as unknown as AlertRow);
  }

  async delete(id: string): Promise<void> {
    const { data, error } = await supabase
      .from('alerts')
      .delete()
      .eq('id', id)
      .select('id');

    this.assertDeleted(data, error);
  }

  async acknowledge(id: string, userId: string): Promise<Alert> {
    const selectCols =
      this.deadlineColumnSupported === false ? ALERT_SELECT_BASE : ALERT_SELECT_WITH_DEADLINE;

    const { data, error } = await supabase
      .from('alerts')
      .update({
        acknowledged_at: new Date().toISOString(),
        acknowledged_by: userId,
      })
      .eq('id', id)
      .is('acknowledged_at', null)
      .select(selectCols)
      .single();

    if (error) {
      this.handleError(error);
    }

    return mapAlert(data as unknown as AlertRow);
  }
}

export const alertRepository = new AlertRepository();
