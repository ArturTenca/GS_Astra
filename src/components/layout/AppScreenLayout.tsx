import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type AppScreenLayoutProps = {
  children: React.ReactNode;
  centered?: boolean;
};

export function AppScreenLayout({ children, centered = false }: AppScreenLayoutProps) {
  return (
    <SafeAreaView className="flex-1 bg-astra-bg" edges={['left', 'right']}>
      <View
        className={`flex-1 px-4 py-4 ${centered ? 'items-center' : ''}`}
        style={centered ? { maxWidth: 768, width: '100%', alignSelf: 'center' } : undefined}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}
