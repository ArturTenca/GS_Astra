import { Redirect, Stack } from 'expo-router';
import { AuthLoadingScreen } from '@/components/feedback/AuthLoadingScreen';
import { useAuthGuard } from '@/lib/auth/auth-guards';

export default function AuthLayout() {
  const { isAuthReady, isAuthenticated } = useAuthGuard();

  if (!isAuthReady) {
    return <AuthLoadingScreen />;
  }

  if (isAuthenticated) {
    return <Redirect href="/(app)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
