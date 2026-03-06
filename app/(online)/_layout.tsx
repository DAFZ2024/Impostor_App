import { OnlineGameProvider } from "@/context/OnlineGameContext";
import { Stack } from "expo-router";

export default function OnlineLayout() {
  return (
    <OnlineGameProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#050610" },
          animation: "fade",
        }}
      >
        <Stack.Screen name="join" />
        <Stack.Screen name="lobby" />
        <Stack.Screen name="play" />
      </Stack>
    </OnlineGameProvider>
  );
}
