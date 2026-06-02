import { Text } from 'react-native';
import { GlassCard } from '@/components/ui/GlassCard';

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className = '' }: CardProps) {
  return <GlassCard className={className}>{children}</GlassCard>;
}

type StatCardProps = {
  label: string;
  value: string | number;
  accent?: string;
};

/** @deprecated Prefer MetricCard for new screens */
export function StatCard({ label, value, accent = 'text-astra-accent' }: StatCardProps) {
  return (
    <GlassCard className="min-w-[140px] flex-1">
      <Text className={`text-2xl font-bold ${accent}`}>{value}</Text>
      <Text className="mt-1 text-xs font-medium text-astra-muted">{label}</Text>
    </GlassCard>
  );
}
