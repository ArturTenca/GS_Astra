import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { recordAuditEvent } from '@/services/audit/audit.service';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { signOut } from '../services/auth.service';
import { useSessionStore } from '@/stores/session.store';

export function useLogout() {
  const queryClient = useQueryClient();
  const clearSession = useSessionStore((s) => s.clearSession);
  const { userId } = useAuth();

  return useMutation({
    mutationFn: signOut,
    onMutate: async () => {
      await recordAuditEvent(userId, { action: 'auth.logout' });
    },
    onSettled: () => {
      clearSession();
      queryClient.clear();
      router.replace('/(auth)/login');
    },
  });
}
