import { Redirect } from 'expo-router';
import { Platform } from 'react-native';
import { AuthLoadingScreen } from '@/components/feedback/AuthLoadingScreen';
import { LandingPage } from '@/features/landing/components/LandingPage';
import { useAuthGuard } from '@/lib/auth/auth-guards';

export default function Index() {
  const { isAuthReady, isAuthenticated } = useAuthGuard();

  if (!isAuthReady) {
    return <AuthLoadingScreen />;
  }

  if (isAuthenticated) {
    return <Redirect href="/(app)" />;
  }

  if (Platform.OS === 'web') {
    return <LandingPage />;
  }

  return <Redirect href="/(auth)/login" />;
}
