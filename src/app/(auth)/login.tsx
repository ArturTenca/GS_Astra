import { Link } from 'expo-router';
import { Text, View } from 'react-native';
import { Button } from '@/components/ui/Button';
import { AuthFormField } from '@/features/auth/components/AuthFormField';
import { AuthScreenLayout } from '@/features/auth/components/AuthScreenLayout';
import { useLogin } from '@/features/auth/hooks/useLogin';
import { EMAIL_MAX_LENGTH, PASSWORD_MAX_LENGTH } from '@/features/auth/schemas/login.schema';

export default function LoginScreen() {
  const { form, onSubmit, isPending, errorMessage } = useLogin();

  return (
    <AuthScreenLayout title="Mission Access" subtitle="Sign in to continue">
      {errorMessage ? (
        <View className="mb-4 rounded-lg border border-astra-danger/50 bg-astra-danger/10 p-3">
          <Text className="text-sm text-astra-danger">{errorMessage}</Text>
        </View>
      ) : null}

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

      <Button title="Sign In" onPress={onSubmit} loading={isPending} />

      <View className="mt-6 flex-row justify-center">
        <Text className="text-astra-muted">New operator? </Text>
        <Link href="/(auth)/register">
          <Text className="font-semibold text-astra-primary">Register</Text>
        </Link>
      </View>
    </AuthScreenLayout>
  );
}
