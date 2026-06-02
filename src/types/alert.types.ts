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
  activeUntil: string | null;
  acknowledgedAt: string | null;
  acknowledgedBy: string | null;
  createdAt: string;
};

export type AlertFilters = {
  status: 'all' | 'active' | 'expired' | 'acknowledged';
};

export type CreateAlertInput = {
  missionId: string;
  colonyId?: string | null;
  title: string;
  message: string;
  severity: AlertSeverity;
  activeUntil?: string | null;
};

export type UpdateAlertInput = {
  id: string;
  missionId?: string;
  colonyId?: string | null;
  title?: string;
  message?: string;
  severity?: AlertSeverity;
  activeUntil?: string | null;
};
