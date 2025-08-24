import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";

export default function NotFound() {
  return (
    <Box 
      className="flex-1 items-center">
        <HStack
          className="mx-auto">
          <Image
            size="2xl"
            source={{
                uri: "@/assets/images/NotFoundImage.png"
            }}/>
            <Heading 
              size="5xl">404</Heading>
            <Heading
              size="4xl">PAGE NOT FOUND</Heading>
            <Text
              className="text-center">
              The resource could not  be found on this serveror the error has occured
            </Text>
        </HStack>
    </Box>
  );
}