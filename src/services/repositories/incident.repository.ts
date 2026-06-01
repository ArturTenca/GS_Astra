import { supabase } from '@/lib/supabase';
import { mapIncident, mapIncidentStatusHistory } from '@/services/mappers/domain.mappers';
import type {
  CreateIncidentInput,
  DashboardSummary,
  Incident,
  IncidentFilters,
  IncidentStatusHistory,
  UpdateIncidentInput,
  UpdateIncidentStatusInput,
} from '@/types/domain';
import { BaseRepository } from './base.repository';

const OPEN_STATUSES = ['open', 'investigating'] as const;

const INCIDENT_SELECT =
  'id, mission_id, colony_id, reporter_id, title, description, severity, status, latitude, longitude, created_at, updated_at';

export class IncidentRepository extends BaseRepository {
  async list(filters?: IncidentFilters): Promise<Incident[]> {
    let query = supabase
      .from('incidents')
      .select(INCIDENT_SELECT)
      .order('created_at', { ascending: false });

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }

    if (filters?.severity && filters.severity !== 'all') {
      query = query.eq('severity', filters.severity);
    }

    const { data, error } = await query;

    if (error) {
      this.handleError(error);
    }

    return (data ?? []).map(mapIncident);
  }

  async listRecent(limit = 5): Promise<Incident[]> {
    const { data, error } = await supabase
      .from('incidents')
      .select(INCIDENT_SELECT)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      this.handleError(error);
    }

    return (data ?? []).map(mapIncident);
  }

  async getById(id: string): Promise<Incident | null> {
    const { data, error } = await supabase
      .from('incidents')
      .select(INCIDENT_SELECT)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      this.handleError(error);
    }

    return data ? mapIncident(data) : null;
  }

  async listStatusHistory(incidentId: string): Promise<IncidentStatusHistory[]> {
    const { data, error } = await supabase
      .from('incident_status_history')
      .select('id, incident_id, changed_by, from_status, to_status, note, created_at')
      .eq('incident_id', incidentId)
      .order('created_at', { ascending: false });

    if (error) {
      this.handleError(error);
    }

    return (data ?? []).map(mapIncidentStatusHistory);
  }

  async create(input: CreateIncidentInput): Promise<Incident> {
    const { data, error } = await supabase
      .from('incidents')
      .insert({
        mission_id: input.missionId,
        colony_id: input.colonyId || null,
        reporter_id: input.reporterId,
        title: input.title,
        description: input.description,
        severity: input.severity,
        status: 'open',
        latitude: input.latitude ?? null,
        longitude: input.longitude ?? null,
      })
      .select(INCIDENT_SELECT)
      .single();

    if (error) {
      this.handleError(error);
    }

    return mapIncident(data);
  }

  async update(input: UpdateIncidentInput): Promise<Incident> {
    const { data, error } = await supabase
      .from('incidents')
      .update({
        ...(input.title != null ? { title: input.title } : {}),
        ...(input.description != null ? { description: input.description } : {}),
        ...(input.severity != null ? { severity: input.severity } : {}),
        ...(input.colonyId !== undefined ? { colony_id: input.colonyId || null } : {}),
        ...(input.status != null ? { status: input.status } : {}),
        ...(input.latitude !== undefined ? { latitude: input.latitude } : {}),
        ...(input.longitude !== undefined ? { longitude: input.longitude } : {}),
      })
      .eq('id', input.incidentId)
      .select(INCIDENT_SELECT)
      .single();

    if (error) {
      this.handleError(error);
    }

    if (input.note?.trim() && input.status != null) {
      const { data: latestHistory, error: historyError } = await supabase
        .from('incident_status_history')
        .select('id')
        .eq('incident_id', input.incidentId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (historyError) {
        this.handleError(historyError);
      }

      if (latestHistory) {
        const { error: noteError } = await supabase
          .from('incident_status_history')
          .update({ note: input.note.trim() })
          .eq('id', latestHistory.id);

        if (noteError) {
          this.handleError(noteError);
        }
      }
    }

    return mapIncident(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('incidents').delete().eq('id', id);

    if (error) {
      this.handleError(error);
    }
  }

  async updateStatus(input: UpdateIncidentStatusInput): Promise<Incident> {
    const { data, error } = await supabase
      .from('incidents')
      .update({ status: input.status })
      .eq('id', input.incidentId)
      .select(INCIDENT_SELECT)
      .single();

    if (error) {
      this.handleError(error);
    }

    if (input.note?.trim()) {
      const { data: latestHistory, error: historyError } = await supabase
        .from('incident_status_history')
        .select('id')
        .eq('incident_id', input.incidentId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (historyError) {
        this.handleError(historyError);
      }

      if (latestHistory) {
        const { error: noteError } = await supabase
          .from('incident_status_history')
          .update({ note: input.note.trim() })
          .eq('id', latestHistory.id);

        if (noteError) {
          this.handleError(noteError);
        }
      }
    }

    return mapIncident(data);
  }

  async countOpen(): Promise<number> {
    const { count, error } = await supabase
      .from('incidents')
      .select('id', { count: 'exact', head: true })
      .in('status', [...OPEN_STATUSES]);

    if (error) {
      this.handleError(error);
    }

    return count ?? 0;
  }

  async getDashboardSummary(
    activeMissions: number,
    coloniesMonitored: number,
  ): Promise<DashboardSummary> {
    const [openIncidents, recentIncidents] = await Promise.all([
      this.countOpen(),
      this.listRecent(5),
    ]);

    return {
      activeMissions,
      openIncidents,
      coloniesMonitored,
      recentIncidents,
    };
  }
}

export const incidentRepository = new IncidentRepository();
