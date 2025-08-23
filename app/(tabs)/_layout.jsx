// import { Redirect, Slot } from "expo-router"
import { useAuth } from "../context/AuthContext"
import { Platform } from "react-native";
import { Redirect } from "expo-router";
import AdminTab from "../components/navigation/admin/AdminTab";
import AdminDrawer from "../components/navigation/admin/AdminDrawer";
import { Drawer } from "@/components/ui/drawer";


export default function TabLayout() {
  const {session} = useAuth()

  const isWeb = Platform.OS === "web";

  if(!isWeb && session){
    return(
      <AdminTab/>
    );
  }else if(isWeb && session){
    return(
      <AdminDrawer/>
    );
  }else{
    return <Redirect  href="/"/>;
  }
  // return !session ? <Redirect  href="/"/> : <Slot/>
}