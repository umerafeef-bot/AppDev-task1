import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Flashcard } from '../types/flashcard';
import { flashcardStorage } from '../storage/flashcardStorage';
import { initialFlashcards } from '../data/flashcards';

interface FlashcardContextValue {
  cards: Flashcard[];
  isLoading: boolean;
  addFlashcard: (question: string, answer: string) => Promise<void>;
  updateFlashcard: (id: string, question: string, answer: string) => Promise<void>;
  deleteFlashcard: (id: string) => Promise<void>;
  reload: () => Promise<void>;
}

const FlashcardContext = createContext<FlashcardContextValue | undefined>(undefined);

export function useFlashcards() {
  const ctx = useContext(FlashcardContext);
  if (!ctx) {
    throw new Error('useFlashcards must be used within a FlashcardProvider');
  }
  return ctx;
}

export function FlashcardProvider({ children }: { children: React.ReactNode }) {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const persisted = await flashcardStorage.load();
      setCards(persisted && persisted.length > 0 ? persisted : initialFlashcards);
    } catch {
      setCards(initialFlashcards);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Load persisted flashcards once on mount. This sets initial state,
    // which is the idiomatic async-init pattern.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const persist = useCallback(async (next: Flashcard[]) => {
    setCards(next);
    await flashcardStorage.save(next);
  }, []);

  const addFlashcard = useCallback(async (question: string, answer: string) => {
    const trimmedQ = question.trim();
    const trimmedA = answer.trim();
    const newCard: Flashcard = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      question: trimmedQ,
      answer: trimmedA,
    };
    await persist([newCard, ...cards]);
  }, [cards, persist]);

  const updateFlashcard = useCallback(async (id: string, question: string, answer: string) => {
    const next = cards.map((c) =>
      c.id === id ? { ...c, question: question.trim(), answer: answer.trim() } : c
    );
    await persist(next);
  }, [cards, persist]);

  const deleteFlashcard = useCallback(async (id: string) => {
    const next = cards.filter((c) => c.id !== id);
    await persist(next);
  }, [cards, persist]);

  const value = useMemo(
    () => ({
      cards,
      isLoading,
      addFlashcard,
      updateFlashcard,
      deleteFlashcard,
      reload: load,
    }),
    [cards, isLoading, addFlashcard, updateFlashcard, deleteFlashcard, load]
  );

  return <FlashcardContext.Provider value={value}>{children}</FlashcardContext.Provider>;
}
