import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP_NAME, APP_TAGLINE } from '@/constants';
import { useTheme } from '@/hooks/useTheme';

type AuthScreenLayoutProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function AuthScreenLayout({ title, subtitle, children }: AuthScreenLayoutProps) {
  const { palette } = useTheme();

  return (
    <SafeAreaView className="flex-1 bg-astra-bg" style={{ backgroundColor: palette.bg }}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerClassName="flex-grow items-center justify-center px-4 py-8"
          keyboardShouldPersistTaps="handled"
        >
          <View className="w-full max-w-md">
            <View className="mb-8">
              <Text className="text-xs font-bold uppercase tracking-[4px] text-astra-accent">
                {APP_NAME}
              </Text>
              <Text className="mt-2 text-3xl font-bold tracking-tight text-astra-text">
                {title}
              </Text>
              {subtitle ? (
                <Text className="mt-2 text-base text-astra-muted">{subtitle}</Text>
              ) : (
                <Text className="mt-2 text-base text-astra-muted">{APP_TAGLINE}</Text>
              )}
            </View>
            <View className="rounded-2xl border border-astra-border bg-astra-surface p-5 shadow-card dark:shadow-none">
              {children}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
