import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useState, useEffect } from "react";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableData,
} from "@/components/ui/table";
import { Text } from "@/components/ui/text";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Grid, GridItem } from "@/components/ui/grid";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react-native";
import SearchBar from "@/components/inputs/searchbar/SearchBar";
import { getAllReportsAsNotifications } from "@/api/controller/report.controller";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext"; // 🔑 get logged-in user

const Notifications = () => {
  const { user } = useAuth(); // current logged-in user
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const result = await getAllReportsAsNotifications();
      if (result.status === 200) {
        // Filter: only logged-in user reports + responded/ignored
        const reports = result.data.filter(
          (r) =>
            r.uid === user?.uid &&
            (r.status?.toLowerCase() === "responded" ||
              r.status?.toLowerCase() === "ignored")
        );
        setNotifications(reports);
        setFilteredNotifications(reports);
      } else {
        console.error("Error:", result.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    let filtered = notifications;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tier?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by latest timestamp
    filtered.sort((a, b) => {
      const dateA = a.timestamp?.toDate
        ? a.timestamp.toDate()
        : new Date(a.timestamp);
      const dateB = b.timestamp?.toDate
        ? b.timestamp.toDate()
        : new Date(b.timestamp);
      return dateB.getTime() - dateA.getTime();
    });

    setFilteredNotifications(filtered);
    setCurrentPage(1);
  }, [notifications, searchQuery]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications();
  }, []);

  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredNotifications.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPaginationButtons = () => (
    <HStack space="sm">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onPress={() => goToPage(1)}
      >
        <ButtonIcon as={ChevronsLeft} size={16} />
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onPress={() => goToPage(currentPage - 1)}
      >
        <ButtonIcon as={ChevronLeft} size={16} />
      </Button>
      <Text>
        {currentPage} / {totalPages}
      </Text>
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        onPress={() => goToPage(currentPage + 1)}
      >
        <ButtonIcon as={ChevronRight} size={16} />
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        onPress={() => goToPage(totalPages)}
      >
        <ButtonIcon as={ChevronsRight} size={16} />
      </Button>
    </HStack>
  );

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, "MMM. dd, yyyy | h:mma");
    } catch {
      return "Invalid Date";
    }
  };

  const tierColor = (tier) => {
    switch (tier?.toLowerCase()) {
      case "emergency":
        return "text-red-600";
      case "high":
        return "text-orange-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <Box className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
        <Text className="mt-4">Loading reports...</Text>
      </Box>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#D9E9DD] h-full p-4">
      <StatusBar barStyle="dark-content" />
      <Grid
        _extra={{
          className: "lg:grid-cols-12 grid-cols-1 p-4",
        }}
      >
        <GridItem
        _extra={{
          className: "lg:col-span-8 "
        }}>
          <Box>
            <Heading size='5xl' className='mt-6' bold>Notifications</Heading>
          </Box>
      </GridItem>
      
      <GridItem
        className='items-end flex mt-6 lg:mt-0'
        _extra={{
          className: "lg:col-span-4 "
        }}>
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
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <Box className="rounded-lg overflow-hidden w-full bg-white p-4">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Title</TableHead>
                    <TableHead>Date Reported</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length === 0 ? (
                    <TableRow>
                      <TableData colSpan={4} className="text-center py-8">
                        <Text>No reports found</Text>
                      </TableData>
                    </TableRow>
                  ) : (
                    currentItems.map((report) => (
                      <TableRow key={report.id}>
                        <TableData>
                          <Text className="font-medium">
                            {report.title || "Untitled"}
                          </Text>
                        </TableData>
                        <TableData>
                          <Text className="text-sm text-gray-600">
                            {formatDate(report.timestamp)}
                          </Text>
                        </TableData>
                        <TableData>
                          <Text
                            className={`text-sm font-medium ${tierColor(
                              report.tier
                            )}`}
                          >
                            {report.tier || "N/A"}
                          </Text>
                        </TableData>
                        <TableData>
                          <Text
                            className={`text-sm font-medium ${
                              report.status?.toLowerCase() === "ignored"
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {report.status || "N/A"}
                          </Text>
                        </TableData>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Box>

            {filteredNotifications.length > itemsPerPage && (
              <Box className="mt-6 flex-row justify-between items-center">
                <Text className="text-sm text-gray-600">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, filteredNotifications.length)} of{" "}
                  {filteredNotifications.length} reports
                </Text>
                {renderPaginationButtons()}
              </Box>
            )}
          </ScrollView>
        </GridItem>
      </Grid>
    </SafeAreaView>
  );
};

export default Notifications;
