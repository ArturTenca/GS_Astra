import { Text, View } from 'react-native';

type SectionTitleProps = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
};

export function SectionTitle({ title, subtitle, action }: SectionTitleProps) {
  return (
    <View className="mb-3 flex-row items-end justify-between gap-2">
      <View className="flex-1">
        <Text className="text-sm font-semibold text-astra-text">{title}</Text>
        {subtitle ? <Text className="mt-0.5 text-xs text-astra-muted">{subtitle}</Text> : null}
      </View>
      {action}
    </View>
  );
}
