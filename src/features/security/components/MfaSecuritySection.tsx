import { useState } from 'react';
import { Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { AuthFormField } from '@/features/auth/components/AuthFormField';
import {
  useEnrollTotp,
  useTotpFactors,
  useUnenrollTotp,
  useVerifyTotpEnrollment,
} from '@/features/auth/hooks/useMfa';
import { getUserFacingMessage } from '@/lib/errors';

export function MfaSecuritySection() {
  const { data: factors, isLoading } = useTotpFactors();
  const enroll = useEnrollTotp();
  const unenroll = useUnenrollTotp();
  const [pendingFactorId, setPendingFactorId] = useState<string | null>(null);
  const [enrollSecret, setEnrollSecret] = useState<string | null>(null);

  const verifyEnrollment = useVerifyTotpEnrollment(pendingFactorId);

  const verifiedFactor = factors?.find((factor) => factor.status === 'verified');

  const startEnrollment = () => {
    enroll.mutate(undefined, {
      onSuccess: (data) => {
        setPendingFactorId(data.id);
        setEnrollSecret(data.totp.secret);
      },
    });
  };

  const cancelEnrollment = () => {
    setPendingFactorId(null);
    setEnrollSecret(null);
    verifyEnrollment.form.reset();
  };

  if (isLoading) {
    return <Text className="text-sm text-astra-muted">Loading MFA status…</Text>;
  }

  if (verifiedFactor) {
    return (
      <View className="gap-3">
        <Text className="text-sm text-astra-success">
          Two-factor authentication is enabled on this account.
        </Text>
        <Button
          title="Remove authenticator"
          variant="danger"
          loading={unenroll.isPending}
          onPress={() => unenroll.mutate(verifiedFactor.id)}
        />
      </View>
    );
  }

  if (pendingFactorId && enrollSecret) {
    return (
      <View className="gap-3">
        <Text className="text-sm text-astra-muted">
          Add this secret to your authenticator app (Google Authenticator, Authy, etc.),
          then enter the 6-digit code to confirm.
        </Text>
        <View className="rounded-lg border border-astra-border bg-astra-panel p-3">
          <Text className="font-mono text-sm text-astra-text" selectable>
            {enrollSecret}
          </Text>
        </View>
        {verifyEnrollment.errorMessage ? (
          <Text className="text-sm text-astra-danger">{verifyEnrollment.errorMessage}</Text>
        ) : null}
        <AuthFormField
          control={verifyEnrollment.form.control}
          name="code"
          label="Verification code"
          placeholder="000000"
          keyboardType="number-pad"
          maxLength={6}
        />
        <Button
          title="Confirm MFA"
          loading={verifyEnrollment.isPending}
          onPress={verifyEnrollment.onSubmit}
        />
        <Button title="Cancel" variant="ghost" onPress={cancelEnrollment} />
      </View>
    );
  }

  return (
    <View className="gap-3">
      <Text className="text-sm text-astra-muted">
        Protect your operator account with TOTP-based two-factor authentication (optional).
      </Text>
      {enroll.error ? (
        <Text className="text-sm text-astra-danger">{getUserFacingMessage(enroll.error)}</Text>
      ) : null}
      <Button title="Enable MFA" loading={enroll.isPending} onPress={startEnrollment} />
    </View>
  );
}
