import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { queryKeys } from '@/constants/query-keys';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { alertRepository } from '@/services/repositories/alert.repository';
import type { AlertFilters } from '@/types/alert.types';

export function useAlerts(filters: AlertFilters) {
  return useQuery({
    queryKey: [...queryKeys.alerts(), filters],
    queryFn: () => alertRepository.list(filters),
    refetchOnMount: 'always',
  });
}

export function useUnacknowledgedAlertCount() {
  return useQuery({
    queryKey: queryKeys.alertsUnacknowledgedCount(),
    queryFn: () => alertRepository.countUnacknowledged(),
    refetchInterval: 60_000,
  });
}

export function useAlertsRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('alerts-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'alerts' },
        () => {
          void queryClient.invalidateQueries({ queryKey: queryKeys.alerts() });
          void queryClient.invalidateQueries({ queryKey: queryKeys.alertsUnacknowledgedCount() });
          void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard() });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient]);
}

export function useAcknowledgeAlert(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  return useMutation({
    mutationFn: (alertId: string) => {
      if (!userId) {
        throw new Error('Not authenticated');
      }
      return alertRepository.acknowledge(alertId, userId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.alerts() });
      void queryClient.invalidateQueries({ queryKey: queryKeys.alertsUnacknowledgedCount() });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard() });
      onSuccess?.();
    },
  });
}
