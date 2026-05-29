import { Text, View } from 'react-native';

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className = '' }: CardProps) {
  return (
    <View className={`rounded-xl border border-astra-border bg-astra-surface/90 p-4 ${className}`}>
      {children}
    </View>
  );
}

type StatCardProps = {
  label: string;
  value: string | number;
  accent?: string;
};

export function StatCard({ label, value, accent = 'text-astra-accent' }: StatCardProps) {
  return (
    <Card className="flex-1 min-w-[140px]">
      <Text className={`text-2xl font-bold ${accent}`}>{value}</Text>
      <Text className="mt-1 text-xs uppercase tracking-wider text-astra-muted">{label}</Text>
    </Card>
  );
}
