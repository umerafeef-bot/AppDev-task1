import { FlatList, SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Header } from '../src/components/Header';
import { ManageCardRow } from '../src/components/ManageCardRow';
import { useFlashcards } from '../src/context/FlashcardContext';
import { colors, spacing, typography } from '../src/theme';
import { Flashcard } from '../src/types/flashcard';
import { impact } from '../src/utils/haptics';

export default function ManageScreen() {
  const { cards } = useFlashcards();
  const [refreshKey, setRefreshKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setRefreshKey((k) => k + 1);
    }, [])
  );

  const handleBack = () => {
    impact();
    router.back();
  };

  const handleAdd = () => {
    impact();
    router.push('/add');
  };

  const renderItem = useCallback(
    ({ item, index }: { item: Flashcard; index: number }) => (
      <ManageCardRow card={item} index={index} total={cards.length} />
    ),
    [cards.length]
  );

  const ListEmpty = (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>No flashcards to manage</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <Header
        title="Manage Flashcards"
        leftAction={{ label: 'Back', onPress: handleBack }}
        rightAction={{ label: 'Add', onPress: handleAdd }}
      />
      <FlatList
        key={refreshKey}
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={ListEmpty}
        ItemSeparatorComponent={() => <View style={{ height: spacing.xs }} />}
        showsVerticalScrollIndicator={false}
      />
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {cards.length === 1 ? '1 flashcard' : `${cards.length} flashcards`}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  list: { flexGrow: 1, paddingHorizontal: spacing.md, paddingTop: spacing.sm },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  emptyText: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
  footer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
  },
  footerText: { ...typography.caption, color: colors.textSecondary },
});

ManageScreen.displayName = 'ManageScreen';