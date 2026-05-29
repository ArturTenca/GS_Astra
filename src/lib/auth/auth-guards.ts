import { useSessionStore } from '@/stores/session.store';

export function useAuthGuard() {
  const isHydrated = useSessionStore((s) => s.isHydrated);
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);

  return { isHydrated, isAuthenticated };
}
