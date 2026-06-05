import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { LandingIcon } from '@/features/landing/components/LandingIcon';
import { LANDING_FOOTER } from '@/features/landing/content/landing.content';
import { scrollToSection } from '@/features/landing/lib/scroll-to';

export function LandingFooter() {
  return (
    <View className="overflow-hidden bg-neutral-950">
      <View className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

      <View className="mx-auto w-[92%] py-16 sm:w-[85%] sm:py-20 md:w-[80%]">
        <View className="mb-12 flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <View className="max-w-md flex-1">
            <Text className="mb-2 font-serif text-3xl text-white sm:text-4xl">{LANDING_FOOTER.brand}</Text>
            <Text className="mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-blue-400">
              {LANDING_FOOTER.tagline}
            </Text>
            <Text className="text-sm font-light leading-relaxed text-neutral-400">
              {LANDING_FOOTER.description}
            </Text>
            <View className="mt-6 flex-row items-center gap-2">
              <View className="h-2 w-2 rounded-full bg-blue-400 animate-ripple" />
              <Text className="text-xs text-neutral-500">{LANDING_FOOTER.contact.status}</Text>
            </View>
          </View>

          <View className="flex-row gap-12 sm:gap-16">
            <View>
              <Text className="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-300">
                Navegação
              </Text>
              {LANDING_FOOTER.nav.map((l) => (
                <Pressable key={l.label} onPress={() => scrollToSection(l.href)} className="mb-2.5">
                  <Text className="text-sm font-light text-neutral-500">{l.label}</Text>
                </Pressable>
              ))}
            </View>

            <View>
              <Text className="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-300">
                Contacto
              </Text>
              <View className="flex-row items-center gap-2">
                <LandingIcon name="mail" size={14} color="#60a5fa" />
                <Text className="text-sm font-light text-neutral-500">{LANDING_FOOTER.contact.email}</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row">
          <Text className="text-xs text-neutral-600">{LANDING_FOOTER.copyright}</Text>
          <Link href="/(auth)/login" asChild>
            <Pressable className="rounded-full border border-white/15 px-6 py-2.5 active:bg-white/5">
              <Text className="text-xs font-semibold text-white">{LANDING_FOOTER.loginCta}</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </View>
  );
}
