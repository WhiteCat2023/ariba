import { getUserReports } from '@/api/controller/report.controller'
import ReportListItemCard from '@/components/cards/components/ReportListItemCard'
import { Box } from '@/components/ui/box'
import { HStack } from '@/components/ui/hstack'
import { Skeleton, SkeletonText } from '@/components/ui/skeleton'
import { Text } from '@/components/ui/text'
import { useAuth } from '@/context/AuthContext'
import React, { useEffect, useState } from 'react'
import { FlatList } from 'react-native'
import { format } from "date-fns";
import { Card } from '@/components/ui/card'
import { VStack } from '@/components/ui/vstack'
import { Heading } from '@/components/ui/heading'
import SearchBar from '@/components/inputs/searchbar/SearchBar'
import { Grid, GridItem } from '@/components/ui/grid'

const reports = () => {

  const {user} = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const loadReports = async () => {
        if (!user?.uid) return;
        setLoading(true);
        const result = await getUserReports(user.uid);
        if (result.status === 200) {
          setReports(result.data);
        } else {
          console.error("Error:", result.message);
        }
        setLoading(false);
      };

      loadReports();
  }, [user]);

  if (loading) {
    return (
      <Box className="w-[300px] gap-4 p-3 rounded-md bg-background-100">
        <Skeleton variant="sharp" className="h-[100px]" />
        <SkeletonText _lines={3} className="h-2" />
        <HStack className="gap-1 align-middle">
          <Skeleton variant="circular" className="h-[24px] w-[28px] mr-2" />
          <SkeletonText _lines={2} gap={1} className="h-2 w-2/5" />
        </HStack>
      </Box>
    );
  }

  if (reports.length === 0) {
    return (
      <Box>
        <Text>
          No reports found
        </Text>
      </Box>
    );
  }

  return (
    <Grid
      _extra={{
        className: "lg:grid-cols-12 grid-cols-1 p-4"
      }}>
      <GridItem
        _extra={{
          className: "lg:col-span-8 "
        }}>
          <Box>
            <Heading size='5xl' className='mt-6' bold>Reports</Heading>
          </Box>
        
      </GridItem>
      <GridItem
        className='items-end flex mt-6 lg:mt-0'
        _extra={{
          className: "lg:col-span-4 "
        }}>
        <SearchBar/>
      </GridItem>
      <GridItem
       _extra={{
        className: "lg:col-span-12"
       }}>
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 16, marginVertical: 16}}
          renderItem={({ item }) => {
            // Firestore timestamps need .toDate()
            const formattedDate = item.timestamp?.toDate
              ? format(item.timestamp.toDate(), "MMM d | h:mma") // → "Jan 9 | 12:00AM"
              : "";

            return (

                <ReportListItemCard
                  title={item.title}
                  date={formattedDate}
                />

            );
          }}
        />
      </GridItem>
    </Grid>
  );
}

export default reports