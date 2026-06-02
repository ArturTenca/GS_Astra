import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { QUICK_VIEW_MODAL_MAX_WIDTH } from '@/constants/layout';
import { useTheme } from '@/hooks/useTheme';

type QuickViewModalShellProps = {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

const OPEN_MS = 280;
const CLOSE_MS = 260;

const easeOut = Easing.out(Easing.cubic);
const easeIn = Easing.in(Easing.cubic);

export function QuickViewModalShell({
  visible,
  title,
  onClose,
  children,
}: QuickViewModalShellProps) {
  const { palette, isDark } = useTheme();
  const [mounted, setMounted] = useState(visible);
  const backdropOpacity = useSharedValue(0);
  const panelOpacity = useSharedValue(0);
  const panelScale = useSharedValue(0.97);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      backdropOpacity.value = withTiming(1, { duration: OPEN_MS, easing: easeOut });
      panelOpacity.value = withTiming(1, { duration: OPEN_MS, easing: easeOut });
      panelScale.value = withTiming(1, { duration: OPEN_MS, easing: easeOut });
      return;
    }

    if (!mounted) return;

    backdropOpacity.value = withTiming(0, { duration: CLOSE_MS, easing: easeIn });
    panelScale.value = withTiming(0.98, { duration: CLOSE_MS, easing: easeIn });
    panelOpacity.value = withTiming(0, { duration: CLOSE_MS, easing: easeIn }, (finished) => {
      if (finished) {
        runOnJS(setMounted)(false);
      }
    });
  }, [visible, mounted, backdropOpacity, panelOpacity, panelScale]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const panelStyle = useAnimatedStyle(() => ({
    opacity: panelOpacity.value,
    transform: [{ scale: panelScale.value }],
  }));

  const backdropColor = isDark ? 'rgba(0,0,0,0.72)' : 'rgba(15,23,42,0.45)';

  return (
    <Modal visible={mounted} transparent animationType="none" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center p-4">
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFillObject, { backgroundColor: backdropColor }, backdropStyle]}
        />
        <Animated.View
          style={[
            panelStyle,
            {
              maxWidth: QUICK_VIEW_MODAL_MAX_WIDTH,
              width: '100%',
              maxHeight: '90%',
              backgroundColor: palette.surface,
            },
          ]}
          className="overflow-hidden rounded-3xl border border-astra-border shadow-card dark:shadow-none"
        >
          <View className="flex-row items-center justify-between border-b border-astra-border px-5 py-4">
            <Text className="flex-1 pr-3 text-base font-semibold text-astra-text">{title}</Text>
            <Pressable
              onPress={onClose}
              className="rounded-lg bg-astra-panel px-3 py-1.5 active:opacity-80"
              accessibilityLabel="Close"
            >
              <Text className="text-sm font-semibold text-astra-muted">Close</Text>
            </Pressable>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 20, paddingBottom: 28 }}
          >
            {children}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}
