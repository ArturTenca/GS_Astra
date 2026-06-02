import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import { colonyRepository, incidentRepository } from '@/services/repositories';
import type { ColonyStatus, IncidentSeverity } from '@/types/domain';

export type DashboardInsights = {
  severityCounts: Record<IncidentSeverity, number>;
  colonyStatusCounts: Record<ColonyStatus, number>;
};

export function useDashboardInsights() {
  return useQuery({
    queryKey: [...queryKeys.dashboard(), 'insights'],
    queryFn: async (): Promise<DashboardInsights> => {
      const [incidents, colonies] = await Promise.all([
        incidentRepository.list(),
        colonyRepository.listForCurrentUser(),
      ]);

      const severityCounts: Record<IncidentSeverity, number> = {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0,
      };

      for (const incident of incidents) {
        severityCounts[incident.severity] += 1;
      }

      const colonyStatusCounts: Record<ColonyStatus, number> = {
        operational: 0,
        degraded: 0,
        critical: 0,
        offline: 0,
      };

      for (const colony of colonies) {
        colonyStatusCounts[colony.status] += 1;
      }

      return { severityCounts, colonyStatusCounts };
    },
  });
}
