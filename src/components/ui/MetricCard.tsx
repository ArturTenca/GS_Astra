import { Text, View } from 'react-native';
import { GlassCard } from '@/components/ui/GlassCard';
import { useTheme } from '@/hooks/useTheme';

type MetricCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  accentColor?: string;
  icon?: React.ReactNode;
};

export function MetricCard({ label, value, hint, accentColor, icon }: MetricCardProps) {
  const { palette } = useTheme();
  const color = accentColor ?? palette.accent;

  return (
    <GlassCard className="min-w-[46%] flex-1">
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <Text className="text-xs font-medium text-astra-muted">{label}</Text>
          <Text className="mt-1 text-2xl font-bold text-astra-text" style={{ color }}>
            {value}
          </Text>
          {hint ? <Text className="mt-1 text-xs text-astra-muted">{hint}</Text> : null}
        </View>
        {icon ? <View className="ml-2 opacity-80">{icon}</View> : null}
      </View>
    </GlassCard>
  );
}
