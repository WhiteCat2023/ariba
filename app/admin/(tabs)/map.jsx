import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { getAllReports } from "@/api/controller/report.controller";
import {
  Table,
  TableBody,
  TableData,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Divider } from "@/components/ui/divider";
import WebMapWithMarks from "@/components/cards/components/WebMapWithMarks";
import { Grid, GridItem } from "@/components/ui/grid";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react-native";
import SearchBar from "@/components/inputs/searchbar/SearchBar";

const MapScreen = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const result = await getAllReports();
      if (result.status === 200) {
        setReports(result.data);
      } else {
        console.error("Error:", result.message);
      }
    } catch (error) {
      console.error("Failed to load reports:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadReports();
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
  };

  // Filter reports based on search query
  const filteredReports = reports.filter((report) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (report.title || "").toLowerCase().includes(searchLower) ||
      (report.location || "").toLowerCase().includes(searchLower) ||
      (report.status || "").toLowerCase().includes(searchLower)
    );
  });

  // Sort reports based on sortOrder
  const sortedReports = [...filteredReports].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.date || 0);
    const dateB = new Date(b.createdAt || b.date || 0);
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedReports = sortedReports.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    buttons.push(
      <Button
        key="prev"
        variant="outline"
        size="sm"
        onPress={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="mr-2"
      >
        <ButtonText>Previous</ButtonText>
      </Button>
    );

    // Page number buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={i === currentPage ? "solid" : "outline"}
          size="sm"
          onPress={() => goToPage(i)}
          className="mx-1"
        >
          <ButtonText>{i}</ButtonText>
        </Button>
      );
    }

    // Next button
    buttons.push(
      <Button
        key="next"
        variant="outline"
        size="sm"
        onPress={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="ml-2"
      >
        <ButtonText>Next</ButtonText>
      </Button>
    );

    return buttons;
  };

  // Extract coordinate arrays from reports
  const reportCoordinates = reports
    .filter((report) => report.location && Array.isArray(report.location))
    .map((report) => report.location);

  console.log("Report coordinates:", reportCoordinates);

  return (
    <SafeAreaView className="flex-1 bg-[#D9E9DD] h-full">
      <StatusBar barStyle="dark-content" />
      <Grid
        _extra={{
          className: "lg:grid-cols-12 grid-cols-1 p-4",
        }}
      >
        <GridItem
          _extra={{
            className: "lg:col-span-8",
          }}
        >
          <Box>
            <Heading size="5xl" className="mt-6 text-gray-800">
              Maps
            </Heading>
          </Box>
        </GridItem>

        <GridItem
          className="items-end flex mt-6 lg:mt-0"
          _extra={{
            className: "lg:col-span-4",
          }}
        >
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search reports..."
          />
        </GridItem>

        <GridItem
          _extra={{
            className: "lg:col-span-12 py-6",
          }}
        >
          <Box className="flex-row justify-between items-center mb-4">
            <Text className="text-sm text-gray-600">
              {filteredReports.length} reports found
            </Text>
            <Button variant="outline" size="sm" onPress={toggleSortOrder}>
              <ButtonIcon as={ArrowUpDown} size={16} className="mr-2" />
              <ButtonText>
                {sortOrder === "desc" ? "Newest First" : "Oldest First"}
              </ButtonText>
            </Button>
          </Box>

          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <Card>
              <HStack className="flex-col lg:flex-row">
                <Box className="lg:w-1/2 w-full mb-4 lg:mb-0 lg:pr-4">
                  <Heading className="mb-4">Reports Overview</Heading>
                  <Table className="w-full">
                    <TableBody>
                      {paginatedReports.map((report) => (
                        <TableRow key={report.id || report._id}>
                          <TableData>
                            <Card variant="outline" className="p-3">
                              <VStack space="sm">
                                <Text size="lg" className="font-semibold">
                                  {report.title || "Untitled Report"}
                                </Text>
                                <Text size="sm" className="text-gray-600">
                                  {report.location || "Unknown location"}
                                </Text>
                                <Text
                                  size="sm"
                                  className={
                                    report.status === "completed"
                                      ? "text-green-600"
                                      : report.status === "pending"
                                      ? "text-yellow-600"
                                      : report.status === "failed"
                                      ? "text-red-600"
                                      : "text-gray-600"
                                  }
                                >
                                  Status: {report.status || "unknown"}
                                </Text>
                                {report.latitude && report.longitude && (
                                  <Text size="xs" className="text-gray-500">
                                    Coordinates: {report.latitude.toFixed(4)},{" "}
                                    {report.longitude.toFixed(4)}
                                  </Text>
                                )}
                                {report.location &&
                                  Array.isArray(report.location) && (
                                    <Text size="xs" className="text-gray-500">
                                      Location: [{report.location[0].toFixed(4)}
                                      , {report.location[1].toFixed(4)}]
                                    </Text>
                                  )}
                              </VStack>
                            </Card>
                          </TableData>
                        </TableRow>
                      ))}
                      {reports.length === 0 && !loading && (
                        <TableRow>
                          <TableData>
                            <Text className="text-center py-4 text-gray-500">
                              No reports found
                            </Text>
                          </TableData>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                  {filteredReports.length > 0 && (
                    <Box className="mt-6 flex-row justify-between items-center">
                      <Text className="text-sm text-gray-600">
                        Showing {startIndex + 1} to{" "}
                        {Math.min(endIndex, filteredReports.length)} of{" "}
                        {filteredReports.length} reports
                      </Text>

                      <Box className="flex-row items-center">
                        <Text className="text-sm text-gray-600 mr-3">
                          Page {currentPage} of {totalPages}
                        </Text>

                        <Box className="flex-row">
                          {renderPaginationButtons()}
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Box>

                <Box className="lg:w-1/2 w-full">
                  <Heading className="mb-4">Reports Map</Heading>
                  <Card variant="outline" className="h-96">
                    <WebMapWithMarks coordinates={reportCoordinates} />
                  </Card>
                  <Text className="mt-2 text-sm text-gray-600 text-center">
                    Showing {reportCoordinates.length} report locations on map
                  </Text>
                </Box>
              </HStack>
            </Card>
          </ScrollView>
        </GridItem>
      </Grid>
    </SafeAreaView>
  );
};

export default MapScreen;
