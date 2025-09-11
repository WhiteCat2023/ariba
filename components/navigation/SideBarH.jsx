import { usePathname, useRouter } from "expo-router";
import { Box } from "../ui/box";
import { Pressable } from "../ui/pressable";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
import { Icon } from "../ui/icon";

const SideBarH = ({navItem, hide, router, path}) => {
    return(
        <Box
            className={`p-1 justify-start ${hide ? "hidden": ""}`}
            w={220}
            >
          <VStack space="4xl" className="w-72 p-4 hover:text-white border bg-white h-full rounded-xl m-4">
            <Box>
              <Text size="5xl" bold>Ariba</Text>
              <Text size="sm">Dashboard</Text>
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
    )
}

export default SideBarH