import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { Text, TextInput, View } from 'react-native';

type AuthFormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder: string;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address';
  maxLength?: number;
};

export function AuthFormField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  secureTextEntry = false,
  autoCapitalize = 'none',
  keyboardType = 'default',
  maxLength,
}: AuthFormFieldProps<T>) {
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
            className="rounded-lg border border-astra-border bg-astra-panel px-4 py-3 text-astra-text"
            placeholder={placeholder}
            placeholderTextColor="#64748b"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry={secureTextEntry}
            autoCapitalize={autoCapitalize}
            keyboardType={keyboardType}
            autoCorrect={false}
            maxLength={maxLength}
            textContentType={secureTextEntry ? 'password' : keyboardType === 'email-address' ? 'emailAddress' : 'none'}
            autoComplete={secureTextEntry ? 'password' : keyboardType === 'email-address' ? 'email' : 'off'}
          />
          {error ? (
            <Text className="mt-1 text-sm text-astra-danger">{error.message}</Text>
          ) : null}
        </View>
      )}
    />
  );
}
