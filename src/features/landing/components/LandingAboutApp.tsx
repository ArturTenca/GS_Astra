import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { LandingIcon } from '@/features/landing/components/LandingIcon';
import { Reveal } from '@/features/landing/components/Reveal';
import { LANDING_ABOUT_APP } from '@/features/landing/content/landing.content';

export function LandingAboutApp() {
  return (
    <View nativeID="sobre" className="scroll-mt-14 bg-white px-4 py-14 sm:px-6 sm:py-16 md:py-20">
      <View className="mx-auto w-[92%] sm:w-[85%] md:w-[80%]">
        <Reveal className="mb-8 items-center">
          <Text className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
            {LANDING_ABOUT_APP.label}
          </Text>
          <Text className="text-center font-serif text-3xl tracking-tight text-neutral-900 sm:text-4xl md:text-5xl">
            {LANDING_ABOUT_APP.title}
            {'\n'}
            <Text className="italic text-neutral-500">{LANDING_ABOUT_APP.titleItalic}</Text>
          </Text>
          <View className="mx-auto mt-4 h-px w-12 bg-blue-200" />
        </Reveal>

        <Reveal delayClass="delay-100" className="mb-8">
          <Text className="mx-auto max-w-3xl text-center text-sm font-light leading-relaxed text-neutral-600 sm:text-base">
            {LANDING_ABOUT_APP.intro}
          </Text>
        </Reveal>

        <View className="flex-col gap-3 md:flex-row md:flex-wrap">
          {LANDING_ABOUT_APP.features.map((feature, i) => (
            <Reveal
              key={feature.title}
              delayClass={i === 1 ? 'delay-100' : i === 2 ? 'delay-200' : i === 3 ? 'delay-300' : ''}
              className="flex-1 md:min-w-[45%]"
            >
              <View className="h-full rounded-2xl border border-neutral-100 bg-neutral-50/80 p-5 transition-colors hover:border-blue-100">
                <View className="mb-3 h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10">
                  <LandingIcon name={feature.icon} size={22} color="#2563eb" />
                </View>
                <Text className="mb-2 text-lg font-semibold tracking-tight text-neutral-900">
                  {feature.title}
                </Text>
                <Text className="text-xs leading-relaxed text-neutral-500 sm:text-sm">
                  {feature.description}
                </Text>
              </View>
            </Reveal>
          ))}
        </View>

        <Reveal className="mt-10 items-center">
          <View className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-950 p-6 sm:p-8">
            <View className="pointer-events-none absolute inset-0 opacity-30">
              <View className="h-full w-full bg-gradient-to-br from-blue-600/35 via-transparent to-indigo-600/25" />
            </View>
            <View className="relative z-10 items-center">
              <Text className="mb-3 text-center font-serif text-xl text-white sm:text-2xl">
                Pronto para operar?
              </Text>
              <Text className="mb-6 text-center text-xs text-neutral-400 sm:text-sm">
                Inicie sessão e aceda ao painel completo de missões, colónias e alertas.
              </Text>
              <Link href="/(auth)/login" asChild>
                <Pressable className="rounded-full bg-white px-8 py-3.5 active:opacity-90">
                  <Text className="text-xs font-semibold text-neutral-950">
                    {LANDING_ABOUT_APP.cta}
                  </Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </Reveal>
      </View>
    </View>
  );
}
