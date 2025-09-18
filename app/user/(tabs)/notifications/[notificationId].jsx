import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  View,
  Modal,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { ChevronLeft, CheckCircle, X } from "lucide-react-native";
import { format } from "date-fns";
import { getAllReportsAsNotifications } from "@/api/controller/report.controller";

const NotificationDetail = () => {
  const { notificationId } = useLocalSearchParams();
  const router = useRouter();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const result = await getAllReportsAsNotifications();
        if (result.status === 200) {
          const found = result.data.find((r) => r.id === notificationId);
          setReport(found || null);
        }
      } catch (err) {
        console.error("Error fetching report:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [notificationId]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
      return format(date, "MMM. dd, yyyy | h:mma");
    } catch {
      return "Invalid Date";
    }
  };

  if (loading) {
    return (
      <Box className="flex-1 justify-center items-center bg-[#D9E9DD]">
        <ActivityIndicator size="large" />
        <Text className="mt-4">Loading notification...</Text>
      </Box>
    );
  }

  if (!report) {
    return (
      <SafeAreaView className="flex-1 bg-[#D9E9DD] h-full p-4">
        <Text className="text-center mt-20">Notification not found.</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 bg-green-600 py-3 px-6 rounded-lg self-center"
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#D9E9DD] h-full p-6">
      <StatusBar barStyle="dark-content" />

      {/* Page Header */}
<Heading size="4xl" className="text-left mb-6 mt-10 font-extrabold">
  NOTIFICATIONS
</Heading>

      <ScrollView className="h-full">
        <Box className="bg-white rounded-xl p-6 shadow-sm">
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="mb-6 flex-row items-center"
          >
            <Icon as={ChevronLeft} size="28" />
            <Text className="ml-2 text-lg">Back</Text>
          </TouchableOpacity>   

          {/* Horizontal Title + Meta Info */}
          <View className="flex-row justify-between items-center mb-6 flex-wrap">
            {/* Left Side: Title + Dot + Timestamp + Tier */}
            <View className="flex-row flex-wrap items-center flex-1 pr-2 font-roboto">
              <Heading size="2xl">{report.title || "Untitled Report"}</Heading>

              {/* Dot Separator */}
              <View className="w-1 h-1 bg-black rounded-full mx-4 mt-2" />

              <Text size="sm" className="text-black font-bold mr-5 mt-1">
                {formatDate(report.timestamp)}
              </Text>

              <Text
                size="2xl"
                className={`font-bold ${
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
            </View>

            {/* Right Side: Status */}
<View className="flex-row items-center">
  {report.status?.toLowerCase() === "ignored" ? (
    <>
      <X
        size={36}
        color="red"
        style={{
          borderWidth: 2,
          borderColor: "red",
          borderRadius: 50,
          padding: 4,
        }}
      />
      <Text
        size="2xl"
        className="ml-1 text-red-600 font-bold uppercase"
      >
        {report.status || "N/A"}
      </Text>
    </>
  ) : (
    <>
      <CheckCircle size={40} color="green" />
      <Text
        size="2xl"
        className="ml-1 text-green-600 font-bold uppercase"
      >
        {report.status || "N/A"}
      </Text>
    </>
  )}
</View>
          </View>

          {/* Description in gray box */}
          {report.description && (
            <Box className="mb-6 bg-gray-100 p-4 rounded-lg">
              <Text className="text-gray-700">{report.description}</Text>
            </Box>
          )}

          {/* Files Attached */}
          {report.images && report.images.length > 0 && (
            <Box className="mb-6">
              <Text className="font-bold mb-2">Files Attached:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {report.images.map((img, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => {
                      setSelectedImage(img);
                      setPreviewVisible(true);
                    }}
                  >
                    <Image
                      source={{ uri: img }}
                      className="w-40 h-40 rounded-xl mr-4 border border-gray-300"
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Box>
          )}

          {/* Location */}
          {report.location && (
            <Box className="mb-6">
              <Text className="font-bold mb-2">Location</Text>
              <Text>{report.location}</Text>
            </Box>
          )}
        </Box>
      </ScrollView>

     {/* Image Preview Modal */}
<Modal
  visible={previewVisible}
  transparent={true}
  animationType="fade"
  onRequestClose={() => setPreviewVisible(false)}
>
  <View className="flex-1 bg-black/90 justify-center items-center">
    {/* Close Button */}
    <TouchableOpacity
      onPress={() => setPreviewVisible(false)}
      style={{
        position: "absolute",
        top: 40,       // ✅ push down from the top
        right: 20,     // ✅ push in from the right
        zIndex: 10,
      }}
    >
      <X size={36} color="white" />
    </TouchableOpacity>

    {selectedImage && (
      <Image
        source={{ uri: selectedImage }}
        style={{ width: "90%", height: "70%" }}
        resizeMode="contain"
      />
    )}
  </View>
</Modal>
    </SafeAreaView>
  );
};

export default NotificationDetail;
