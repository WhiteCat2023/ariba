import { useAuth } from "../../../context/AuthContext"
import { useWindowDimensions } from "react-native";
import { Redirect, Slot, usePathname, useRouter } from "expo-router";
import { AdminNavItem } from "@/enums/AdminNavItem";
import SideBarH from "@/components/navigation/SideBarH";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Box } from "@/components/ui/box";
import TabH from "@/components/navigation/TabH";
import Tab from "@/components/navigation/Tab";
import SideBar from "@/components/navigation/Sidebar";
import React from "react";

export default function TabLayout() {
  const { session } = useAuth()
  const { width } = useWindowDimensions()
  const hideSidebar = width < 700 ? true: false;

  const router = useRouter()
  const path = usePathname()

  const isUser = true

  // if(hideSidebar && session){
  //   return(
  //     <Tab navItem={AdminNavItem}/>
  //   );
  // }else if(!hideSidebar && session){
  //   return(
  //     <SideBar navItem={AdminNavItem}/>
  //   );
  // }else{
  //   return <Redirect  href="/"/>;
  // }

  return (
    <GluestackUIProvider>
      <Box
       className={`h-full bg-[#D9E9DD] flex ${hideSidebar && session ? "flex-col":"flex-row"}`}>
        <SideBarH 
          navItem={AdminNavItem} 
          hide={hideSidebar && session}
          router={router}
          path={path}/>

        <Box className="flex-1 relative">
          <Slot />
        </Box>

        <TabH 
          navItem={AdminNavItem} 
          hide={hideSidebar && session} 
          router={router}
          path={path}/>
      </Box>
    </GluestackUIProvider>
  );
}