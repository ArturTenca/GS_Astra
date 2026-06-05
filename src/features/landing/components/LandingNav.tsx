import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { LandingIcon } from '@/features/landing/components/LandingIcon';
import { LANDING_NAV } from '@/features/landing/content/landing.content';
import { scrollToSection } from '@/features/landing/lib/scroll-to';

type NavProps = {
  scrolled: boolean;
  mobileOpen: boolean;
  onToggleMobile: () => void;
  onCloseMobile: () => void;
};

export function LandingNav({ scrolled, mobileOpen, onToggleMobile, onCloseMobile }: NavProps) {
  const logoMain = scrolled ? 'text-neutral-950' : 'text-white';
  const logoSub = scrolled ? 'text-blue-600' : 'text-blue-300/90';

  const go = (id: string) => {
    onCloseMobile();
    scrollToSection(id);
  };

  return (
    <View
      className={`fixed top-0 z-50 w-full items-center transition-all duration-300 ${scrolled ? 'pt-2.5' : 'pt-3 sm:pt-4'}`}
    >
      <View
        className={`flex-row items-center gap-4 rounded-full px-4 py-2 transition-all duration-300 sm:gap-5 sm:px-5 sm:py-2.5 ${
          scrolled
            ? 'border border-white/40 bg-white/55 shadow-sm backdrop-blur-lg'
            : 'border border-transparent bg-transparent'
        }`}
      >
        <Pressable onPress={() => go('inicio')} className="z-50">
          <Text className={`font-serif text-[1.35rem] tracking-[0.18em] sm:text-2xl ${logoMain}`}>
            {LANDING_NAV.brand}
          </Text>
          <Text className={`mt-0.5 text-[7px] font-semibold uppercase tracking-[0.32em] sm:text-[8px] ${logoSub}`}>
            Mission Control
          </Text>
        </Pressable>

        <View
          className={`hidden flex-row items-center gap-0.5 rounded-full border px-1.5 py-1 backdrop-blur-md transition-colors duration-300 sm:flex ${
            scrolled ? 'border-neutral-200/60 bg-white/30' : 'border-white/10 bg-white/5'
          }`}
        >
          <Pressable onPress={() => go('inicio')} className="rounded-full px-3 py-1.5">
            <Text className={`text-xs font-medium ${scrolled ? 'text-neutral-700' : 'text-white/90'}`}>
              Início
            </Text>
          </Pressable>
          <Pressable onPress={() => go('sobre')} className="rounded-full px-3 py-1.5">
            <Text className={`text-xs font-medium ${scrolled ? 'text-neutral-700' : 'text-white/90'}`}>
              {LANDING_NAV.aboutLink}
            </Text>
          </Pressable>
        </View>

        <Link href="/(auth)/login" asChild>
          <Pressable className="z-50 hidden rounded-full bg-white px-4 py-2 shadow-lg shadow-white/10 sm:flex sm:px-5">
            <Text className="text-xs font-semibold tracking-wide text-neutral-950">{LANDING_NAV.cta}</Text>
          </Pressable>
        </Link>
      </View>

      <Pressable
        onPress={onToggleMobile}
        className={`absolute right-4 z-50 rounded-full p-2 sm:hidden ${scrolled ? 'top-2.5 bg-white/55 backdrop-blur-lg' : 'top-3'}`}
      >
        <LandingIcon name="menu" size={22} color={scrolled ? '#171717' : '#fff'} />
      </Pressable>

      <View
        className={`fixed inset-0 z-40 flex-col bg-neutral-950/95 px-6 pt-20 backdrop-blur-xl transition-all duration-300 sm:hidden ${
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <Pressable onPress={() => go('inicio')} className="border-b border-white/10 py-4">
          <Text className="font-serif text-lg text-white">Início</Text>
        </Pressable>
        <Pressable onPress={() => go('sobre')} className="border-b border-white/10 py-4">
          <Text className="font-serif text-lg text-white">{LANDING_NAV.aboutLink}</Text>
        </Pressable>
        <Link href="/(auth)/login" asChild>
          <Pressable onPress={onCloseMobile} className="mt-8 rounded-full bg-white px-8 py-4">
            <Text className="text-center text-sm font-semibold text-neutral-950">{LANDING_NAV.cta}</Text>
          </Pressable>
        </Link>
        <Pressable onPress={onCloseMobile} className="absolute right-6 top-6 p-2">
          <LandingIcon name="close" size={22} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}
