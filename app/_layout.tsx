import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FlashcardProvider } from '../src/context/FlashcardContext';
import { colors } from '../src/theme';

export default function RootLayout() {
  return (
    <FlashcardProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="manage" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen
          name="add"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="edit"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
      </Stack>
    </FlashcardProvider>
  );
}
