import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

export default function NotFound() {
  return (
    <Box 
      className="flex-1 items-center">
        <VStack
          className="mx-auto justify-center items-center flex-1">
            <Image
              size="2xl"
              source={{
                  uri: require("../assets/images/NotFoundImage.png")
              }}
              className="bg-green"/>
            <Heading 
              size="5xl">404</Heading>
            <Heading
              size="4xl">PAGE NOT FOUND</Heading>
            <Text
              className="text-center">
              The resource could not  be found on this serveror the error has occured
            </Text>
        </VStack>
    </Box>
  );
}