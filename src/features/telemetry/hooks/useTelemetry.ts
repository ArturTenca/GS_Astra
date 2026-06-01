import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import { telemetryRepository } from '@/services/repositories/telemetry.repository';

export function useColonyTelemetry(colonyId: string | null) {
  return useQuery({
    queryKey: queryKeys.colonyTelemetry(colonyId ?? ''),
    queryFn: () => telemetryRepository.getSeriesByColony(colonyId!),
    enabled: Boolean(colonyId),
  });
}
