import { Slot } from "expo-router";
import { AuthProvider } from './context/AuthContext';

export default function RootLayout() {
  return <AuthProvider><Slot/></AuthProvider>;
}

{/* <Stack screenOptions={{headerShown: false}}/> */}