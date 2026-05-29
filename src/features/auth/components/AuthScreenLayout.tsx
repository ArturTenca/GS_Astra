import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { APP_NAME, APP_TAGLINE } from '@/constants';

type AuthScreenLayoutProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function AuthScreenLayout({ title, subtitle, children }: AuthScreenLayoutProps) {
  return (
    <SafeAreaView className="flex-1 bg-astra-bg">
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
              <Text className="text-xs font-semibold uppercase tracking-[3px] text-astra-accent">
                {APP_NAME}
              </Text>
              <Text className="mt-2 text-3xl font-bold text-astra-text">{title}</Text>
              {subtitle ? (
                <Text className="mt-2 text-base text-astra-muted">{subtitle}</Text>
              ) : (
                <Text className="mt-2 text-base text-astra-muted">{APP_TAGLINE}</Text>
              )}
            </View>
            <View className="rounded-2xl border border-astra-border bg-astra-surface/80 p-5">
              {children}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
