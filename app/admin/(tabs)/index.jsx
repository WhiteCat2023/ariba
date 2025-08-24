import { SafeAreaView, StatusBar, ScrollView, Platform } from 'react-native';
import { useAuth } from "../../../context/AuthContext";
import { useState } from "react";
// import Button from '../components/button/Button';
import { signOut } from '@/api/controller/auth.controller';
import StatCard from '@/components/cards/StatCard';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import SearchBar from '@/components/inputs/searchbar/SearchBar';
import BarGraphIcon from '@/components/icons/BarGraphIcon';
import { Button, ButtonText } from "@/components/ui/button"
import LatestReportCard from '@/components/cards/LatestReportCard';
import TierCard from '@/components/cards/TierCard';
import { Box } from '@/components/ui/box';
import { Grid, GridItem } from '@/components/ui/grid';



export default function AdminDashboard() {

  // const isWeb = Platform.OS === "web";
  const {user} = useAuth();

  const isWeb = Platform.OS === "web"

  return (
      <SafeAreaView className="flex-1 bg-[#D9E9DD] h-full">
        <StatusBar barStyle="dark-content" />
          <ScrollView className='p-4'>
            <Grid 
             _extra={{
              className: "lg:grid-cols-12 grid-cols-1 auto-rows-auto gap-4 h-full"
             }}>
              <GridItem
               _extra={{
                className: "lg:col-span-8"
               }}>
                <Box>
                  <Text 
                    size='lg'>
                    Greetings! Welcome Back
                  </Text>
                  <Heading size='5xl'>
                    Admin
                  </Heading>
                </Box>
              </GridItem>
              
              <GridItem 
                className='flex items-end '
                _extra={{
                  className: "lg:col-span-4"
                }}>
                <SearchBar/>
              </GridItem>
              
              <GridItem
                _extra={{
                    className: "lg:col-span-6"
                  }}>
                <StatCard
                  header={"Reports responded this month"}
                  data={102}
                  icon={<BarGraphIcon/>}/>
              </GridItem>
              <GridItem
                _extra={{
                  className: "lg:col-span-6"
                }}>
                <StatCard
                  header={"Pending Reports"}
                  data={5}
                  />
              </GridItem>
              <GridItem
               className='lg:h-[300px]'
                _extra={{
                  className: "lg:col-span-12"
                }}>
                <LatestReportCard/>
              </GridItem>
              <GridItem
                _extra={{
                  className: "lg:col-span-4"
                }}>
                <TierCard/>
              </GridItem>
              <GridItem
                _extra={{
                  className: "lg:col-span-4"
                }}>
                <TierCard/>
              </GridItem>
              <GridItem
                _extra={{
                  className: "lg:col-span-4"
                }}>
                <TierCard/>
              </GridItem>
            </Grid>
            {/* <Button 
              onPress={() => signOut(user)}
              className='m-8 rounded-xl'>
              <ButtonText>
                LogOut
              </ButtonText>
            </Button> */}
          </ScrollView>
      </SafeAreaView>
    )
}