import React, { useEffect, useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { FlatList } from "react-native";
import { getAllTierReportsWithFilter } from "@/api/controller/report.controller";
import { format, parseISO } from "date-fns";
import { HttpStatus } from "@/enums/status";
import { Divider } from "../ui/divider";
import { HStack } from "../ui/hstack";
import { VStack } from "../ui/vstack";

const TierCard = ({ tier }) => {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportsByTier();
  }, []);

  const fetchReportsByTier = async () => {
    try {
      setLoading(true);
      const result = await getAllTierReportsWithFilter(tier);
      if (result.status === HttpStatus.OK) {
        setReport(result.data);
      } else {
        console.warn("Failed to fetch reports:", result);
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  // Sort and get only the 3 latest reports
  const latestReports = useMemo(() => {
    if (!report.length) return [];

    return report
      .sort((a, b) => {
        // Convert timestamps to Date objects for comparison
        const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(0);
        const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(0);
        return dateB - dateA; // Sort descending (newest first)
      })
      .slice(0, 3); // Take only the first 3 items
  }, [report]);

  const renderReportItem = ({ item }) => {
    const formattedDate = item.timestamp?.toDate
      ? format(item.timestamp.toDate(), "MMM d | h:mma")
      : "";

    return (
      <Card className="rounded-xl mb-2" variant="outline">
        <HStack space="sm" >
          <Divider
            orientation="vertical"
            className="w-2 bg-green-500 rounded"
          />
          <Box className="flex-1">
            <Heading className="text-lg font-semibold" numberOfLines={1}>
              {item.title}
            </Heading>
            <Text size="xs" className="text-gray-500">
              {formattedDate}
            </Text>
          </Box>
        </HStack>
      </Card>
    );
  };
 
  const EmptyState = () => (
    <Box className="h-64 flex items-center justify-center">
      <Box className="items-center">
        <Text className="text-gray-400 text-lg mb-2">No reports found</Text>
        <Text className="text-gray-400 text-center">
          There are no reports available for this tier yet.
        </Text>
      </Box>
    </Box>
  );

  return (
    <Card size="lg" className="lg:border-2 rounded-xl h-96">
      <VStack space="lg">
        <Box className="flex flex-row justify-between">
          <Heading>{tier} Priority Reports</Heading>
        </Box>

        <Box className="flex-1">
          <FlatList
            data={latestReports}
            renderItem={renderReportItem}
            keyExtractor={(item, index) => item.id || index.toString()}
            ListEmptyComponent={!loading ? <EmptyState /> : null}
            showsVerticalScrollIndicator={false}
            scrollEnabled={latestReports.length > 3} // Only enable scroll if more than 3 items
          />
        </Box>
      </VStack>
    </Card>
  );
};

export default TierCard;
