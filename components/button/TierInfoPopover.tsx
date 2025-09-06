import React, { useState } from "react"
import { Popover, PopoverArrow, PopoverBackdrop, PopoverBody, PopoverContent } from "../ui/popover"
import { Pressable } from "../ui/pressable";
import { Icon } from "../ui/icon";
import { InfoIcon } from "lucide-react-native";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
import { TierList } from "@/enums/tier";
import { HStack } from "../ui/hstack";
import { Heading } from "../ui/heading";


const TierInfoPopover = () => {
    const [isOpenInfo, setOpenInfo] = useState(false);
    return (
        <Popover
            useRNModal={true}
            isOpen={isOpenInfo}
            onClose={() => setOpenInfo(false)}
            onOpen={() => setOpenInfo(true)}
            size="md"
            placement="bottom right"
            trigger={(triggerProps) => {
                return(
                    <Pressable onPress={() => setOpenInfo(true)} {...triggerProps}>
                        <Icon as={InfoIcon} className='w-6 h-6'/>
                    </Pressable>
                )
            }}
            >
                <PopoverBackdrop/>
                <PopoverContent>
                    <PopoverArrow/>
                    <PopoverBody className="p-4">
                        <Heading >
                            Legend:
                        </Heading>
                        <VStack>
                            {TierList.map(({label, description, color}) => (
                                <HStack className="px-4">
                                    
                                    <Text>
                                        <Text style={{color: color}} bold>
                                            {label}
                                        </Text> - {description}
                                    </Text>
                                </HStack>
                            ))}
                        </VStack>
                        
                    </PopoverBody>
                </PopoverContent>
        </Popover>
    )
}

export default TierInfoPopover