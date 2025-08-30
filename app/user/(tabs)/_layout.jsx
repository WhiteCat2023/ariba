import { useAuth } from "../../../context/AuthContext"
import { useWindowDimensions } from "react-native";
import { Slot, usePathname, useRouter } from "expo-router";
import { UserNavItem } from "@/enums/UserNavItem";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import SideBarH from "@/components/navigation/SideBarH";
import TabH from "@/components/navigation/TabH";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { LinearGradient } from "@/components/ui/lineragradient/LinearGradient";
import { Icon } from "@/components/ui/icon";
import { Send } from "lucide-react-native";

const TabLayout = () => {

    const {session, loading} = useAuth()
    const { width } = useWindowDimensions()
    const hideSidebar = width < 700 ? true: false;

    const router = useRouter()
    const path = usePathname()

    const isUser = true

    // if(hideSidebar && session){
    //     return(
    //     <Tab navItem={UserNavItem}/>
    //     );
    // }else if(!hideSidebar && session){
    //     return(
    //     <SideBar navItem={UserNavItem}/>
    //     );
    // }else{
    //     return <Redirect  href="/"/>;
    // }
    
    return(
        <GluestackUIProvider>
            <Box
                className={`h-full bg-[#D9E9DD] flex ${hideSidebar && session ? "flex-col":"flex-row"}`}>

                    <SideBarH 
                        navItem={UserNavItem}
                        hide={hideSidebar && session}
                        router={router}
                        path={path}/>
                    
                    <Box className="flex-1 relative">
                        <Slot />
                        
                        {isUser && (
                            <Button
                            onPress={() => {
                                router.push(`/${user.uid}/new-report`)
                            }}
                            className="absolute right-4 bottom-4 p-0 rounded-xl">
                            <LinearGradient
                                className="w-full flex-1 items-center py-2 px-5 rounded-xl"
                                colors={['#FF6348', '#FFA502']}
                                start={[0, 1]}
                                end={[3, 3]}>
                                <ButtonText 
                                className='flex items-center gap-2'>
                                <Icon 
                                    as={Send}
                                    className='text-white'/>
                                Send a report
                                </ButtonText>
                            </LinearGradient>
                            </Button>
                            )}
                    </Box>
                    
                    <TabH
                        navItem={UserNavItem}
                        hide={hideSidebar && session}
                        router={router}
                        path={path}/>

            </Box>
        </GluestackUIProvider>
    )
}

export default TabLayout