import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View className="flex-1 items-center justify-center bg-astra-bg px-6">
        <Text className="text-xl font-bold text-astra-text">Route not found</Text>
        <Link href="/" className="mt-4">
          <Text className="text-astra-primary">Return home</Text>
        </Link>
      </View>
    </>
  );
}
