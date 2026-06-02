import { View } from 'react-native';

type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
};

/** Elevated card — light shadow / dark subtle border (reference dashboards). */
export function GlassCard({ children, className = '' }: GlassCardProps) {
  return (
    <View
      className={`rounded-2xl border border-astra-border bg-astra-surface p-4 shadow-card dark:shadow-none ${className}`}
    >
      {children}
    </View>
  );
}
