export const ALERT_SEVERITIES = ['info', 'warning', 'critical'] as const;
export type AlertSeverity = (typeof ALERT_SEVERITIES)[number];

export type Alert = {
  id: string;
  missionId: string;
  colonyId: string | null;
  incidentId: string | null;
  title: string;
  message: string;
  severity: AlertSeverity;
  acknowledgedAt: string | null;
  acknowledgedBy: string | null;
  createdAt: string;
};

export type AlertFilters = {
  status: 'all' | 'unacknowledged';
};
