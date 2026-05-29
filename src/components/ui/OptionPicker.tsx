import { Pressable, Text, View } from 'react-native';

type Option<T extends string> = {
  value: T;
  label: string;
};

type OptionPickerProps<T extends string> = {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function OptionPicker<T extends string>({
  label,
  options,
  value,
  onChange,
}: OptionPickerProps<T>) {
  return (
    <View className="mb-4">
      <Text className="mb-2 text-xs font-semibold uppercase tracking-wider text-astra-muted">
        {label}
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((opt) => {
          const selected = opt.value === value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => onChange(opt.value)}
              className={`rounded-full border px-3 py-1.5 ${
                selected
                  ? 'border-astra-primary bg-astra-primary/20'
                  : 'border-astra-border bg-astra-panel'
              }`}
            >
              <Text
                className={`text-xs font-semibold uppercase ${
                  selected ? 'text-astra-primary' : 'text-astra-muted'
                }`}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

type FilterChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function FilterChip({ label, selected, onPress }: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-full border px-3 py-1 ${
        selected ? 'border-astra-accent bg-astra-accent/10' : 'border-astra-border'
      }`}
    >
      <Text className={`text-xs ${selected ? 'text-astra-accent' : 'text-astra-muted'}`}>
        {label}
      </Text>
    </Pressable>
  );
}
