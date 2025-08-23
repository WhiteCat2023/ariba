import { Slot } from "expo-router";
import { useState } from "react";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import {
  // Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { Drawer } from "expo-router/drawer"
import { GestureHandlerRootView } from "react-native-gesture-handler";
const AdminDrawer = () => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  return(
      <GestureHandlerRootView>
        <Drawer>
          <Drawer.Screen
            name="dashboard"
            options={{
              drawerLabel: "Dashboard",
              title: "Dashboard",
            }}>
          </Drawer.Screen>
        </Drawer>
      </GestureHandlerRootView>
  );

  // return (
  //   <GluestackUIProvider>
  //     {/* 🔓 Toggle Button (could be anywhere) */}
  //     <Button className="m-4 absolute top-12 left-4 z-50" onPress={() => setDrawerOpen(true)}>
  //       <ButtonText>☰</ButtonText>
  //     </Button>

  //     {/* 🌐 Slot for current screen */}
  //     <Slot />

  //     {/* 📦 Global Drawer */}
  //     <Drawer isOpen={isDrawerOpen} onClose={() => setDrawerOpen(false)} size="sm" anchor="left">
  //       <DrawerBackdrop />
  //       <DrawerContent>
  //         <DrawerHeader>
  //           <Heading size="lg">Menu</Heading>
  //         </DrawerHeader>
  //         <DrawerBody>
  //           <Text>Put your menu links here</Text>
  //         </DrawerBody>
  //         <DrawerFooter>
  //           <Button onPress={() => setDrawerOpen(false)}>
  //             <ButtonText>Close</ButtonText>
  //           </Button>
  //         </DrawerFooter>
  //       </DrawerContent>
  //     </Drawer>
  //   </GluestackUIProvider>
  // );
}

export default AdminDrawer