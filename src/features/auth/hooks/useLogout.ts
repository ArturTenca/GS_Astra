import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { signOut } from '../services/auth.service';
import { useSessionStore } from '@/stores/session.store';

export function useLogout() {
  const queryClient = useQueryClient();
  const clearSession = useSessionStore((s) => s.clearSession);

  return useMutation({
    mutationFn: signOut,
    onSettled: () => {
      clearSession();
      queryClient.clear();
      router.replace('/(auth)/login');
    },
  });
}
