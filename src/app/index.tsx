import { Redirect } from 'expo-router';
import { AuthLoadingScreen } from '@/components/feedback/AuthLoadingScreen';
import { useAuthGuard } from '@/lib/auth/auth-guards';

export default function Index() {
  const { isHydrated, isAuthenticated } = useAuthGuard();

  if (!isHydrated) {
    return <AuthLoadingScreen />;
  }

  if (isAuthenticated) {
    return <Redirect href="/(app)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
