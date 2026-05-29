import { Link, router } from 'expo-router';
import { Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { AuthFormField } from '@/features/auth/components/AuthFormField';
import { AuthScreenLayout } from '@/features/auth/components/AuthScreenLayout';
import { useRegister } from '@/features/auth/hooks/useRegister';
import { FIELD_LIMITS } from '@/features/auth/schemas/register.schema';
import { EMAIL_MAX_LENGTH, PASSWORD_MAX_LENGTH } from '@/features/auth/schemas/login.schema';

export default function RegisterScreen() {
  const { form, onSubmit, isPending, errorMessage, registrationComplete } = useRegister();

  if (registrationComplete) {
    return (
      <AuthScreenLayout
        title="Registration Submitted"
        subtitle="If your account is eligible, follow the instructions sent to your email."
      >
        <Button title="Back to Sign In" onPress={() => router.replace('/(auth)/login')} />
      </AuthScreenLayout>
    );
  }

  return (
    <AuthScreenLayout title="Operator Registration" subtitle="Request mission system access">
      {errorMessage ? (
        <View className="mb-4 rounded-lg border border-astra-danger/50 bg-astra-danger/10 p-3">
          <Text className="text-sm text-astra-danger">{errorMessage}</Text>
        </View>
      ) : null}

      <AuthFormField
        control={form.control}
        name="displayName"
        label="Display Name"
        placeholder="Commander Reyes"
        autoCapitalize="words"
        maxLength={FIELD_LIMITS.displayName}
      />
      <AuthFormField
        control={form.control}
        name="email"
        label="Email"
        placeholder="commander@astra.mission"
        keyboardType="email-address"
        maxLength={EMAIL_MAX_LENGTH}
      />
      <AuthFormField
        control={form.control}
        name="password"
        label="Password"
        placeholder="••••••••"
        secureTextEntry
        maxLength={PASSWORD_MAX_LENGTH}
      />
      <AuthFormField
        control={form.control}
        name="confirmPassword"
        label="Confirm Password"
        placeholder="••••••••"
        secureTextEntry
        maxLength={PASSWORD_MAX_LENGTH}
      />

      <Button title="Register" onPress={onSubmit} loading={isPending} />

      <View className="mt-6 flex-row justify-center">
        <Text className="text-astra-muted">Already registered? </Text>
        <Link href="/(auth)/login">
          <Text className="font-semibold text-astra-primary">Sign In</Text>
        </Link>
      </View>
    </AuthScreenLayout>
  );
}
