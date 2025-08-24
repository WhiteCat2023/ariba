// import { Redirect, Slot } from "expo-router"
import { useAuth } from "../../../context/AuthContext"
import { Platform, useWindowDimensions } from "react-native";
import { Redirect } from "expo-router";
import AdminTab from "../../../components/navigation/admin/AdminTab";
import AdminDrawer from "../../../components/navigation/admin/AdminDrawer";

export default function TabLayout() {
  const {session} = useAuth()
  const { width } = useWindowDimensions()
  const hideSidebar = width < 700 ? true: false;

  if(hideSidebar && session){
    return(
      <AdminTab/>
    );
  }else if(!hideSidebar && session){
    return(
      <AdminDrawer/>
    );
  }else{
    return <Redirect  href="/"/>;
  }
  // return !session ? <Redirect  href="/"/> : <Slot/>
}