import { SafeAreaView, View, StatusBar, ScrollView, Platform } from 'react-native';
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
// import Button from '../components/button/Button';
import { signOut } from '../api/controller/auth.controller';
import StatCard from '../components/cards/StatCard';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import SearchBar from '../components/inputs/searchbar/SearchBar';
import BarGraphIcon from '../components/icons/BarGraphIcon';
import { Button, ButtonText } from "@/components/ui/button"
import LatestReportCard from '../components/cards/LatestReportCard';
import TierCard from '../components/cards/TierCard';
import { Box } from '@/components/ui/box';



export default function AdminDashboard() {

  // const isWeb = Platform.OS === "web";
  const {user} = useAuth();

  const isWeb = Platform.OS === "web"

  if(!isWeb){
    return (
      <SafeAreaView className="flex-1 bg-[#F7FBF9] w-xl">
        <StatusBar barStyle="dark-content" />
          <ScrollView>
            <Box className='m-4'>
              <Text>
                Greetings! Welcome Back
              </Text>
              <Heading size='3xl'>
                Admin
              </Heading>
            </Box>

            <SearchBar/>

            <StatCard
              header={"Reports responded this month"}
              data={102}
              icon={<BarGraphIcon/>}/>

            <StatCard
              header={"Pending Reports"}
              data={5}
              />

            <LatestReportCard/>

            <TierCard/>

          </ScrollView>
      </SafeAreaView>
    )
  }else{
    return(
      <Button 
        onPress={() => signOut(user)}
        className='m-4 rounded-xl'>
        <ButtonText>
          LogOut
        </ButtonText>
      </Button>
    )
  }
  
}