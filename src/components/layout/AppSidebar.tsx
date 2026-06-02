import { Ionicons } from '@expo/vector-icons';
import { router, usePathname, type Href } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  SIDEBAR_ANIM_MS,
  SIDEBAR_WIDTH_COLLAPSED,
  SIDEBAR_WIDTH_EXPANDED,
} from '@/constants/layout';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useTheme } from '@/hooks/useTheme';
import { useSidebarStore } from '@/stores/sidebar.store';

type NavItem = {
  href: Href;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  badge?: string | number;
};

const NAV_ITEMS: NavItem[] = [
  { href: '/(app)', label: 'Home', icon: 'planet-outline' },
  { href: '/(app)/alerts', label: 'Alerts', icon: 'notifications-outline' },
  { href: '/(app)/missions', label: 'Missions', icon: 'rocket-outline' },
  { href: '/(app)/colonies', label: 'Colonies', icon: 'home-outline' },
  { href: '/(app)/incidents', label: 'Incidents', icon: 'warning-outline' },
];

type AppSidebarProps = {
  alertBadge?: string | number;
};

const MAIN_ROUTES = ['alerts', 'missions', 'colonies', 'incidents', 'profile'] as const;

const sidebarEase = Easing.out(Easing.cubic);

function isActive(pathname: string, href: string): boolean {
  if (href === '/(app)' || href === '/(app)/') {
    return !MAIN_ROUTES.some((segment) => pathname.includes(segment));
  }
  const segment = String(href).replace('/(app)/', '');
  return pathname.includes(segment);
}

export function AppSidebar({ alertBadge }: AppSidebarProps) {
  const { palette } = useTheme();
  const pathname = usePathname();
  const collapsed = useSidebarStore((s) => s.collapsed);
  const toggleCollapsed = useSidebarStore((s) => s.toggleCollapsed);
  const hydrateSidebar = useSidebarStore((s) => s.hydrate);
  const { data: profile } = useProfile();

  const width = useSharedValue(SIDEBAR_WIDTH_EXPANDED);

  useEffect(() => {
    void hydrateSidebar();
  }, [hydrateSidebar]);

  useEffect(() => {
    width.value = withTiming(
      collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH_EXPANDED,
      { duration: SIDEBAR_ANIM_MS, easing: sidebarEase },
    );
  }, [collapsed, width]);

  const sidebarStyle = useAnimatedStyle(() => ({
    width: width.value,
  }));

  return (
    <Animated.View
      style={[
        sidebarStyle,
        {
          backgroundColor: palette.tabBar,
          borderRightWidth: 1,
          borderRightColor: palette.tabBarBorder,
          overflow: 'hidden',
        },
      ]}
    >
      <SafeAreaView edges={['top', 'left', 'bottom']} className="flex-1">
        <View className="flex-1 px-2 py-3">
          <View
            className={`mb-4 px-1 ${collapsed ? 'items-center gap-1' : 'flex-row items-center justify-between'}`}
          >
            {!collapsed ? (
              <Text className="text-xs font-bold uppercase tracking-[3px] text-astra-accent">
                ASTRA
              </Text>
            ) : (
              <View className="h-8 w-8 items-center justify-center rounded-lg bg-astra-primary/20">
                <Text className="text-xs font-bold text-astra-primary">A</Text>
              </View>
            )}
            <Pressable
              onPress={() => void toggleCollapsed()}
              className="rounded-lg p-1.5 active:opacity-70"
              accessibilityLabel={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Ionicons
                name={collapsed ? 'chevron-forward-outline' : 'chevron-back-outline'}
                size={18}
                color={palette.tabInactive}
              />
            </Pressable>
          </View>

          <View className="flex-1 gap-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(pathname, item.href as string);
              const badge = item.href === '/(app)/alerts' ? alertBadge : undefined;

              return (
                <Pressable
                  key={item.label}
                  onPress={() => router.push(item.href)}
                  className={`rounded-xl px-2 active:opacity-80 ${
                    collapsed ? 'items-center py-2' : 'flex-row items-center py-2.5'
                  } ${active ? 'bg-astra-primary/15' : ''}`}
                  accessibilityLabel={item.label}
                >
                  <View className="relative w-9 shrink-0 items-center justify-center">
                    <Ionicons
                      name={item.icon}
                      size={22}
                      color={active ? palette.tabActive : palette.tabInactive}
                    />
                    {badge != null && badge !== 0 ? (
                      <View className="absolute -right-0.5 -top-0.5 min-h-[16px] min-w-[16px] items-center justify-center rounded-full bg-astra-danger px-1">
                        <Text className="text-[9px] font-bold text-white">{badge}</Text>
                      </View>
                    ) : null}
                  </View>
                  {!collapsed ? (
                    <Text
                      className={`ml-2 flex-1 text-sm font-semibold ${
                        active ? 'text-astra-primary' : 'text-astra-text'
                      }`}
                      numberOfLines={1}
                    >
                      {item.label}
                    </Text>
                  ) : null}
                </Pressable>
              );
            })}
          </View>

          <Pressable
            onPress={() => router.push('/(app)/profile')}
            className={`mt-2 rounded-xl border border-astra-border active:opacity-80 ${
              collapsed ? 'items-center py-2' : 'flex-row items-center px-2 py-2.5'
            } ${pathname.includes('profile') ? 'bg-astra-primary/15' : 'bg-astra-panel/50'}`}
            accessibilityLabel="Profile"
          >
            <View className="h-9 w-9 shrink-0 items-center justify-center rounded-full bg-astra-primary/25">
              <Ionicons name="person" size={20} color={palette.tabActive} />
            </View>
            {!collapsed ? (
              <View className="ml-2 min-w-0 flex-1">
                <Text className="text-sm font-semibold text-astra-text" numberOfLines={1}>
                  {profile?.displayName || 'Profile'}
                </Text>
                <Text className="text-xs text-astra-muted">Account</Text>
              </View>
            ) : null}
          </Pressable>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}
