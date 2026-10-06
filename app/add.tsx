import { SafeAreaView, ScrollView, KeyboardAvoidingView, StyleSheet, Platform } from 'react-native';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { FlashcardForm } from '../src/components/FlashcardForm';
import { Header } from '../src/components/Header';
import { useFlashcards } from '../src/context/FlashcardContext';
import { colors, spacing } from '../src/theme';
import { impact, success } from '../src/utils/haptics';

export default function AddScreen() {
  const { addFlashcard } = useFlashcards();

  const handleCancel = () => {
    impact();
    router.back();
  };

  const handleSubmit = useCallback(
    async (values: { question: string; answer: string }) => {
      await addFlashcard(values.question, values.answer);
      success();
      router.back();
    },
    [addFlashcard]
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.select({ ios: 'padding', android: 'height' })}
        keyboardVerticalOffset={80}
      >
        <Header title="Add Flashcard" leftAction={{ label: 'Cancel', onPress: handleCancel }} />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          <FlashcardForm submitLabel="Save Flashcard" onSubmit={handleSubmit} />
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

AddScreen.displayName = 'AddScreen';