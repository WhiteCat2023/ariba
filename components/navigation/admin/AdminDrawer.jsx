import { Slot, usePathname, useRouter } from "expo-router";
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
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { useWindowDimensions } from "react-native";



const AdminDrawer = () => {

    const router = useRouter()
    const path = usePathname()
    
    const controls = [
      { 
        name: "Dashboard",
        route: "/admin"
      },
      {
        name: "Reports",
        route: "/admin/reports"
      },
      {
        name: "Map",
        route: "/admin/map"
      },
      {
        name: "Notifications",
        route: "/admin/notifications"
      },
        {
        name: "Profile",
        route: "/admin/profile"
      },
    ]

    return (
    <GluestackUIProvider>
      <HStack
       className='h-full bg-[#D9E9DD]'>
        {/* Sidebar */}
        <Box
          w={220}
          bg="$blue600"
          p="$4"
          justifyContent="flex-start"
        >
          <VStack space="4xl" className="w-72 p-4 hover:text-white border bg-white h-full rounded-xl m-4">
            <Box>
              <Text size="5xl" bold>Ariba</Text>
              <Text size="sm">Admin Dashboard</Text>
            </Box>
            
            <Box className="gap-y-4">
              {controls.map(({name, route}, index) => {
                const isActive = path === route;

                return(
                  <Pressable 
                    key={index}
                    onPress={() => router.push(route)}
                    >
                    <Text bold fontSize="lg" className={`${isActive ? "text-white bg-[#34A853]": "hover:bg-[#34A853] hover:text-white"} p-4 rounded-xl`}>{name}</Text>
                  </Pressable>
                )
              })}
            </Box>
            
          </VStack>
        </Box>

        <Box className="flex-1 ">
          <Slot />
        </Box>
      </HStack>
    </GluestackUIProvider>
  );
}

export default AdminDrawer