import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { Text, TextInput, View } from 'react-native';

type FormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder: string;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address';
  maxLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
};

export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  secureTextEntry = false,
  autoCapitalize = 'none',
  keyboardType = 'default',
  maxLength,
  multiline = false,
  numberOfLines = 4,
}: FormFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View className="mb-4">
          <Text className="mb-1 text-xs font-semibold uppercase tracking-wider text-astra-muted">
            {label}
          </Text>
          <TextInput
            className={`rounded-lg border border-astra-border bg-astra-panel px-4 py-3 text-astra-text ${multiline ? 'min-h-[100px]' : ''}`}
            placeholder={placeholder}
            placeholderTextColor="#64748b"
            value={value ?? ''}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry={secureTextEntry}
            autoCapitalize={autoCapitalize}
            keyboardType={keyboardType}
            autoCorrect={false}
            maxLength={maxLength}
            multiline={multiline}
            numberOfLines={multiline ? numberOfLines : 1}
            textAlignVertical={multiline ? 'top' : 'auto'}
          />
          {error ? (
            <Text className="mt-1 text-sm text-astra-danger">{error.message}</Text>
          ) : null}
        </View>
      )}
    />
  );
}
