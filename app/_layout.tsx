import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { GameProvider } from '@/context/GameContext';

export default function RootLayout() {
  return (
    <GameProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0b0c10' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="setup" />
        <Stack.Screen name="role-reveal" />
        <Stack.Screen name="discussion" />
        <Stack.Screen name="voting" />
        <Stack.Screen name="results" />
        <Stack.Screen name="rules" />
      </Stack>
      <StatusBar style="light" />
    </GameProvider>
  );
}
