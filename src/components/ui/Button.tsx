import { ActivityIndicator, Pressable, Text } from 'react-native';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost' | 'danger';
  disabled?: boolean;
  loading?: boolean;
};

const variantClasses = {
  primary: 'bg-astra-primary',
  ghost: 'border border-astra-border bg-transparent',
  danger: 'bg-astra-danger',
} as const;

const textClasses = {
  primary: 'text-white',
  ghost: 'text-astra-text',
  danger: 'text-white',
} as const;

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      className={`items-center rounded-lg px-4 py-3 ${variantClasses[variant]} ${isDisabled ? 'opacity-50' : ''}`}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text className={`font-semibold ${textClasses[variant]}`}>{title}</Text>
      )}
    </Pressable>
  );
}
