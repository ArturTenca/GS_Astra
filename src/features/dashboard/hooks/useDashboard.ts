import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import { colonyRepository, incidentRepository, missionRepository } from '@/services/repositories';

export function useMissions() {
  return useQuery({
    queryKey: queryKeys.missions(),
    queryFn: () => missionRepository.listForCurrentUser(),
  });
}

export function useMission(id: string) {
  return useQuery({
    queryKey: queryKeys.mission(id),
    queryFn: () => missionRepository.getById(id),
    enabled: Boolean(id),
  });
}

export function useColonies(missionId?: string) {
  return useQuery({
    queryKey: queryKeys.colonies(missionId),
    queryFn: () => colonyRepository.listForCurrentUser(missionId),
  });
}

export function useColony(id: string) {
  return useQuery({
    queryKey: queryKeys.colony(id),
    queryFn: () => colonyRepository.getById(id),
    enabled: Boolean(id),
  });
}

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard(),
    queryFn: async () => {
      const [missions, colonies] = await Promise.all([
        missionRepository.listForCurrentUser(),
        colonyRepository.listForCurrentUser(),
      ]);
      const activeMissions = missions.filter((m) => m.status === 'active').length;
      return incidentRepository.getDashboardSummary(activeMissions, colonies.length);
    },
  });
}
