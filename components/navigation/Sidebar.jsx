import { Slot, usePathname, useRouter } from "expo-router";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";

import {Button, ButtonText } from "../ui/button";
import { Icon } from "../ui/icon";
import { Camera } from "lucide-react-native";

const SideBar = ({navItem}) => {

    const router = useRouter()
    const path = usePathname()
    const user = true // connect ni sa role session

    return (
    <GluestackUIProvider>
      <HStack
       className='h-full bg-[#D9E9DD]'>
        <Box
          className="p-1 justify-start"
          w={220}
          bg="$blue600"
          // p="$4"
          // justifyContent="flex-start"
          
        >
          <VStack space="4xl" className="w-72 p-4 hover:text-white border bg-white h-full rounded-xl m-4">
            <Box>
              <Text size="5xl" bold>Ariba</Text>
              <Text size="sm">Admin Dashboard</Text>
            </Box>
            
            <Box className="gap-y-4">
              {navItem.map(({icon, name, route}, index) => {
                const isActive = path === route;

                return(
                  <Pressable 
                    key={index}
                    onPress={() => router.push(route)}
                    className={`${isActive ? "bg-[#34A853]": "hover:bg-[#34A853]"} group p-4 rounded-xl`}
                    >
                    
                    <Text 
                      bold 
                      fontSize="lg" 
                      className={`${isActive ? "text-white": "text-black group-hover:text-white"} flex items-center gap-2`}>
                        {/* <Icon className="text-typography-500" as={Camera} /> */}
                        <Icon 
                          as={icon} 
                          className={`${isActive ? "text-white": " group-hover:text-white"}`}
                          size="lgl"/>
                        {name}
                    </Text>
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