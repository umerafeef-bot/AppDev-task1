import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography, shadows } from '../theme';
import { PrimaryButton } from './PrimaryButton';

interface Props {
  onAddPress: () => void;
}

export function EmptyState({ onAddPress }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Text style={styles.iconText}>?</Text>
      </View>
      <Text style={styles.title}>No flashcards yet</Text>
      <Text style={styles.subtitle}>
        Create your first flashcard to start learning.
      </Text>
      <PrimaryButton label="Create your first flashcard" onPress={onAddPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  icon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  iconText: { fontSize: 34, color: '#fff', fontWeight: '700' },
  title: { ...typography.title, color: colors.textPrimary },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 15,
  },
});
