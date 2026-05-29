import type { Colony, Incident, Mission } from '@/types/domain';

type MissionRow = {
  id: string;
  name: string;
  code: string;
  description: string | null;
  status: Mission['status'];
  start_at: string | null;
  end_at: string | null;
  created_at: string;
};

type ColonyRow = {
  id: string;
  mission_id: string;
  name: string;
  code: string;
  location_label: string | null;
  status: Colony['status'];
  environment_summary: string | null;
  created_at: string;
};

type IncidentRow = {
  id: string;
  mission_id: string;
  colony_id: string | null;
  reporter_id: string;
  title: string;
  description: string;
  severity: Incident['severity'];
  status: Incident['status'];
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
};

export function mapMission(row: MissionRow): Mission {
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    description: row.description,
    status: row.status,
    startAt: row.start_at,
    endAt: row.end_at,
    createdAt: row.created_at,
  };
}

export function mapColony(row: ColonyRow): Colony {
  return {
    id: row.id,
    missionId: row.mission_id,
    name: row.name,
    code: row.code,
    locationLabel: row.location_label,
    status: row.status,
    environmentSummary: row.environment_summary,
    createdAt: row.created_at,
  };
}

type IncidentHistoryRow = {
  id: string;
  incident_id: string;
  changed_by: string;
  from_status: Incident['status'] | null;
  to_status: Incident['status'];
  note: string | null;
  created_at: string;
};

export function mapIncidentStatusHistory(row: IncidentHistoryRow): import('@/types/incident.types').IncidentStatusHistory {
  return {
    id: row.id,
    incidentId: row.incident_id,
    changedBy: row.changed_by,
    fromStatus: row.from_status,
    toStatus: row.to_status,
    note: row.note,
    createdAt: row.created_at,
  };
}

export function mapIncident(row: IncidentRow): Incident {
  return {
    id: row.id,
    missionId: row.mission_id,
    colonyId: row.colony_id,
    reporterId: row.reporter_id,
    title: row.title,
    description: row.description,
    severity: row.severity,
    status: row.status,
    latitude: row.latitude,
    longitude: row.longitude,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
