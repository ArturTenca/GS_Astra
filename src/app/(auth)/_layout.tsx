import { Redirect, Stack } from 'expo-router';
import { AuthLoadingScreen } from '@/components/feedback/AuthLoadingScreen';
import { useAuthGuard } from '@/lib/auth/auth-guards';

export default function AuthLayout() {
  const { isHydrated, isAuthenticated } = useAuthGuard();

  if (!isHydrated) {
    return <AuthLoadingScreen />;
  }

  if (isAuthenticated) {
    return <Redirect href="/(app)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
