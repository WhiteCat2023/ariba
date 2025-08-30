import { Stack } from "expo-router";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout() {

  return (
    <GluestackUIProvider mode="light">
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="admin/(tabs)" />
          <Stack.Screen name="user/(tabs)" />
        </Stack>
      </AuthProvider>
    </GluestackUIProvider>
  );
}