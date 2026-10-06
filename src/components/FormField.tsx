import {
  View,
  TextInput,
  Text,
  TextInputProps,
  StyleSheet,
  TextStyle,
  Platform,
} from 'react-native';
import { colors, radius, spacing, typography } from '../theme';
import { useState } from 'react';

interface Props extends TextInputProps {
  label: string;
  error?: string;
}

export function FormField({ label, error, style, ...textProps }: Props) {
  const [isFocused, setIsFocused] = useState(false);

  const containerStyle = [
    styles.container,
    {
      borderColor: error ? colors.danger : isFocused ? colors.primary : colors.border,
      backgroundColor: colors.card,
    },
  ];

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={containerStyle}>
        <TextInput
          {...textProps}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={colors.textTertiary}
          style={[styles.input, style]}
        />
      </View>
      {!!error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: spacing.md },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  container: {
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    minHeight: 52,
    backgroundColor: colors.card,
    justifyContent: 'center',
  },
  input: {
    ...typography.input,
    color: colors.textPrimary,
    paddingVertical: 0,
    ...(Platform.OS !== 'web' ? { textAlignVertical: 'top' } : null),
  } as TextStyle,
  error: { fontSize: 12, color: colors.danger, marginTop: 2, fontWeight: '500' },
});
