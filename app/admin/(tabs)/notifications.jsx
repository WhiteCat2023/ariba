import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  View,
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
  TableCaption,
} from "@/components/ui/table";
import { Text } from "@/components/ui/text";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Grid, GridItem } from "@/components/ui/grid";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
} from "@/components/ui/modal";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Eye,
  CheckCircle,
  X,
} from "lucide-react-native";
import {
  getAllReportsAsNotifications,
  markReportAsRead,
} from "@/api/controller/report.controller";
import { format } from "date-fns";
import { useRouter } from "expo-router";
import SearchBar from "@/components/inputs/searchbar/SearchBar";
import { Icon } from "@/components/ui/icon";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState("desc");
  const router = useRouter();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const result = await getAllReportsAsNotifications();
      if (result.status === 200) {
        setNotifications(result.data);
        setFilteredNotifications(result.data);
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
    // Filter and sort logic
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

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = a.timestamp?.toDate
        ? a.timestamp.toDate()
        : new Date(a.timestamp);
      const dateB = b.timestamp?.toDate
        ? b.timestamp.toDate()
        : new Date(b.timestamp);

      return sortOrder === "desc"
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    });

    setFilteredNotifications(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [notifications, searchQuery, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  const markAllAsRead = async () => {
    try {
      // Filter unread notifications
      const unreadNotifications = notifications.filter(
        (notification) => !notification.read
      );

      // Mark all as read
      for (const notification of unreadNotifications) {
        await markReportAsRead(notification.id || notification._id);
      }

      // Update local state
      const updatedNotifications = notifications.map((notification) => ({
        ...notification,
        read: true,
      }));

      setNotifications(updatedNotifications);
      alert("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
      alert("Failed to mark all as read");
    }
  };

  const markAsRead = async (reportId) => {
    try {
      await markReportAsRead(reportId);

      // Update local state
      const updatedNotifications = notifications.map((notification) =>
        (notification.id || notification._id) === reportId
          ? { ...notification, read: true }
          : notification
      );

      setNotifications(updatedNotifications);

      // Also update the selected report if it's the one being marked as read
      if (
        selectedReport &&
        (selectedReport.id || selectedReport._id) === reportId
      ) {
        setSelectedReport({ ...selectedReport, read: true });
      }
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const openReportModal = (report) => {
    setSelectedReport(report);
    setModalOpen(true);

    // Mark as read when opening the modal
    if (!report.read) {
      markAsRead(report.id || report._id);
    }
  };

  const openImageModal = (imageUri) => {
    setSelectedImage(imageUri);
    setImageModalOpen(true);
  };

  const handleReportAction = (reportId, action) => {
    console.log(`${action} report ${reportId}`);
    // Implement your action logic here
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications();
  }, []);

  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredNotifications.slice(startIndex, endIndex);

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

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, "MMM d, yyyy | h:mma");
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid Date";
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
    <SafeAreaView>
      <StatusBar />
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
              Notifications
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
            placeholder="Search notifications..."
          />
        </GridItem>

        <GridItem
          _extra={{
            className: "lg:col-span-12 py-6",
          }}
        >
          <Box className="flex-row justify-between items-center mb-4">
            <Text className="text-sm text-gray-600">
              {filteredNotifications.length} reports found
            </Text>
            <HStack space="lg">
              <Button variant="outline" size="sm" onPress={markAllAsRead}>
                <ButtonIcon as={CheckCircle} size={16} className="mr-2" />
                <ButtonText>Mark all as Read</ButtonText>
              </Button>
              <Button variant="outline" size="sm" onPress={toggleSortOrder}>
                <ButtonIcon as={ArrowUpDown} size={16} className="mr-2" />
                <ButtonText>
                  {sortOrder === "desc" ? "Newest First" : "Oldest First"}
                </ButtonText>
              </Button>
            </HStack>
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
                    <TableHead>Tier</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length === 0 ? (
                    <TableRow>
                      <TableData colSpan={5} className="text-center py-8">
                        <Text>No reports found</Text>
                      </TableData>
                    </TableRow>
                  ) : (
                    currentItems.map((report) => (
                      <TableRow
                        key={report.id || report._id}
                        className={report.read ? "bg-gray-50" : "bg-white"}
                      >
                        <TableData>
                          <Text
                            className={`font-medium ${
                              report.read ? "text-gray-500" : "text-black"
                            }`}
                          >
                            {report.title || "Untitled Report"}
                            {!report.read && (
                              <Text className="text-red-500"> •</Text>
                            )}
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
                          <Text
                            className={`text-sm font-medium ${
                              report.tier === "Emergency"
                                ? "text-red-600"
                                : report.tier === "High"
                                ? "text-orange-600"
                                : report.tier === "Medium"
                                ? "text-yellow-600"
                                : report.tier === "Low"
                                ? "text-green-600"
                                : "text-gray-600"
                            }`}
                          >
                            {report.tier || "unknown"}
                          </Text>
                        </TableData>
                        <TableData>
                          <Button
                            size="sm"
                            variant="outline"
                            onPress={() => openReportModal(report)}
                          >
                            <ButtonIcon as={Eye} size={16} />
                            <ButtonText>View</ButtonText>
                          </Button>
                        </TableData>
                      </TableRow>
                    ))
                  )}
                </TableBody>
                <TableCaption className="font-normal">
                  {filteredNotifications.length === 0
                    ? "No reports available"
                    : `Displaying ${
                        currentItems.length
                      } reports on this page (${
                        sortOrder === "desc" ? "newest first" : "oldest first"
                      })`}
                </TableCaption>
              </Table>
            </Box>

            {filteredNotifications.length > 0 && (
              <Box className="mt-6 flex-row justify-between items-center">
                <Text className="text-sm text-gray-600">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, filteredNotifications.length)} of{" "}
                  {filteredNotifications.length} reports
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

      {/* Report Detail Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} useRNModal>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading>Report Details</Heading>
            <ModalCloseButton onPress={() => setModalOpen(false)} >
              <Icon as={X}/>
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            {selectedReport && (
              <ScrollView className="p-4">
                <VStack space="lg">
                  <Box>
                    <Text className="text-lg font-bold">
                      {selectedReport.title || "Untitled Report"}
                    </Text>
                    <Text className="text-gray-500">
                      {formatDate(selectedReport.timestamp)}
                    </Text>
                  </Box>

                  <Box className="flex-row justify-between">
                    <Box>
                      <Text className="text-sm text-gray-500">Status</Text>
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
                    </Box>

                    <Box>
                      <Text className="text-sm text-gray-500">Priority</Text>
                      <Text
                        className={`font-medium ${
                          selectedReport.tier === "Emergency"
                            ? "text-red-600"
                            : selectedReport.tier === "High"
                            ? "text-orange-600"
                            : selectedReport.tier === "Medium"
                            ? "text-yellow-600"
                            : selectedReport.tier === "Low"
                            ? "text-green-600"
                            : "text-gray-600"
                        }`}
                      >
                        {selectedReport.tier || "unknown"}
                      </Text>
                    </Box>
                  </Box>

                  {selectedReport.description && (
                    <Box>
                      <Text className="text-sm font-bold mb-2">
                        Description
                      </Text>
                      <Text>{selectedReport.description}</Text>
                    </Box>
                  )}

                  {selectedReport.location && (
                    <Box>
                      <Text className="text-sm font-bold mb-2">Location</Text>
                      <Text>{selectedReport.location}</Text>
                    </Box>
                  )}

                  {selectedReport.images &&
                    selectedReport.images.length > 0 && (
                      <Box>
                        <Text className="text-sm font-bold mb-2">Images</Text>
                        <ScrollView horizontal className="flex-row">
                          {selectedReport.images.map((image, index) => (
                            <TouchableOpacity
                              key={index}
                              className="mr-2"
                              onPress={() => openImageModal(image)}
                            >
                              <Image
                                source={{ uri: image }}
                                className="w-24 h-24 rounded-md"
                              />
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </Box>
                    )}

                  {!selectedReport.read && (
                    <Button
                      onPress={() =>
                        markAsRead(selectedReport.id || selectedReport._id)
                      }
                    >
                      <ButtonText>Mark as Read</ButtonText>
                    </Button>
                  )}
                </VStack>
              </ScrollView>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Image Modal */}
      <Modal isOpen={imageModalOpen} onClose={() => setImageModalOpen(false)} useRNModal>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading>Image Preview</Heading>
            <ModalCloseButton onPress={() => setImageModalOpen(false)} >
              <Icon as={X}/>
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                className="w-full h-64"
                resizeMode="contain"
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </SafeAreaView>
  );
};

export default Notifications;
