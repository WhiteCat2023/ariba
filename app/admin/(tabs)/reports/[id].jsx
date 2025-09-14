import { useState } from "react";
import { Dimensions } from "react-native";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ChevronLeft,
  ChevronRight,
  X,
  MessageCircle,
  XCircle,
  MapPin,
  User,
} from "lucide-react-native";
import { Image } from "@/components/ui/image";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";

const { width: screenWidth } = Dimensions.get("window");

const ReportDetailView = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Sample images - replace with your actual image data
  const [images] = useState([
    "https://images.unsplash.com/photo-1575936123452-b67c3203c357",
    "https://images.unsplash.com/photo-1541963463532-d68292c34b19",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
    "https://images.unsplash.com/photo-1520004434532-668416a08753",
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const openModal = (index) => {
    setModalIndex(index);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const goToModalNext = () => {
    setModalIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToModalPrevious = () => {
    setModalIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleRespond = async () => {
    setIsProcessing(true);
    try {
      // Add your respond logic here
      console.log("Responding to report:", id);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Response sent successfully!");
    } catch (error) {
      console.error("Error responding to report:", error);
      alert("Failed to send response. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleIgnore = async () => {
    setIsProcessing(true);
    try {
      // Add your ignore logic here
      console.log("Ignoring report:", id);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Report ignored successfully!");
      router.back(); // Go back after ignoring
    } catch (error) {
      console.error("Error ignoring report:", error);
      alert("Failed to ignore report. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Box className="flex-1 bg-white">
      {/* Header */}
      <HStack className="items-center p-4 border-b border-gray-200">
        <Pressable className="p-2 rounded-full" onPress={() => router.back()}>
          <Icon as={ChevronLeft} size="xl" />
        </Pressable>
        <Heading size="xl" className="ml-4">
          Report Details
        </Heading>
      </HStack>

      <VStack className="p-4 flex-1 justify-between">
        <Box>
          {/* Image Carousel */}
          <Box className="relative mb-6">
            <Pressable onPress={() => openModal(currentIndex)}>
              <Image
                source={{ uri: images[currentIndex] }}
                className="w-full h-64 rounded-lg"
                resizeMode="cover"
              />
            </Pressable>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <Pressable
                  onPress={goToPrevious}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2"
                >
                  <Icon as={ChevronLeft} size="lg" className="text-white" />
                </Pressable>

                <Pressable
                  onPress={goToNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2"
                >
                  <Icon as={ChevronRight} size="lg" className="text-white" />
                </Pressable>
              </>
            )}

            {/* Indicator Dots */}
            {images.length > 1 && (
              <HStack className="absolute bottom-2 left-0 right-0 justify-center gap-2">
                {images.map((_, index) => (
                  <Pressable
                    key={index}
                    onPress={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full ${
                      index === currentIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </HStack>
            )}
          </Box>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <HStack className="mb-6 gap-2 flex-wrap">
              {images.map((image, index) => (
                <Pressable
                  key={index}
                  onPress={() => setCurrentIndex(index)}
                  className={`border-2 rounded-lg overflow-hidden ${
                    index === currentIndex
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                >
                  <Image
                    source={{ uri: image }}
                    className="w-16 h-16"
                    resizeMode="cover"
                  />
                </Pressable>
              ))}
            </HStack>
          )}

          {/* Content */}
          <Box className="mb-6">
            <Heading size="lg" className="mb-2">
              Report Title
            </Heading>
            <Text className="text-gray-700 mb-4">
              This is a detailed description of the report. It provides all the
              necessary information about the incident, including location,
              time, and other relevant details.
            </Text>

            <HStack className="justify-between items-center mb-4">
              <Text className="text-gray-500">Status: Pending</Text>
              <Text className="text-gray-500">October 15, 2023</Text>
            </HStack>

            <HStack className="items-center gap-2 mb-2">
              <Icon as={MapPin} size="sm" className="text-gray-500" />
              <Text className="text-gray-500">
                123 Main Street, City, State
              </Text>
            </HStack>

            <HStack className="items-center gap-2">
              <Icon as={User} size="sm" className="text-gray-500" />
              <Text className="text-gray-500">Reported by: John Doe</Text>
            </HStack>
          </Box>
        </Box>

        {/* Action Buttons */}
        <HStack className="gap-4 mt-6">
          <Button
            variant="outline"
            className="flex-1 border-red-500"
            onPress={handleIgnore}
            disabled={isProcessing}
          >
            <Icon as={XCircle} size="sm" className="text-red-500 mr-2" />
            <ButtonText className="text-red-500">Ignore</ButtonText>
          </Button>

          <Button
            className="flex-1 bg-green-600"
            onPress={handleRespond}
            disabled={isProcessing}
          >
            <Icon as={MessageCircle} size="sm" className="text-white mr-2" />
            <ButtonText>Respond</ButtonText>
          </Button>
        </HStack>
      </VStack>

      {/* Fullscreen Image Modal using Gluestack UI */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        size="full"
        useRNModal={true}
      >
        <ModalBackdrop />
        <ModalContent className="bg-black h-full justify-center">
          <ModalHeader className="bg-transparent absolute top-0 left-0 right-0 z-10">
            <ModalCloseButton
              onPress={closeModal}
              className="bg-black/50 rounded-full p-2"
            >
              <Icon as={X} size="xl" className="text-white" />
            </ModalCloseButton>
          </ModalHeader>

          <ModalBody className="flex-1 justify-center items-center p-0">
            <Image
              source={{ uri: images[modalIndex] }}
              className="w-full h-full"
              resizeMode="contain"
            />
          </ModalBody>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <Pressable
                onPress={goToModalPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-3 z-10"
              >
                <Icon as={ChevronLeft} size="xl" className="text-white" />
              </Pressable>

              <Pressable
                onPress={goToModalNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-3 z-10"
              >
                <Icon as={ChevronRight} size="xl" className="text-white" />
              </Pressable>
            </>
          )}

          {/* Indicator Dots */}
          {images.length > 1 && (
            <HStack className="absolute bottom-8 left-0 right-0 justify-center gap-2 z-10">
              {images.map((_, index) => (
                <Pressable
                  key={index}
                  onPress={() => setModalIndex(index)}
                  className={`w-2 h-2 rounded-full ${
                    index === modalIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </HStack>
          )}
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ReportDetailView;
