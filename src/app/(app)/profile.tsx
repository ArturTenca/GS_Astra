import { ScrollView, Text, View } from 'react-native';
import { AppScreenLayout } from '@/components/layout/AppScreenLayout';
import { Button } from '@/components/ui/Button';
import { EmptyState, LoadingState, ScreenHeader } from '@/components/ui/ScreenPrimitives';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { MfaSecuritySection } from '@/features/security/components/MfaSecuritySection';
import { useAuditEvents } from '@/features/security/hooks/useAuditEvents';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { getUserFacingMessage } from '@/lib/errors';

function formatRole(role: string): string {
  return role.replace(/_/g, ' ');
}

export default function ProfileScreen() {
  const { role: sessionRole } = useAuth();
  const { data: profile, isLoading, isError, error } = useProfile();
  const logout = useLogout();
  const audit = useAuditEvents(25);
  const canViewAudit =
    sessionRole === 'security_officer' || sessionRole === 'system_admin';

  return (
    <AppScreenLayout>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Operator Profile" subtitle="Account security and session" />

        {isLoading ? <LoadingState message="Loading profile…" /> : null}

        {isError ? (
          <EmptyState
            title="Profile unavailable"
            message={getUserFacingMessage(error)}
          />
        ) : null}

        {profile ? (
          <View className="mb-6 rounded-xl border border-astra-border bg-astra-surface/80 p-4">
            <Text className="text-lg font-semibold text-astra-text">
              {profile.displayName || 'Operator'}
            </Text>
            <Text className="mt-1 text-sm capitalize text-astra-muted">
              Role: {formatRole(profile.role)}
            </Text>
            <Text className="mt-1 text-sm text-astra-muted">Status: {profile.status}</Text>
          </View>
        ) : null}

        <View className="mb-6 rounded-xl border border-astra-border bg-astra-surface/80 p-4">
          <Text className="mb-3 text-base font-semibold text-astra-text">
            Two-factor authentication
          </Text>
          <MfaSecuritySection />
        </View>

        {canViewAudit ? (
          <View className="mb-6 rounded-xl border border-astra-border bg-astra-surface/80 p-4">
            <Text className="mb-3 text-base font-semibold text-astra-text">Security audit log</Text>
            {audit.isLoading ? <LoadingState message="Loading audit events…" /> : null}
            {audit.isError ? (
              <Text className="text-sm text-astra-danger">
                {getUserFacingMessage(audit.error)}
              </Text>
            ) : null}
            {audit.data?.length === 0 ? (
              <Text className="text-sm text-astra-muted">No audit events recorded yet.</Text>
            ) : null}
            {audit.data?.map((event) => (
              <View
                key={event.id}
                className="mb-2 border-b border-astra-border/60 pb-2 last:mb-0 last:border-b-0"
              >
                <Text className="text-sm font-medium text-astra-text">{event.action}</Text>
                <Text className="text-xs text-astra-muted">
                  {new Date(event.createdAt).toLocaleString()}
                  {event.platform ? ` · ${event.platform}` : ''}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        <Button
          title="Sign Out"
          variant="danger"
          loading={logout.isPending}
          onPress={() => logout.mutate()}
        />
      </ScrollView>
    </AppScreenLayout>
  );
}
