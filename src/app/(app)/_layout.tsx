import { Redirect, Slot } from 'expo-router';
import { View } from 'react-native';
import { AuthLoadingScreen } from '@/components/feedback/AuthLoadingScreen';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { useAlertsRealtime, useUnacknowledgedAlertCount } from '@/features/alerts/hooks/useAlerts';
import { useAuthGuard } from '@/lib/auth/auth-guards';
import { useTheme } from '@/hooks/useTheme';

export default function AppLayout() {
  const { isAuthReady, isAuthenticated } = useAuthGuard();
  const { palette } = useTheme();
  const { data: unacknowledgedCount } = useUnacknowledgedAlertCount();

  useAlertsRealtime();

  if (!isAuthReady) {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  const alertBadge =
    unacknowledgedCount != null && unacknowledgedCount > 0
      ? unacknowledgedCount > 9
        ? '9+'
        : unacknowledgedCount
      : undefined;

  return (
    <View className="flex-1 flex-row" style={{ backgroundColor: palette.bg }}>
      <AppSidebar alertBadge={alertBadge} />
      <View className="flex-1">
        <Slot />
      </View>
    </View>
  );
}
