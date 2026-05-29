import type {
  ColonyStatus,
  IncidentSeverity,
  IncidentStatus,
  MissionStatus,
} from '@/types/domain';

export function missionStatusVariant(
  status: MissionStatus,
): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case 'active':
      return 'success';
    case 'planned':
      return 'info';
    case 'completed':
      return 'default';
    case 'aborted':
      return 'danger';
    default:
      return 'default';
  }
}

export function colonyStatusVariant(
  status: ColonyStatus,
): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case 'operational':
      return 'success';
    case 'degraded':
      return 'warning';
    case 'critical':
      return 'danger';
    case 'offline':
      return 'default';
    default:
      return 'default';
  }
}

export function incidentSeverityVariant(
  severity: IncidentSeverity,
): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (severity) {
    case 'low':
      return 'info';
    case 'medium':
      return 'warning';
    case 'high':
    case 'critical':
      return 'danger';
    default:
      return 'default';
  }
}

export function incidentStatusVariant(
  status: IncidentStatus,
): 'default' | 'success' | 'warning' | 'danger' | 'info' {
  switch (status) {
    case 'open':
      return 'danger';
    case 'investigating':
      return 'warning';
    case 'resolved':
      return 'info';
    case 'closed':
      return 'success';
    default:
      return 'default';
  }
}

export function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
