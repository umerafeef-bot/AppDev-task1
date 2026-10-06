import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { PressableScale } from './PressableScale';
import { colors, spacing, typography } from '../theme';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  title: string;
  leftAction?: { label?: string; icon?: string; onPress: () => void };
  rightAction?: { label?: string; icon?: string; onPress: () => void };
  style?: StyleProp<ViewStyle>;
}

export function Header({ title, leftAction, rightAction, style }: Props) {
  return (
    <View style={[styles.header, style]}>
      {leftAction ? (
        <PressableScale onPress={leftAction.onPress} style={styles.sideButton}>
          {leftAction.icon ? (
            <Ionicons name={leftAction.icon as any} size={20} color={colors.primary} />
          ) : (
            <Text style={[styles.sideLabel, styles.sideLabelLeft]}>{leftAction.label ?? 'Back'}</Text>
          )}
        </PressableScale>
      ) : <View style={styles.sideButton} />}

      <Text style={styles.title} numberOfLines={1}>{title}</Text>

      {rightAction ? (
        <PressableScale onPress={rightAction.onPress} style={styles.sideButton}>
          {rightAction.icon ? (
            <Ionicons name={rightAction.icon as any} size={20} color={colors.primary} />
          ) : (
            <Text style={[styles.sideLabel, styles.sideLabelRight]}>{rightAction.label ?? 'Done'}</Text>
          )}
        </PressableScale>
      ) : <View style={styles.sideButton} />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    height: 44,
    marginBottom: spacing.sm,
  },
  sideButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  sideLabel: { fontSize: 16, fontWeight: '600' },
  sideLabelLeft: { color: colors.textSecondary },
  sideLabelRight: { color: colors.primary },
  title: {
    flex: 1,
    ...typography.title,
    color: colors.textPrimary,
    textAlign: 'center',
    fontSize: 18,
  },
});

Header.displayName = 'Header';
