import { SafeAreaView, StatusBar, ScrollView, Platform } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import StatCard from "@/components/cards/StatCard";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import LatestReportCard from "@/components/cards/LatestReportCard";
import TierCard from "@/components/cards/TierCard";
import { Box } from "@/components/ui/box";
import { Grid, GridItem } from "@/components/ui/grid";
import SearchBar from "@/components/inputs/searchbar/SearchBar";
import { BarChart, LineChart } from "lucide-react-native";
import { getAllReports, getAllReportsWithFilter } from "@/api/controller/report.controller";
import { HttpStatus } from "@/enums/status";
import ProfileCard from "@/components/cards/ProfileCard";

export default function AdminDashboard() {

  const [pendingReports, setPendingReports] = useState({});
  const [respondedReports, setRespondedReports] = useState({});

  useEffect(() => {
    fetchPending()
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const result = await getAllReports(); 
      if (result.status === HttpStatus.OK) {
        setPendingReports(result.data);
        console.log("Reports:", result.data);
      } else {
        console.warn("Failed to fetch reports:", result);
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  const fetchPending = async () => {
    try {
      const result = await getAllReportsWithFilter("pending"); 
      if (result.status === HttpStatus.OK) {
        setRespondedReports(result.data);
        console.log("Reports:", result.data);
      } else {
        console.warn("Failed to fetch reports:", result);
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#D9E9DD] h-full">
      <StatusBar barStyle="dark-content" />
      <ScrollView className="p-4">
        <Grid
          className="gap-4 pb-8"
          _extra={{
            className:
              "lg:grid-cols-12 grid-cols-1 auto-rows-auto gap-4 h-full",
          }}
        >
          <GridItem
            _extra={{
              className: "lg:col-span-8",
            }}
          >
            <Box>
              <Text size="lg">Greetings! Welcome Back</Text>
              <Heading size="5xl">Admin</Heading>
            </Box>
          </GridItem>

          <GridItem
            className="flex items-end "
            _extra={{
              className: "lg:col-span-4",
            }}
          >
            <SearchBar />
          </GridItem>

          <GridItem
            _extra={{
              className: "lg:col-span-6",
            }}
          >
            <StatCard
              header={"Reports responded this month"}
              data={respondedReports ? respondedReports.length : "0"}
              icon={BarChart}
            />
          </GridItem>
          <GridItem
            _extra={{
              className: "lg:col-span-6",
            }}
          >
            <StatCard
              header={"Pending Reports"}
              data={pendingReports ? pendingReports.length : "0"}
              icon={LineChart}
            />
          </GridItem>
          <GridItem
            _extra={{
              className: "lg:col-span-12",
            }}
          >
            <LatestReportCard />
          </GridItem>

          <GridItem
            _extra={{
              className: "lg:col-span-4",
            }}
          >
            <TierCard tier={"Emergency"}/>
          </GridItem>

          <GridItem
            _extra={{
              className: "lg:col-span-4",
            }}
          >
            <TierCard tier={"High"}/>
          </GridItem>
          <GridItem
            _extra={{
              className: "lg:col-span-4",
            }}
          >
            {/* <TierCard /> */}
            <ProfileCard/>
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
  );
}
