import AsyncStorage from '@react-native-async-storage/async-storage';
import { Flashcard } from '../types/flashcard';
import { STORAGE_KEY_FLASHCARDS } from './keys';

export const flashcardStorage = {
  async load(): Promise<Flashcard[] | null> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY_FLASHCARDS);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return null;
      return parsed as Flashcard[];
    } catch (error) {
      console.warn('[storage] Failed to load flashcards', error);
      return null;
    }
  },

  async save(cards: Flashcard[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_FLASHCARDS, JSON.stringify(cards));
    } catch (error) {
      console.warn('[storage] Failed to save flashcards', error);
    }
  },
};
