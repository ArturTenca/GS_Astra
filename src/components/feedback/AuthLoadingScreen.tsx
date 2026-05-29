import { ActivityIndicator, Text, View } from 'react-native';
import { APP_NAME } from '@/constants';

export function AuthLoadingScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-astra-bg">
      <Text className="mb-4 text-xs font-semibold uppercase tracking-[3px] text-astra-accent">
        {APP_NAME}
      </Text>
      <ActivityIndicator size="large" color="#3b82f6" />
    </View>
  );
}
