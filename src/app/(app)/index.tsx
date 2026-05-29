import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { APP_NAME } from '@/constants';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useLogout } from '@/features/auth/hooks/useLogout';

export default function ProtectedPlaceholderScreen() {
  const { role, userId } = useAuth();
  const logout = useLogout();

  return (
    <SafeAreaView className="flex-1 bg-astra-bg px-6">
      <View className="flex-1 justify-center">
        <Text className="text-xs font-semibold uppercase tracking-[3px] text-astra-accent">
          {APP_NAME}
        </Text>
        <Text className="mt-2 text-2xl font-bold text-astra-text">Authenticated</Text>
        <Text className="mt-4 text-astra-muted">
          Session active. Role: {role ?? 'unknown'}
        </Text>
        <Text className="mt-1 text-xs text-astra-muted">Operator ID: {userId}</Text>
        <View className="mt-8">
          <Button
            title="Sign Out"
            onPress={() => logout.mutate()}
            loading={logout.isPending}
            variant="ghost"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
