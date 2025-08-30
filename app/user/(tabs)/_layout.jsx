import { useAuth } from "../../../context/AuthContext"
import { Platform, useWindowDimensions } from "react-native";
import { Redirect, Tabs } from "expo-router";
import SideBar from "@/components/navigation/Sidebar";
import { UserNavItem } from "@/enums/UserNavItem";
import Tab from "@/components/navigation/Tab";

const TabLayout = () => {

    const {session} = useAuth()
    const { width } = useWindowDimensions()
    const hideSidebar = width < 700 ? true: false;

    if(hideSidebar && session){
        return(
        <Tab navItem={UserNavItem}/>
        );
    }else if(!hideSidebar && session){
        return(
        <SideBar navItem={UserNavItem}/>
        );
    }else{
        return <Redirect  href="/"/>;
    }
}

export default TabLayout