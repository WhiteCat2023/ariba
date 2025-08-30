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
          <Stack.Screen name="forgot-password" options={{title: "forgot password"}}/>
          <Stack.Screen name="index" options={{title: "signin"}} />
          <Stack.Screen name="reset-password" options={{title: "reset password"}}/>
          <Stack.Screen name="signup" options={{title: "signup"}}/>
        </Stack>
      </AuthProvider>
    </GluestackUIProvider>
  );
}