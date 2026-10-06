import { Text, StyleSheet } from 'react-native';
import { colors, typography } from '../theme';

interface Props {
  current: number;
  total: number;
}

export function CardCounter({ current, total }: Props) {
  return (
    <Text style={styles.counter} accessibilityLabel={`Card ${current} of ${total}`}>
      Card {current} of {total}
    </Text>
  );
}

const styles = StyleSheet.create({
  counter: {
    ...typography.counter,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
