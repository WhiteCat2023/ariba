import { Button, ButtonText } from "@/components/ui/button"
import { VStack } from "@/components/ui/vstack"
import { use, useState } from "react"
import { Grid, GridItem } from "@/components/ui/grid"
import EditInputWithFormControl from "@/components/inputs/formControl/EditInputWithFormControl"
import { HStack } from "@/components/ui/hstack"
import { Pressable } from "@/components/ui/pressable"
import { Icon } from "@/components/ui/icon"
import { ChevronLeft, X } from "lucide-react-native"
import { Heading } from "@/components/ui/heading"
import { useAuth } from "@/context/AuthContext"
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalHeader } from "@/components/ui/modal"
import InputWithFormControl from "@/components/inputs/InputWithFormControl"
import { Divider } from "@/components/ui/divider"
import { Text } from "@/components/ui/text"

const EditUserInfo = ({user}) => {

    const [isPersonalInfo, setPersonalInfo] = useState(false);
    const [isEditPI, setEditPI] = useState(false);
    const [isSecuritySettings, setSecuritySettings] = useState(false);
    const [isChangePass, setChangePass] = useState(false)
    const [input, setInput] = useState({
        firstName: "",
        lastName: ""
    })
    console.log

    

    const personalInformation = () => {
        return(
            <VStack>
                <HStack
                    className="items-center gap-4">
                    <Pressable
                        onPress={() => setPersonalInfo(false)}>
                        <Icon as={ChevronLeft} size="xl" />
                    </Pressable>
                    <Heading>
                        Personal Information
                    </Heading>
                </HStack>
                <Grid
                    _extra={{
                        className: "grid-cols-1 gap-4"
                    }}>
                    <GridItem>
                        <EditInputWithFormControl
                        label="Name"
                        isEdit={isEditPI}
                        input={user?.displayName}
                        />
                    </GridItem>
                    <GridItem>
                        <EditInputWithFormControl
                        label="Email"
                        isEdit={isEditPI}
                        input={user?.email}
                        />
                    </GridItem>
                    <GridItem>
                        <EditInputWithFormControl
                        label="Phone"
                        isEdit={isEditPI}
                        input={user?.phoneNumber}
                        fallbackText={"No Phone Number"}
                        />
                    </GridItem>
                    {/* 
                    
                    connect this to the provider. if the provider is OAuth then they cant edit their information
                    if the provider is firebase auth email password then they can edit their personal information

                    <GridItem>
                        <Button>
                            <ButtonText>
                                Edit Personal Infomation
                            </ButtonText>
                        </Button>
                    </GridItem> */}
                </Grid>
            </VStack>
        )
    }

    const securitySettings = () => {
        return(
            <VStack className="gap-4">
                <HStack
                    className="items-center gap-4">
                    <Pressable
                        onPress={() => setSecuritySettings(false)}>
                        <Icon as={ChevronLeft} size="xl" />
                    </Pressable>
                    <Heading>
                        Security Settings
                    </Heading>
                </HStack>
                <Heading>
                    Change Password
                </Heading>
                <Text>
                    If you want to <Text bold>change your password</Text> click the <Text bold>“Change Password”</Text> button. 
                </Text>
                <Button
                    onPress={() => setChangePass(true)}>
                    <ButtonText>
                        Change Password
                    </ButtonText>
                </Button>
                <Divider className="my-2"/>
                <Heading>
                    Account Deletion
                </Heading>
                <Text>
                    If you want to <Text bold>permanently</Text> delete this account and all of its data, you can do so below by clicking the <Text bold>“Delete Button”</Text>. 
                </Text>
                <Button
                    className="bg-red-500">
                    <ButtonText>
                        Delete Account
                    </ButtonText>
                </Button>
            </VStack>
        )
    }

    return(
        <>
            {isSecuritySettings && (securitySettings())}
            {isPersonalInfo && (personalInformation())}
            <VStack
                className={`lg:w-1/5 gap-6 ${isPersonalInfo || isSecuritySettings ? "hidden": "flex"}`}>
                <Button
                    onPress={() => setPersonalInfo(true)}
                    variant="outline"
                    >
                        <ButtonText>
                            Personal Information
                        </ButtonText>
                    </Button>
                <Button
                    variant="outline"
                    onPress={() => setSecuritySettings(true)}
                    >
                        <ButtonText>
                            Security Settings
                        </ButtonText>
                    </Button>
                <Button
                    variant="outline"
                    >
                        <ButtonText>
                            Bookmarks
                        </ButtonText>
                    </Button>
                <Divider/>
                <Button
                    variant="solid"
                    >
                        <ButtonText>
                            Log out
                        </ButtonText>
                    </Button>

            </VStack>
            <Modal isOpen={isChangePass} onClose={() => setChangePass(false)} useRNModal>
                <ModalBackdrop/>
                <ModalContent>
                    <ModalHeader>
                        <Heading>Change Password</Heading>  
                        <ModalCloseButton>
                            <Icon as={X}/>
                        </ModalCloseButton>  
                    </ModalHeader> 
                    <ModalBody>
                        <InputWithFormControl
                            label="Current Password"
                            placeholder="Current Password"/>
                    </ModalBody>   
                </ModalContent> 
            </Modal>
        </>
    )
}

export default EditUserInfo