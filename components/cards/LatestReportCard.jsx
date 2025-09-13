import React, { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Box } from "../ui/box";
import { useWindowDimensions } from "react-native";
import { VStack } from "../ui/vstack";
import { getAllReports } from "@/api/controller/report.controller";
import { format } from "date-fns"; // Added missing import

const LatestReportCard = () => {
  const { width } = useWindowDimensions();
  const [reports, setReports] = useState([]); // Renamed to plural for clarity
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const result = await getAllReports();
      if (result.status === 200) {
        // Use numeric value or import HttpStatus
        setReports(result.data);
      } else {
        console.warn("Failed to fetch reports:", result);
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const latestReport = useMemo(() => {
    if (!reports.length) return null;

    // Sort and get the latest report
    const sortedReports = [...reports].sort((a, b) => {
      const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(0);
      const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(0);
      return dateB - dateA; // Sort descending (newest first)
    });

    return sortedReports[0]; // Return the first (latest) report
  }, [reports]);

  // Format date only if we have a report
  const formattedDate = latestReport?.timestamp?.toDate
    ? format(latestReport.timestamp.toDate(), "MMM d | h:mma")
    : "";

  // Show loading state
  if (loading) {
    return (
      <Card className="lg:border-2 h-96 lg:flex lg:flex-row lg:justify-between rounded-xl items-center justify-center">
        <Text>Loading latest report...</Text>
      </Card>
    );
  }

  // Show message if no reports available
  if (!latestReport) {
    return (
      <Card className="lg:border-2 h-96 lg:flex lg:flex-row lg:justify-between rounded-xl items-center justify-center">
        <VStack className="items-center">
          <Heading>No Reports Available</Heading>
          <Text>There are no reports to display at this time.</Text>
          <Button
            className="my-4 rounded-xl bg-[#28a745] hover:bg-[#218838] transitions-colors"
            onPress={fetchReport}
          >
            <ButtonText>Refresh</ButtonText>
          </Button>
        </VStack>
      </Card>
    );
  }

  return (
    <Card className="lg:border-2 h-96 lg:flex lg:flex-row lg:justify-between rounded-xl">
      <VStack className="h-full justify-between p-4" space="xl">
        <VStack>
          <Heading>Latest Report</Heading>
          <Text className="text-lg font-semibold mt-2">
            {latestReport.title || "Untitled Report"}
          </Text>
          <Text className="text-gray-500">{formattedDate}</Text>
          {latestReport.description && (
            <Text className="mt-2 line-clamp-3">
              {latestReport.description}
            </Text>
          )}
        </VStack>

        <Button className="my-4 rounded-xl bg-[#28a745] hover:bg-[#218838] transitions-colors">
          <ButtonText>Respond</ButtonText>
        </Button>
      </VStack>
      <Box className="w-1/2">
        <Image
          className={`rounded-xl ${width < 700 ? "hidden" : ""}`}
          size="full"
          source={{
            uri:
              latestReport.images && latestReport.images.length > 0
                ? latestReport.images[0]
                : "https://via.placeholder.com/300x200?text=No+Image",
          }}
          alt="Report image"
        />
      </Box>
    </Card>
  );
};

export default LatestReportCard;
