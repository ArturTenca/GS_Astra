import { Pressable, Text, View } from 'react-native';

type StatusBadgeProps = {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
};

const containerVariants = {
  default: 'border-astra-border bg-astra-panel',
  success: 'border-astra-success/40 bg-astra-success/10',
  warning: 'border-astra-warning/40 bg-astra-warning/10',
  danger: 'border-astra-danger/40 bg-astra-danger/10',
  info: 'border-astra-primary/40 bg-astra-primary/10',
} as const;

const textVariants = {
  default: 'text-astra-muted',
  success: 'text-astra-success',
  warning: 'text-astra-warning',
  danger: 'text-astra-danger',
  info: 'text-astra-primary',
} as const;

export function StatusBadge({ label, variant = 'default' }: StatusBadgeProps) {
  return (
    <View className={`self-start rounded-full border px-2 py-0.5 ${containerVariants[variant]}`}>
      <Text className={`text-xs font-semibold uppercase ${textVariants[variant]}`}>{label}</Text>
    </View>
  );
}

type ListItemProps = {
  title: string;
  subtitle?: string;
  meta?: string;
  badge?: string;
  badgeVariant?: StatusBadgeProps['variant'];
  onPress?: () => void;
};

export function ListItem({
  title,
  subtitle,
  meta,
  badge,
  badgeVariant = 'default',
  onPress,
}: ListItemProps) {
  const content = (
    <View className="flex-row items-center justify-between gap-3">
      <View className="flex-1">
        <Text className="text-base font-semibold text-astra-text">{title}</Text>
        {subtitle ? <Text className="mt-0.5 text-sm text-astra-muted">{subtitle}</Text> : null}
        {meta ? <Text className="mt-1 text-xs text-astra-muted">{meta}</Text> : null}
      </View>
      {badge ? <StatusBadge label={badge} variant={badgeVariant} /> : null}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        className="rounded-xl border border-astra-border bg-astra-surface/80 p-4 active:opacity-80"
        onPress={onPress}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View className="rounded-xl border border-astra-border bg-astra-surface/80 p-4">{content}</View>
  );
}

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <View className="items-center rounded-xl border border-dashed border-astra-border px-6 py-10">
      <Text className="text-lg font-semibold text-astra-text">{title}</Text>
      <Text className="mt-2 text-center text-sm text-astra-muted">{message}</Text>
    </View>
  );
}

export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <View className="items-center py-12">
      <Text className="text-sm text-astra-muted">{message}</Text>
    </View>
  );
}

export function ScreenHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View className="mb-6">
      <Text className="text-xs font-semibold uppercase tracking-[3px] text-astra-accent">
        ASTRA
      </Text>
      <Text className="mt-1 text-2xl font-bold text-astra-text">{title}</Text>
      {subtitle ? <Text className="mt-1 text-sm text-astra-muted">{subtitle}</Text> : null}
    </View>
  );
}
