import { SafeAreaView, ScrollView, Platform, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { FlashcardForm } from '../src/components/FlashcardForm';
import { Header } from '../src/components/Header';
import { useFlashcards } from '../src/context/FlashcardContext';
import { colors, spacing } from '../src/theme';
import { impact, success } from '../src/utils/haptics';

export default function EditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { cards, updateFlashcard } = useFlashcards();

  const card = cards.find((c) => c.id === id);

  const handleCancel = useCallback(() => {
    impact();
    router.back();
  }, []);

  const handleSubmit = useCallback(
    async (values: { question: string; answer: string }) => {
      if (!card) return;
      await updateFlashcard(card.id, values.question, values.answer);
      success();
      router.back();
    },
    [updateFlashcard, card]
  );

  if (!card) {
    return <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.select({ ios: 'padding', android: 'height' })}
        keyboardVerticalOffset={80}
      >
        <Header title="Edit Flashcard" leftAction={{ label: 'Cancel', onPress: handleCancel }} />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          <FlashcardForm
            initialQuestion={card.question}
            initialAnswer={card.answer}
            submitLabel="Save Changes"
            onSubmit={handleSubmit}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { flex: 1, paddingHorizontal: spacing.md, paddingTop: spacing.sm },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: spacing.lg },
});

EditScreen.displayName = 'EditScreen';