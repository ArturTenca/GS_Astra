export const queryKeys = {
  profile: (userId: string) => ['profile', userId] as const,
  missions: () => ['missions'] as const,
  mission: (id: string) => ['mission', id] as const,
  colonies: (missionId?: string) =>
    missionId ? (['colonies', missionId] as const) : (['colonies'] as const),
  colony: (id: string) => ['colony', id] as const,
  incidents: (missionId?: string) =>
    missionId ? (['incidents', missionId] as const) : (['incidents'] as const),
  incident: (id: string) => ['incident', id] as const,
  incidentAttachments: (incidentId: string) => ['incident-attachments', incidentId] as const,
  dashboard: () => ['dashboard'] as const,
  alerts: () => ['alerts'] as const,
  alert: (id: string) => ['alert', id] as const,
  alertsUnacknowledgedCount: () => ['alerts-unacknowledged-count'] as const,
  colonyTelemetry: (colonyId: string) => ['colony-telemetry', colonyId] as const,
} as const;
