import { GlobeIcon } from "lucide-react-native";
import { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage } from "../../ui/avatar";
import { HStack } from "../../ui/hstack";
import { Text } from "../../ui/text";
import { VStack } from "../../ui/vstack";
import { useAuth } from "@/context/AuthContext";
import React from "react";
import { Badge, BadgeText, BadgeIcon } from "@/components/ui/badge";

const ProfileHeader = ({user}) => {
    const {logout} = useAuth()
    return (
        <HStack
            className="justify-between items-center">
                <HStack
                    space="md"
                    className="items-center">
                    <Avatar
                        size="xl">
                        <AvatarFallbackText>User</AvatarFallbackText>
                        <AvatarImage
                        source={{
                            uri: `${user?.photoURL}`
                        }}/>
                        <AvatarBadge/>
                    </Avatar>
                    <VStack>
                        <Text 
                        size="xl" 
                        bold={true}>
                        {user?.displayName}
                        </Text>
                        <Text 
                        size="sm">
                        {user?.email}
                        </Text>
                        <Text 
                        size="md"
                        bold={true}>
                        ROLE
                        </Text>
                        <Badge>
                            <BadgeText>Verified</BadgeText>
                            <BadgeIcon as={GlobeIcon}/>
                        </Badge>
                    </VStack>   
                </HStack>
        </HStack>
    )
}

export default ProfileHeader