import { useAuth } from "../../../context/AuthContext"
import { Platform, useWindowDimensions } from "react-native";
import { Slot, usePathname, useRouter } from "expo-router";
import { UserNavItem } from "@/enums/UserNavItem";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import SideBarH from "@/components/navigation/SideBarH";
import TabH from "@/components/navigation/TabH";
import { Box } from "@/components/ui/box";
import { LinearGradient } from "@/components/ui/lineragradient/LinearGradient";
import { Send, X } from "lucide-react-native";
import SendNewReport from "@/components/modal/SendNewReport";
import React, { useState } from "react";
import { OverlayProvider } from "@gluestack-ui/overlay";
import { Fab, FabIcon, FabLabel } from "@/components/ui/fab";
import { HStack } from "@/components/ui/hstack";



const TabLayout = () => {

    const {role} = useAuth();
    const { width } = useWindowDimensions();
    const hideSidebar = width < 700 ? true: false;
    const [isOpen, setOpen] = useState(false);

    const router = useRouter()
    const path = usePathname()

    const isUser = role === "user" ? true : false;

    return(
            <OverlayProvider>
                <Box
                    className={`h-full bg-[#D9E9DD] flex ${hideSidebar ? "flex-col":"flex-row"}`}>
                    <SideBarH 
                        navItem={UserNavItem}
                        hide={hideSidebar}
                        router={router}
                        path={path}/>                    
                    <Box className="flex-1 ">
                        <Slot />                        
                        {isUser && (                           
                            <Fab
                                onPress={() => setOpen(true)}
                                size="sm"
                                placement="bottom right"
                                className="p-0">
                                    <LinearGradient
                                        className="w-full flex-1 items-center py-2 px-5 rounded-xl"
                                        colors={['#FF6348', '#FFA502']}
                                        start={[0, 1]}
                                        end={[3, 3]}>
                                            <HStack className="p-2 items-center">
                                                <FabIcon as={Send} size="lg"/>
                                                <FabLabel size="xl" bold>Send a request</FabLabel>
                                            </HStack>    
                                    </LinearGradient>
                            </Fab>
                            )}                            
                    </Box>                  
                    <TabH
                        navItem={UserNavItem}
                        isMobile={hideSidebar}
                        router={router}
                        path={path}/>
                    <SendNewReport isOpen={isOpen} onClose={() => setOpen(false)} />    
                </Box>
            </OverlayProvider>            
    )
}

export default TabLayout



    // if(Platform.OS === "android"){
    //      if(hideSidebar && session){
    //         return(
    //         <Tab navItem={UserNavItem}/>
    //         );
    //     }else if(!hideSidebar && session){
    //         return(
    //         <SideBar navItem={UserNavItem}/>
    //         );
    //     }else{
    //         return <Redirect  href="/"/>;
    //     }
    // }