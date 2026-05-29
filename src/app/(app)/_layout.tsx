import { Redirect, Stack } from 'expo-router';
import { AuthLoadingScreen } from '@/components/feedback/AuthLoadingScreen';
import { useAuthGuard } from '@/lib/auth/auth-guards';

export default function AppLayout() {
  const { isHydrated, isAuthenticated } = useAuthGuard();

  if (!isHydrated) {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
