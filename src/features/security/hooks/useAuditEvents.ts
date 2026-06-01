import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { auditRepository } from '@/services/repositories/audit.repository';

export function useAuditEvents(limit = 30) {
  const { role } = useAuth();
  const canView = role === 'security_officer' || role === 'system_admin';

  return useQuery({
    queryKey: ['audit-events', limit],
    queryFn: () => auditRepository.listRecent(limit),
    enabled: canView,
  });
}
