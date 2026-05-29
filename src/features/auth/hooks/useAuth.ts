import { useSessionStore } from '@/stores/session.store';

export function useAuth() {
  const userId = useSessionStore((s) => s.userId);
  const role = useSessionStore((s) => s.role);
  const profileStatus = useSessionStore((s) => s.profileStatus);
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);
  const isHydrated = useSessionStore((s) => s.isHydrated);

  return {
    userId,
    role,
    profileStatus,
    isAuthenticated,
    isHydrated,
  };
}
