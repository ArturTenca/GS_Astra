import { useSessionStore } from '@/stores/session.store';

export function useAuthGuard() {
  const isHydrated = useSessionStore((s) => s.isHydrated);
  const isRestoringSession = useSessionStore((s) => s.isRestoringSession);
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);
  const isAuthReady = isHydrated && !isRestoringSession;

  return { isHydrated, isRestoringSession, isAuthenticated, isAuthReady };
}
