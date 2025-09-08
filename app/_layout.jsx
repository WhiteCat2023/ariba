import { Slot } from "expo-router";
import "@/global.css";
import { AuthProvider } from '@/context/AuthContext';
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

export default function RootLayout() {

  return (
    <GluestackUIProvider>
      <AuthProvider>
        <Slot/>
      </AuthProvider>
    </GluestackUIProvider>
  );
}