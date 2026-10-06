import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { colors, radius } from '../theme';

interface Props {
  progress: number;
  style?: StyleProp<ViewStyle>;
}

export function ProgressBar({ progress, style }: Props) {
  const clamped = Math.min(1, Math.max(0, progress));
  return (
    <View style={[styles.track, style]}>
      <View style={[styles.fill, { flex: clamped }, { backgroundColor: colors.primary }]} />
      <View style={{ flex: 1 - clamped }} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 6,
    flexDirection: 'row',
    backgroundColor: colors.border,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: radius.pill,
  },
});
