import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
  Image,
  TouchableOpacity,
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
  Eye,
  X,
  SortAsc,
  SortDesc,
} from "lucide-react-native";
import SearchBar from "@/components/inputs/searchbar/SearchBar";
import { getAllReportsAsNotifications } from "@/api/controller/report.controller";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  // ✅ New states for image preview modal
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setImageModalOpen] = useState(false);

  // ✅ Filter + Sort state
  const [statusFilter, setStatusFilter] = useState("responded");
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const result = await getAllReportsAsNotifications();
      if (result.status === 200) {
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

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tier?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(
        (item) => item.status?.toLowerCase() === statusFilter
      );
    }

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
    setCurrentPage(1);
  }, [notifications, searchQuery, statusFilter, sortOrder]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications();
  }, []);

  // ✅ Pagination calculations
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredNotifications.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // ✅ Render pagination buttons (admin-style)
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

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, "MMM. dd, yyyy | h:mma");
    } catch {
      return "Invalid Date";
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  // ✅ Function to open image modal
  const openImageModal = (imageUri) => {
    setSelectedImage(imageUri);
    setImageModalOpen(true);
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
            className: "lg:col-span-8 ",
          }}
        >
          <Box>
            <Heading size="5xl" className="mt-6" bold>
              Notifications
            </Heading>
          </Box>
        </GridItem>

        {/* Search Bar */}
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

        {/* ✅ Filter + Sort */}
        <GridItem
          _extra={{
            className: "lg:col-span-12 py-4",
          }}
        >
          <HStack space="sm" className="items-center w-full justify-end">
            <HStack className="border border-gray-600 rounded-lg overflow-hidden">
              {["responded", "ignored"].map((status) => (
                <Pressable
                  key={status}
                  onPress={() => {
                    setStatusFilter(status);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 items-center ${
                    statusFilter === status ? "bg-green-500" : "bg-transparent"
                  }`}
                >
                  <Text
                    className={`${
                      statusFilter === status
                        ? "text-white font-semibold"
                        : "text-black"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Text>
                </Pressable>
              ))}
            </HStack>

            <Button variant="outline" size="sm" onPress={toggleSortOrder}>
              <ButtonIcon
                as={sortOrder === "desc" ? SortDesc : SortAsc}
                size={18}
              />
            </Button>
          </HStack>
        </GridItem>

        {/* Table */}
        <GridItem
          _extra={{
            className: "lg:col-span-12",
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
                            className={`text-sm font-medium ${
                              report.tier?.toLowerCase() === "low"
                                ? "text-green-600"
                                : report.tier?.toLowerCase() === "medium"
                                ? "text-yellow-600"
                                : report.tier?.toLowerCase() === "high"
                                ? "text-orange-600"
                                : report.tier?.toLowerCase() === "emergency"
                                ? "text-red-600"
                                : "text-gray-600"
                            }`}
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
                        <TableData>
                          <Button
                            size="sm"
                            variant="outline"
                            onPress={() => {
                              setSelectedReport(report);
                              setModalOpen(true);
                            }}
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
                    : `Displaying ${currentItems.length} reports on this page (${
                        sortOrder === "desc" ? "newest first" : "oldest first"
                      })`}
                </TableCaption>
              </Table>
            </Box>

            {/* ✅ Pagination footer */}
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
            <ModalCloseButton onPress={() => setModalOpen(false)}>
              <Icon as={X} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            {selectedReport && (
              <ScrollView className="p-4">
                <Box className="mb-4">
                  <Text className="text-lg font-bold">
                    {selectedReport.title || "Untitled Report"}
                  </Text>
                  <Text className="text-gray-500">
                    {formatDate(selectedReport.timestamp)}
                  </Text>
                </Box>

                {selectedReport.description && (
                  <Box className="mb-4">
                    <Text className="font-bold mb-1">Description:</Text>
                    <Text>{selectedReport.description}</Text>
                  </Box>
                )}

                {selectedReport.images &&
                  selectedReport.images.length > 0 && (
                    <Box className="mb-4">
                      <Text className="font-bold mb-2">Images:</Text>
                      <ScrollView horizontal>
                        {selectedReport.images.map((img, i) => (
                          <TouchableOpacity
                            key={i}
                            onPress={() => openImageModal(img)}
                          >
                            <Image
                              source={{ uri: img }}
                              className="w-20 h-20 rounded-md mr-2"
                            />
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </Box>
                  )}

                {selectedReport.location && (
                  <Box className="mb-4">
                    <Text className="font-bold mb-1">Location:</Text>
                    <Text>{selectedReport.location}</Text>
                  </Box>
                )}

                <Box className="mb-4">
                  <Text className="font-bold mb-1">Status:</Text>
                  <Text
                    className={`${
                      selectedReport.status?.toLowerCase() === "ignored"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {selectedReport.status || "N/A"}
                  </Text>
                </Box>
              </ScrollView>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* ✅ Image Preview Modal */}
      <Modal
        isOpen={isImageModalOpen}
        onClose={() => setImageModalOpen(false)}
        useRNModal
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading>Image Preview</Heading>
            <ModalCloseButton onPress={() => setImageModalOpen(false)}>
              <Icon as={X} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                className="w-full h-80 rounded-lg"
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
