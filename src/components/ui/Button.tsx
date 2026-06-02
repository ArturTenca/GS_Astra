import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost' | 'danger';
  disabled?: boolean;
  loading?: boolean;
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
}: ButtonProps) {
  const { palette } = useTheme();
  const isDisabled = disabled || loading;

  if (variant === 'primary') {
    return (
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        className={`overflow-hidden rounded-xl ${isDisabled ? 'opacity-50' : 'active:opacity-90'}`}
      >
        <View
          className="items-center px-4 py-3"
          style={{
            backgroundColor: palette.primary,
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="font-semibold text-white">{title}</Text>
          )}
        </View>
      </Pressable>
    );
  }

  const variantClasses = {
    ghost: 'border border-astra-border bg-astra-panel',
    danger: 'bg-astra-danger',
  } as const;

  const textClasses = {
    ghost: 'text-astra-text',
    danger: 'text-white',
  } as const;

  return (
    <Pressable
      className={`items-center rounded-xl px-4 py-3 ${variantClasses[variant]} ${isDisabled ? 'opacity-50' : ''}`}
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
