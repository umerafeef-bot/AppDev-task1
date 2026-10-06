import { Text, ImageStyle, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { PressableScale } from './PressableScale';
import { colors, radius } from '../theme';

interface Props {
  icon: React.ReactNode;
  label?: string;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ImageStyle>;
  accessibilityLabel?: string;
}

export function IconButton({
  icon,
  label,
  onPress,
  disabled = false,
  style,
  iconStyle,
  accessibilityLabel,
}: Props) {
  return (
    <PressableScale
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, style]}
    >
      {typeof icon === 'string' ? (
        <Text style={[styles.icon, iconStyle]}>{icon}</Text>
      ) : (
        icon
      )}
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    padding: 10,
    minHeight: 44,
    minWidth: 44,
  },
  icon: { fontSize: 20, lineHeight: 22 },
  label: { fontSize: 13, fontWeight: '500', color: colors.textSecondary, marginTop: 4 },
});
