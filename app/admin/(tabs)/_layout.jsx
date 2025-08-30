import { useAuth } from "../../../context/AuthContext"
import { Platform, useWindowDimensions } from "react-native";
import { Redirect } from "expo-router";
import AdminTab from "../../../components/navigation/AdminTab";
import { AdminNavItem } from "@/enums/AdminNavItem";
import SideBar from "@/components/navigation/Sidebar";

export default function TabLayout() {
  const {session} = useAuth()
  const { width } = useWindowDimensions()
  const hideSidebar = width < 700 ? true: false;

  if(hideSidebar && session){
    return(
      <AdminTab navItem={AdminNavItem}/>
    );
  }else if(!hideSidebar && session){
    return(
      <SideBar navItem={AdminNavItem}/>
    );
  }else{
    return <Redirect  href="/"/>;
  }
  // return !session ? <Redirect  href="/"/> : <Slot/>
}