import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CONTENT_MAX_WIDTH } from '@/constants/layout';
import { useTheme } from '@/hooks/useTheme';

type AppScreenLayoutProps = {
  children: React.ReactNode;
  centered?: boolean;
};

export function AppScreenLayout({ children, centered = false }: AppScreenLayoutProps) {
  const { palette } = useTheme();

  return (
    <SafeAreaView
      className="flex-1 bg-astra-bg"
      edges={['top', 'right']}
      style={{ backgroundColor: palette.bg }}
    >
      <View className="flex-1 items-center px-5 py-3 md:px-8">
        <View
          className="w-full flex-1"
          style={{
            maxWidth: CONTENT_MAX_WIDTH,
            width: '100%',
            alignItems: centered ? 'center' : 'stretch',
          }}
        >
          {children}
        </View>
      </View>
    </SafeAreaView>
  );
}
