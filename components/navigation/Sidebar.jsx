import { Slot, usePathname, useRouter } from "expo-router";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";

import {Button, ButtonText } from "../ui/button";

const SideBar = ({navItem}) => {

    const router = useRouter()
    const path = usePathname()
    const user = true

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
              {navItem.map(({name, route}, index) => {
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

        <Box className="flex-1 relative">
          <Slot />
          {user && (
            <Button
              className="absolute right-4 bottom-4">
              <ButtonText>
                Send a report
              </ButtonText>
            </Button>
            )}
        </Box>
      </HStack>
    </GluestackUIProvider>
  );
}

export default SideBar