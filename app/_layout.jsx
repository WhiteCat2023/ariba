import { Slot, Stack } from "expo-router";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { AuthProvider } from '@/context/AuthContext';
import { Platform } from "react-native";

export default function RootLayout() {

  const isWeb = Platform.OS === "web";

  return (
    <GluestackUIProvider mode="light">
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="/admin/(tabs)" />
          {/* <Stack.Screen name="/user/(tabs)" /> */}
        </Stack>
        {/* {isWeb ? (
          <Slot />
        ) : (
          <Stack screenOptions={{ headerShown: false }}>
            <Slot />
          </Stack>
        )} */}
      </AuthProvider>
    </GluestackUIProvider>
  );
}