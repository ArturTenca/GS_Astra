import { Text } from 'react-native';
import { AppScreenLayout } from '@/components/layout/AppScreenLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenPrimitives';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useLogout } from '@/features/auth/hooks/useLogout';

export default function ProfileScreen() {
  const { userId, role } = useAuth();
  const logout = useLogout();

  return (
    <AppScreenLayout>
      <ScreenHeader title="Operator Profile" subtitle="Session and access level" />

      <Card className="mb-4">
        <Text className="text-xs uppercase tracking-wider text-astra-muted">Operator ID</Text>
        <Text className="mt-1 text-sm text-astra-text">{userId}</Text>

        <Text className="mt-4 text-xs uppercase tracking-wider text-astra-muted">Global Role</Text>
        <Text className="mt-1 text-sm capitalize text-astra-accent">{role ?? 'unknown'}</Text>
      </Card>

      <Button
        title="Sign Out"
        onPress={() => logout.mutate()}
        loading={logout.isPending}
        variant="ghost"
      />
    </AppScreenLayout>
  );
}
