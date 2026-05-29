import type { IncidentSeverity, IncidentStatus } from './domain';

export type IncidentStatusHistory = {
  id: string;
  incidentId: string;
  changedBy: string;
  fromStatus: IncidentStatus | null;
  toStatus: IncidentStatus;
  note: string | null;
  createdAt: string;
};

export type IncidentFilters = {
  status?: IncidentStatus | 'all';
  severity?: IncidentSeverity | 'all';
};

export type CreateIncidentInput = {
  missionId: string;
  colonyId?: string | null;
  reporterId: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
};

export type UpdateIncidentStatusInput = {
  incidentId: string;
  status: IncidentStatus;
  note?: string;
};
