export const APP_ROLES = [
  'viewer',
  'operator',
  'mission_lead',
  'colony_admin',
  'security_officer',
  'system_admin',
] as const;

export type AppRole = (typeof APP_ROLES)[number];

export const PROFILE_STATUSES = ['active', 'suspended', 'pending'] as const;

export type ProfileStatus = (typeof PROFILE_STATUSES)[number];

export type UserProfile = {
  id: string;
  displayName: string;
  role: AppRole;
  status: ProfileStatus;
};

export const MISSION_STATUSES = ['planned', 'active', 'completed', 'aborted'] as const;
export type MissionStatus = (typeof MISSION_STATUSES)[number];

export const COLONY_STATUSES = ['operational', 'degraded', 'critical', 'offline'] as const;
export type ColonyStatus = (typeof COLONY_STATUSES)[number];

export const INCIDENT_SEVERITIES = ['low', 'medium', 'high', 'critical'] as const;
export type IncidentSeverity = (typeof INCIDENT_SEVERITIES)[number];

export const INCIDENT_STATUSES = ['open', 'investigating', 'resolved', 'closed'] as const;
export type IncidentStatus = (typeof INCIDENT_STATUSES)[number];

export const MEMBERSHIP_ROLES = ['viewer', 'operator', 'lead'] as const;
export type MembershipRole = (typeof MEMBERSHIP_ROLES)[number];

export type Mission = {
  id: string;
  name: string;
  code: string;
  description: string | null;
  status: MissionStatus;
  startAt: string | null;
  endAt: string | null;
  createdAt: string;
};

export type Colony = {
  id: string;
  missionId: string;
  name: string;
  code: string;
  locationLabel: string | null;
  status: ColonyStatus;
  environmentSummary: string | null;
  createdAt: string;
};

export type Incident = {
  id: string;
  missionId: string;
  colonyId: string | null;
  reporterId: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
};

export type DashboardSummary = {
  activeMissions: number;
  openIncidents: number;
  coloniesMonitored: number;
  recentIncidents: Incident[];
};

export type {
  CreateIncidentInput,
  IncidentFilters,
  IncidentStatusHistory,
  UpdateIncidentStatusInput,
} from './incident.types';
