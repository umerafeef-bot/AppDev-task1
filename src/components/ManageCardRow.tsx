import { View, Text, StyleSheet, Alert } from 'react-native';
import { Flashcard } from '../types/flashcard';
import { colors, radius, spacing, typography, shadows } from '../theme';
import { IconButton } from './IconButton';
import { router } from 'expo-router';
import { useFlashcards } from '../context/FlashcardContext';
import { impact, warning } from '../utils/haptics';

interface Props {
  card: Flashcard;
  index: number;
  total: number;
}

export function ManageCardRow({ card, index, total }: Props) {
  const { deleteFlashcard } = useFlashcards();

  const handleEdit = () => {
    impact();
    router.push({ pathname: '/edit', params: { id: card.id } });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete this flashcard?',
      'This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            warning();
            await deleteFlashcard(card.id);
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.row}>
      <View style={styles.numberBadge}>
        <Text style={styles.number}>{index + 1}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.question} numberOfLines={2}>
          {card.question}
        </Text>
        <Text style={styles.answer} numberOfLines={1}>
          {card.answer}
        </Text>
      </View>
      <View style={styles.actions}>
        <IconButton icon="✏️" onPress={handleEdit} accessibilityLabel="Edit flashcard" />
        <IconButton icon="🗑️" onPress={handleDelete} accessibilityLabel="Delete flashcard" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
    gap: spacing.sm,
  },
  numberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: { color: '#fff', fontWeight: '700', fontSize: 13 },
  content: { flex: 1, marginRight: spacing.sm },
  question: { ...typography.body, color: colors.textPrimary, marginBottom: 2 },
  answer: { ...typography.caption, color: colors.textSecondary },
  actions: { flexDirection: 'row', gap: spacing.xs },
});

ManageCardRow.displayName = 'ManageCardRow';