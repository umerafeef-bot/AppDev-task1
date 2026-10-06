import { Text, ViewStyle, StyleProp } from 'react-native';
import { PressableScale } from './PressableScale';
import { colors, radius, spacing, typography } from '../theme';
import { useCallback } from 'react';
import { impact } from '../utils/haptics';

interface Props {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  style?: StyleProp<ViewStyle>;
}

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  variant = 'primary',
  style,
}: Props) {
  const backgroundColor =
    variant === 'danger'
      ? disabled
        ? colors.danger
        : colors.dangerHover
      : variant === 'secondary'
      ? colors.card
      : disabled
      ? colors.primary
      : colors.primaryHover;

  const textColor = variant === 'secondary' ? colors.textPrimary : '#FFFFFF';
  const borderColor = variant === 'secondary' ? colors.border : 'transparent';
  const opacity = disabled ? 0.5 : 1;

  const handlePress = useCallback(() => {
    if (disabled) return;
    impact();
    onPress();
  }, [disabled, onPress]);

  return (
    <PressableScale
      onPress={handlePress}
      disabled={disabled}
      style={[
        {
          backgroundColor,
          borderRadius: radius.md,
          paddingVertical: spacing.md,
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 48,
          borderWidth: 1,
          borderColor,
          opacity,
        },
        style,
      ]}
    >
      <Text style={[typography.button, { color: textColor }]}>{label}</Text>
    </PressableScale>
  );
}
