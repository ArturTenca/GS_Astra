import { ScrollView, View } from 'react-native';
import { LandingAboutApp } from '@/features/landing/components/LandingAboutApp';
import { LandingFooter } from '@/features/landing/components/LandingFooter';
import { LandingHero } from '@/features/landing/components/LandingHero';
import { LandingNav } from '@/features/landing/components/LandingNav';
import { useLandingNavbar } from '@/features/landing/hooks/useLandingNavbar';

export function LandingPage() {
  const { scrolled, mobileOpen, onScroll, toggleMobile, closeMobile } = useLandingNavbar();

  return (
    <View className="landing-page min-h-screen flex-1 bg-white antialiased selection:bg-blue-100">
      <LandingNav
        scrolled={scrolled}
        mobileOpen={mobileOpen}
        onToggleMobile={toggleMobile}
        onCloseMobile={closeMobile}
      />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <LandingHero />
        <LandingAboutApp />
        <LandingFooter />
      </ScrollView>
    </View>
  );
}
