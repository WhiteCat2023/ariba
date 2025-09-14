import React, { useEffect, useState, useCallback } from "react";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { getAllReports } from "@/api/controller/report.controller";
import SearchBar from "@/components/inputs/searchbar/SearchBar";
import { Grid, GridItem } from "@/components/ui/grid";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
  TableData,
  TableCaption,
} from "@/components/ui/table";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  ArrowUpDown,
} from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { ActivityIndicator, Image } from "react-native";
import { RefreshControl, ScrollView, View } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { format } from "date-fns";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
} from "@/components/ui/modal";
import { Card } from "@/components/ui/card";
import { Pressable } from "@/components/ui/pressable";
import { Icon } from "@/components/ui/icon";

const Reports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [sortedReports, setSortedReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState("desc"); // 'desc' for newest first, 'asc' for oldest first
  const router = useRouter();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    // Sort reports whenever reports or sortOrder changes
    const sorted = [...reports].sort((a, b) => {
      const dateA = getTimestamp(a);
      const dateB = getTimestamp(b);

      if (sortOrder === "desc") {
        return dateB - dateA; // Newest first
      } else {
        return dateA - dateB; // Oldest first
      }
    });

    setSortedReports(sorted);

    if (searchQuery) {
      const filtered = sorted.filter(
        (report) =>
          report.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          report.id?.toString().includes(searchQuery)
      );
      setFilteredReports(filtered);
      setCurrentPage(1);
    } else {
      setFilteredReports(sorted);
    }
  }, [searchQuery, reports, sortOrder]);

  // Helper function to extract timestamp from various field names
  const getTimestamp = (report) => {
    const timestamp =
      report.timestamp || report.createdAt || report.date || report.created;
    if (!timestamp) return 0;

    try {
      if (timestamp.toDate && typeof timestamp.toDate === "function") {
        return timestamp.toDate().getTime();
      } else if (timestamp instanceof Date) {
        return timestamp.getTime();
      } else if (
        typeof timestamp === "string" ||
        typeof timestamp === "number"
      ) {
        return new Date(timestamp).getTime();
      }
      return 0;
    } catch (error) {
      return 0;
    }
  };

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredReports.slice(startIndex, endIndex);

  const loadReports = async () => {
    setLoading(true);
    try {
      const result = await getAllReports();
      if (result.status === 200) {
        setReports(result.data);
        // Don't set filteredReports here, let the useEffect handle sorting
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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setCurrentPage(1);
    loadReports();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      // Handle both Firebase timestamps and regular date strings/objects
      const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, "MMM d, yyyy | h:mma");
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid Date";
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "desc" ? "asc" : "desc"));
    setCurrentPage(1);
  };

  const openReportModal = (report) => {
    console.log("Opening modal for report:", report);
    setSelectedReport(report);
    setModalOpen(true);
  };

  const closeReportModal = () => {
    setSelectedReport(null);
    setModalOpen(false);
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setImageModalOpen(false);
  };

  const handleReportAction = (reportId, action) => {
    console.log(`Action: ${action} on report: ${reportId}`);
    // Implement your action logic here
  };

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

    buttons.push(
      <Button
        key="first"
        variant="outline"
        size="sm"
        className="mx-1"
        disabled={currentPage === 1}
        onPress={() => goToPage(1)}
      >
        <ButtonIcon as={ChevronsLeft} size={16} />
      </Button>
    );

    buttons.push(
      <Button
        key="prev"
        variant="outline"
        size="sm"
        className="mx-1"
        disabled={currentPage === 1}
        onPress={() => goToPage(currentPage - 1)}
      >
        <ButtonIcon as={ChevronLeft} size={16} />
      </Button>
    );

    for (let page = startPage; page <= endPage; page++) {
      buttons.push(
        <Button
          key={page}
          variant={currentPage === page ? "solid" : "outline"}
          size="sm"
          className="mx-1 min-w-[40px]"
          onPress={() => goToPage(page)}
        >
          <ButtonText>{page}</ButtonText>
        </Button>
      );
    }

    buttons.push(
      <Button
        key="next"
        variant="outline"
        size="sm"
        className="mx-1"
        disabled={currentPage === totalPages}
        onPress={() => goToPage(currentPage + 1)}
      >
        <ButtonIcon as={ChevronRight} size={16} />
      </Button>
    );

    buttons.push(
      <Button
        key="last"
        variant="outline"
        size="sm"
        className="mx-1"
        disabled={currentPage === totalPages}
        onPress={() => goToPage(totalPages)}
      >
        <ButtonIcon as={ChevronsRight} size={16} />
      </Button>
    );

    return buttons;
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
    <>
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
              Reports
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
            <Box className="rounded-lg overflow-hidden w-full">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
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
                      <TableRow key={report.id || report._id}>
                        <TableData>
                          <Text className="font-medium">
                            {report.title || "Untitled Report"}
                          </Text>
                        </TableData>
                        <TableData>
                          <Text className="text-sm text-gray-500">
                            {formatDate(report.timestamp)}
                          </Text>
                        </TableData>
                        <TableData>
                          <Text
                            className={`text-sm font-medium ${
                              report.status === "completed"
                                ? "text-green-600"
                                : report.status === "pending"
                                ? "text-yellow-600"
                                : report.status === "failed"
                                ? "text-red-600"
                                : "text-gray-600"
                            }`}
                          >
                            {report.status || "unknown"}
                          </Text>
                        </TableData>
                        <TableData>
                          <HStack space="md">
                            <Button
                              size="sm"
                              variant="outline"
                              onPress={() => openReportModal(report)}
                            >
                              <ButtonText>View</ButtonText>
                            </Button>
                            <Button
                              size="sm"
                              variant="solid"
                              action="positive"
                              onPress={() =>
                                handleReportAction(
                                  report.id || report._id,
                                  "respond"
                                )
                              }
                            >
                              <ButtonText>Respond</ButtonText>
                            </Button>
                            <Button
                              size="sm"
                              variant="solid"
                              action="negative"
                              onPress={() =>
                                handleReportAction(
                                  report.id || report._id,
                                  "ignore"
                                )
                              }
                            >
                              <ButtonText>Ignore</ButtonText>
                            </Button>
                          </HStack>
                        </TableData>
                      </TableRow>
                    ))
                  )}
                </TableBody>
                <TableCaption className="font-normal">
                  {filteredReports.length === 0
                    ? "No reports available"
                    : `Displaying ${
                        currentItems.length
                      } reports on this page (${
                        sortOrder === "desc" ? "newest first" : "oldest first"
                      })`}
                </TableCaption>
              </Table>
            </Box>

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

                  <Box className="flex-row">{renderPaginationButtons()}</Box>
                </Box>
              </Box>
            )}
          </ScrollView>
        </GridItem>
      </Grid>

      {/* Report Details Modal */}
      <Modal isOpen={isModalOpen} onClose={closeReportModal} size="lg" useRNModal>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="xl">Report Details</Heading>
            <ModalCloseButton onPress={closeReportModal}>
              <Icon as={X} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            {selectedReport && (
              <VStack space="md">
                <Card className="p-4">
                  <Text className="font-bold text-lg">
                    {selectedReport.title || "Untitled Report"}
                  </Text>
                  <Text className="text-gray-600">
                    {formatDate(selectedReport.timestamp)}
                  </Text>
                </Card>

                {selectedReport.description && (
                  <Card className="p-4">
                    <Text className="font-semibold mb-2">Description:</Text>
                    <Text>{selectedReport.description}</Text>
                  </Card>
                )}

                {selectedReport.images && selectedReport.images.length > 0 && (
                  <Card className="p-4">
                    <Text className="font-semibold mb-3">Images:</Text>
                    <HStack space="sm" className="flex-wrap">
                      {selectedReport.images.map((image, index) => (
                        <Pressable
                          key={index}
                          onPress={() => openImageModal(image)}
                          className="w-20 h-20 m-1"
                        >
                          <Image
                            source={{ uri: image }}
                            className="w-full h-full rounded-md"
                            resizeMode="cover"
                          />
                        </Pressable>
                      ))}
                    </HStack>
                  </Card>
                )}

                {selectedReport.location && (
                  <Card className="p-4">
                    <Text className="font-semibold mb-2">Location:</Text>
                    <Text>{selectedReport.location}</Text>
                  </Card>
                )}

                <Card className="p-4">
                  <Text className="font-semibold mb-2">Status:</Text>
                  <Text
                    className={`font-medium ${
                      selectedReport.status === "completed"
                        ? "text-green-600"
                        : selectedReport.status === "pending"
                        ? "text-yellow-600"
                        : selectedReport.status === "failed"
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {selectedReport.status || "unknown"}
                  </Text>
                </Card>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Image View Modal */}
      <Modal isOpen={imageModalOpen} onClose={closeImageModal} size="lg" useRNModal>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="lg">Image Preview</Heading>
            <ModalCloseButton onPress={closeImageModal}>
              <Icon as={X}/>
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            {selectedImage && (
              <View className="flex-1 justify-center items-center">
                <Image
                  source={{ uri: selectedImage }}
                  className="w-full h-80 rounded-lg"
                  resizeMode="contain"
                />
                <Button
                  variant="outline"
                  className="mt-4"
                  onPress={closeImageModal}
                >
                  <ButtonText>Close</ButtonText>
                </Button>
              </View>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Reports;
