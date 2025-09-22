import SideBarH from "@/components/navigation/SideBarH";
import TabH from "@/components/navigation/TabH";
import { Box } from "@/components/ui/box";
import { AdminNavItem } from "@/enums/AdminNavItem";
import { Slot, usePathname, useRouter } from "expo-router";
import React from "react";
import { useWindowDimensions } from "react-native";
import { useAuth } from "../../../context/AuthContext";

const TabLayout = () => {
  const { session } = useAuth()
  const { width } = useWindowDimensions()
  const hideSidebar = width < 700 ? true : false;

  const router = useRouter()
  const path = usePathname()

  // Only show TabH when sidebar is hidden and session exists
  // Also, pass isMobile={hideSidebar && session}
  return (
    <Box
      className={`h-full bg-[#D9E9DD] flex ${hideSidebar && session ? "flex-col" : "flex-row"}`}>
      <SideBarH
        navItem={AdminNavItem}
        hide={hideSidebar && session}
        router={router}
        path={path}
      />

      <Box className="flex-1 relative">
        <Slot />
      </Box>

      {(hideSidebar && session) && (
        <TabH
          navItem={AdminNavItem}
          isMobile={true}
          router={router}
          path={path}
        />
      )}
    </Box>
  );
}

export default TabLayout;