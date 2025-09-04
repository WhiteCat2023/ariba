import { Edit, User } from "lucide-react-native";
import { Avatar, AvatarImage } from "../../ui/avatar";
import { Button, ButtonIcon, ButtonText } from "../../ui/button";
import { HStack } from "../../ui/hstack";
import { Text } from "../../ui/text";
import { VStack } from "../../ui/vstack";
import { LinearGradient } from "@/components/ui/lineragradient/LinearGradient";
import { useAuth } from "@/context/AuthContext";

interface ProfileHeaderProp {
    user: {
        photoURL: string,
        displayName: string,
        email: string,
    };
}

const ProfileHeader: React.FC<ProfileHeaderProp> = ({user}) => {
    const {logout} = useAuth()
    return (
        <HStack
            className="justify-between items-center">
                <HStack
                    space="md"
                    className="items-center">
                    <Avatar
                        size="xl">
                        <AvatarImage
                        source={{
                            uri: `${user?.photoURL}`
                        }}/>
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
                        <Button className="p-0 rounded-lg overflow-hidden">
                            <LinearGradient
                            className="w-full h-full items-center flex flex-row justify-center gap-2 "
                            colors={['#34A853', '#2ED573']}
                            start={[1, 0]}
                            end={[0, 1]}>
                                <ButtonIcon as={Edit}/>
                                <ButtonText>
                                    Upload Image
                                </ButtonText>
                            </LinearGradient>
                        </Button>
                    </VStack>   
                </HStack>
                <Button onPress={() => logout()} className="rounded-lg border-[#FF384A] " variant="outline">
                    <ButtonIcon as={User}/>
                    <ButtonText>
                        Logout
                    </ButtonText>
                </Button>
        </HStack>
    )
}

export default ProfileHeader