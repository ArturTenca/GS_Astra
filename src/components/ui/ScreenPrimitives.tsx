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
    <View className={`self-start rounded-full border px-2.5 py-0.5 ${containerVariants[variant]}`}>
      <Text className={`text-[10px] font-semibold uppercase tracking-wide ${textVariants[variant]}`}>
        {label}
      </Text>
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
        {subtitle ? (
          <Text className="mt-0.5 text-sm leading-5 text-astra-muted" numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
        {meta ? <Text className="mt-1.5 text-xs text-astra-muted">{meta}</Text> : null}
      </View>
      {badge ? <StatusBadge label={badge} variant={badgeVariant} /> : null}
    </View>
  );

  const shell = 'rounded-2xl border border-astra-border bg-astra-surface p-4 shadow-card dark:shadow-none';

  if (onPress) {
    return (
      <Pressable className={`${shell} active:opacity-85`} onPress={onPress}>
        {content}
      </Pressable>
    );
  }

  return <View className={shell}>{content}</View>;
}

type GridCardProps = {
  title: string;
  subtitle?: string;
  meta?: string;
  badge?: string;
  badgeVariant?: StatusBadgeProps['variant'];
  onPress?: () => void;
};

export function GridCard({
  title,
  subtitle,
  meta,
  badge,
  badgeVariant = 'default',
  onPress,
}: GridCardProps) {
  const shell =
    'min-h-[128px] flex-1 rounded-2xl border border-astra-border bg-astra-surface p-3 shadow-card dark:shadow-none';

  const content = (
    <View className="flex-1 justify-between">
      {badge ? (
        <StatusBadge label={badge} variant={badgeVariant} />
      ) : (
        <View className="h-5" />
      )}
      <View className="mt-2 flex-1">
        <Text className="text-sm font-semibold leading-5 text-astra-text" numberOfLines={2}>
          {title}
        </Text>
        {subtitle ? (
          <Text className="mt-1 text-xs leading-4 text-astra-muted" numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {meta ? (
        <Text className="mt-2 text-[10px] text-astra-muted" numberOfLines={1}>
          {meta}
        </Text>
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <Pressable className={`${shell} active:opacity-85`} onPress={onPress}>
        {content}
      </Pressable>
    );
  }

  return <View className={shell}>{content}</View>;
}

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <View className="items-center rounded-2xl border border-dashed border-astra-border bg-astra-panel/50 px-6 py-10">
      <Text className="text-lg font-semibold text-astra-text">{title}</Text>
      <Text className="mt-2 text-center text-sm leading-5 text-astra-muted">{message}</Text>
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

export function ScreenHeader({
  title,
  subtitle,
  trailing,
}: {
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
}) {
  return (
    <View className="mb-5 flex-row items-start justify-between gap-3">
      <View className="flex-1">
        <Text className="text-[11px] font-bold uppercase tracking-[4px] text-astra-accent">
          ASTRA
        </Text>
        <Text className="mt-1 text-2xl font-bold tracking-tight text-astra-text">{title}</Text>
        {subtitle ? <Text className="mt-1 text-sm text-astra-muted">{subtitle}</Text> : null}
      </View>
      {trailing}
    </View>
  );
}
