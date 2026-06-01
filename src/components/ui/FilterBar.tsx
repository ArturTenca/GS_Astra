import { Pressable, Text, View } from 'react-native';

type FilterChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function FilterChip({ label, selected, onPress }: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{ alignSelf: 'flex-start' }}
      className={`shrink-0 rounded-full border px-3 py-1.5 active:opacity-80 ${
        selected
          ? 'border-astra-accent bg-astra-accent/15'
          : 'border-astra-border bg-astra-panel'
      }`}
    >
      <Text
        className={`text-xs font-medium capitalize ${
          selected ? 'text-astra-accent' : 'text-astra-muted'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

type FilterRowProps = {
  label: string;
  children: React.ReactNode;
};

export function FilterRow({ label, children }: FilterRowProps) {
  return (
    <View className="mb-3">
      <Text className="mb-2 text-xs font-semibold uppercase tracking-wider text-astra-muted">
        {label}
      </Text>
      <View className="flex-row flex-wrap gap-2">{children}</View>
    </View>
  );
}
