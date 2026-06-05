import { Link } from 'expo-router';
import { Image, Pressable, Text, View } from 'react-native';
import { LandingIcon } from '@/features/landing/components/LandingIcon';
import { LANDING_HERO, LANDING_IMAGES } from '@/features/landing/content/landing.content';
import { scrollToSection } from '@/features/landing/lib/scroll-to';

export function LandingHero() {
  return (
    <View nativeID="inicio" className="landing-hero-height relative w-full overflow-hidden bg-neutral-950">
      <View className="landing-hero-media">
        <View className="landing-hero-zoom animate-zoom-slow">
          <Image
            source={LANDING_IMAGES.hero}
            className="landing-hero-image"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            resizeMode="cover"
            accessibilityLabel="Campo de estrelas"
          />
        </View>
        <View className="landing-hero-fade-left absolute inset-0" />
      </View>

      <View className="landing-hero-height relative z-10 mx-auto flex w-[92%] flex-col justify-end px-1 pb-14 sm:w-[85%] sm:pb-20 md:w-[80%] md:pb-24">
        <View className="w-full max-w-3xl">
          <View className="animate-fade-in-up delay-100 mb-3 w-fit flex-row items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 glass-panel">
            <View className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-ripple" />
            <Text className="text-[9px] font-semibold uppercase tracking-widest text-neutral-200">
              {LANDING_HERO.badge}
            </Text>
          </View>

          <Text className="animate-fade-in-up delay-200 mb-4 font-serif text-[1.75rem] leading-[1.08] tracking-tight text-white drop-shadow-2xl sm:text-4xl md:text-5xl lg:text-6xl">
            {LANDING_HERO.headline[0]}
            {'\n'}
            {LANDING_HERO.headline[1]}{' '}
            <Text className="font-light italic text-blue-300 animate-color-shift">
              {LANDING_HERO.headlineAccent}
            </Text>
          </Text>

          <View className="animate-fade-in-up delay-300 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <Link href="/(auth)/login" asChild>
              <Pressable className="w-full rounded-full bg-white px-5 py-2.5 shadow-lg shadow-white/5 sm:w-auto sm:px-6">
                <Text className="text-center text-[11px] font-semibold text-neutral-950">
                  {LANDING_HERO.primaryCta}
                </Text>
              </Pressable>
            </Link>
            <Pressable
              onPress={() => scrollToSection('sobre')}
              className="w-full flex-row items-center justify-center gap-1.5 rounded-full border border-white/20 px-5 py-2.5 glass-panel sm:w-auto sm:px-6"
            >
              <Text className="text-[11px] font-semibold text-white">{LANDING_HERO.secondaryCta}</Text>
              <LandingIcon name="arrow-forward" size={14} color="#fff" />
            </Pressable>
          </View>
        </View>

        <Pressable
          onPress={() => scrollToSection('sobre')}
          style={{ bottom: 21 }}
          className="absolute left-0 right-0 hidden flex-row items-center justify-center gap-2 md:flex"
        >
          <Text className="text-[9px] uppercase tracking-widest text-white/50">Role para explorar</Text>
          <View className="h-px w-8 bg-white/20" />
        </Pressable>
      </View>
    </View>
  );
}
