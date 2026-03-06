import { CustomAlert } from "@/components/CustomAlert";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { GameProvider } from "@/context/GameContext";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";
import IntroAnimation from "../components/IntroAnimation";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [showIntro, setShowIntro] = useState(true);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  // Redirect based on auth state
  useEffect(() => {
    if (loading || !appIsReady) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      // Not signed in and not in auth group → go to login
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      // Signed in and in auth group → go to home
      router.replace("/");
    }
  }, [user, loading, segments, appIsReady]);

  if (!appIsReady || loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#050610",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#e74c3c" />
      </View>
    );
  }

  return (
    <GameProvider>
      {showIntro && user ? (
        <IntroAnimation onFinish={() => setShowIntro(false)} />
      ) : (
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#050610" },
            animation: "fade",
          }}
        >
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="index" />
          <Stack.Screen name="setup" />
          <Stack.Screen name="role-reveal" />
          <Stack.Screen name="discussion" />
          <Stack.Screen name="voting" />
          <Stack.Screen name="results" />
          <Stack.Screen name="rules" />
          <Stack.Screen name="(online)" />
        </Stack>
      )}
      <StatusBar style="light" />
      <CustomAlert />
    </GameProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
