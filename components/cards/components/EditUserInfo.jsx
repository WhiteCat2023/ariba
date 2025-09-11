import { Button, ButtonText } from "@/components/ui/button"
import { VStack } from "@/components/ui/vstack"
import { useState, useEffect } from "react"
import { Grid, GridItem } from "@/components/ui/grid"
import EditInputWithFormControl from "@/components/inputs/formControl/EditInputWithFormControl"
import { HStack } from "@/components/ui/hstack"
import { Pressable } from "@/components/ui/pressable"
import { Icon } from "@/components/ui/icon"
<<<<<<< HEAD
import { ChevronLeft, X, Heart, MessageCircle, CornerUpRight, Bookmark } from "lucide-react-native"
import { Heading } from "@/components/ui/heading"
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalHeader } from "@/components/ui/modal"
=======
import { ChevronLeft, Eye, EyeOff, X } from "lucide-react-native"
import { Heading } from "@/components/ui/heading"
import { useAuth } from "@/context/AuthContext"
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from "@/components/ui/modal"
>>>>>>> cc5c33feebb5785e43dc8a8e1d9b9d800146efd4
import InputWithFormControl from "@/components/inputs/InputWithFormControl"
import { Divider } from "@/components/ui/divider"
import { Text } from "@/components/ui/text"
import { Box } from "@/components/ui/box"
import { Card } from "@/components/ui/card"
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore"
import { db } from "@/api/config/firebase.config"
import { useRouter } from "expo-router"
import { TouchableOpacity, Image } from "react-native"


<<<<<<< HEAD

const EditUserInfo = ({ user }) => {
  const [isPersonalInfo, setPersonalInfo] = useState(false)
  const [isEditPI, setEditPI] = useState(false)
  const [isSecuritySettings, setSecuritySettings] = useState(false)
  const [isChangePass, setChangePass] = useState(false)
  const [isBookmarks, setBookmarks] = useState(false)
  const [bookmarks, setBookmarksData] = useState([])

  const [input, setInput] = useState({
    firstName: "",
    lastName: "",
  })

  // 🔥 Fetch bookmarks dynamically
  useEffect(() => {
    if (!user) return
    const bookmarksRef = collection(db, "users", user.uid, "bookmarks")
    const unsub = onSnapshot(bookmarksRef, async (snapshot) => {
      const items = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data()
          // Get latest forum data
          const forumRef = doc(db, "forums", data.forumId)
          const forumDoc = await getDoc(forumRef)
          return forumDoc.exists() ? { id: forumDoc.id, ...forumDoc.data() } : null
        })
      )
      setBookmarksData(items.filter(Boolean))
    })
    return () => unsub()
  }, [user])

  const personalInformation = () => {
    return (
      <VStack>
        <HStack className="items-center gap-4">
          <Pressable onPress={() => setPersonalInfo(false)}>
            <Icon as={ChevronLeft} size="xl" />
          </Pressable>
          <Heading>Personal Information</Heading>
        </HStack>
        <Grid
          _extra={{
            className: "grid-cols-1 gap-4",
          }}
        >
          <GridItem>
            <EditInputWithFormControl label="Name" isEdit={isEditPI} input={user?.displayName} />
          </GridItem>
          <GridItem>
            <EditInputWithFormControl label="Email" isEdit={isEditPI} input={user?.email} />
          </GridItem>
          <GridItem>
            <EditInputWithFormControl
              label="Phone"
              isEdit={isEditPI}
              input={user?.phoneNumber}
              fallbackText={"No Phone Number"}
            />
          </GridItem>
        </Grid>
      </VStack>
=======
    const {logout} = useAuth();
    
    const [isPersonalInfo, setPersonalInfo] = useState(false);
    const [isEditPI, setEditPI] = useState(false);
    const [isSecuritySettings, setSecuritySettings] = useState(false);
    const [isChangePass, setChangePass] = useState(false)
    const [isDeleteAcc, setDeleteAcc] = useState(false)
    const [passwordMatchError, setPasswordMatchError] = useState(false)
    const [input, setInput] = useState({
        firstName: "",
        lastName: ""
    })

    const [isViewPassword, setViewPassword] = useState({
        currentPass: false,
        newPass: false,
        confirmNewPass: false
    })

    // Input state for change pass inputs
    const [changePassInput, setChangePassInput] = useState({
        currentPass: "",
        newPass: "",
        confirmNewPass: ""
    })

    // Error state for change pass inputs
    const [changePassInputError, setChangePassInputError] = useState({
        currentPass: false,
        newPass: false,
        confirmNewPass: false
    })


    // validates changePassInput
    const validateChangePassInput = () => {

        const errors = {
            currentPass: changePassInput.currentPass === "",
            newPass: changePassInput.newPass === "",
            confirmNewPass: changePassInput.confirmNewPass === ""
        }
        setChangePassInputError(errors)

        return !Object.values(errors).some((val) => val === true);
    }

    // handles change password submission
    const handleChangePassSubmit = () => {
        if(validateChangePassInput()){
            if(changePassInput.newPass.trim() === changePassInput.confirmNewPass.trim()){
                //updates password
            }else{
                setPasswordMatchError(true)
            }
        }
        
    }

    // handles on modal close for change pass
    const handleOnCloseModal = () => {
        setChangePass(false);
        setChangePassInput({
            currentPass: "",
            newPass: "",
            confirmNewPass: ""
        })
        setChangePassInputError({
            currentPass: false,
            newPass: false,
            confirmNewPass: false
        })
    }

    // handles on close delete account model
    const handleOnCloseDelAccModal = () => {
        setDeleteAcc(false)
    }

    const matchErrorText = () => {
        if(changePassInputError.newPass | changePassInputError.confirmNewPass) return "This field must not be blank"
        if(matchErrorText) return "Password does not match"   
    }

    // handes on change input state
    const onChangePassInputChange = (field, value) => {
        setChangePassInput((prev)=> ({
            ...prev, 
            [field]: value
        }))
    }

    const onViewPassword = (field) => {
        setViewPassword((prev)=> ({
            ...prev, 
            [field]: !prev[field]
        }))
    }

    // renders personal information
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
                    className="lg:w-2/5"
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

    // renders security settings options
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
                    className="lg:w-1/5"
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
                    onPress={() => setDeleteAcc(true)}
                    className="bg-red-500 lg:w-1/5">
                    <ButtonText>
                        Delete Account
                    </ButtonText>
                </Button>
            </VStack>
        )
    }

    // modal for change pass
    const changePassModal = () => {
        return(
            <Modal isOpen={isChangePass} onClose={() => handleOnCloseModal()} useRNModal>
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
                            placeholder="Current Password"
                            input={changePassInput.currentPass}
                            setInput={(current) => onChangePassInputChange("currentPass", current)}
                            isError={changePassInputError.currentPass}
                            errorText={"This field must not be blank"}
                            type={isViewPassword.currentPass ? "text":"password"}
                            icon={isViewPassword.currentPass ? EyeOff: Eye}
                            onIconPress={() => onViewPassword("currentPass")}/>

                        <InputWithFormControl
                            label="New Password"
                            placeholder="New Password"
                            input={changePassInput.newPass}
                            setInput={(newPass) => onChangePassInputChange("newPass", newPass)}
                            isError={changePassInputError.newPass | passwordMatchError}
                            errorText={"This field must not be blank"}
                            type={isViewPassword.newPass ? "text":"password"}
                            icon={isViewPassword.newPass ? EyeOff: Eye}
                            onIconPress={() => onViewPassword("newPass")}/>

                        <InputWithFormControl
                            label="Confirm New Password"
                            placeholder="Confirm New Password"
                            input={changePassInput.confirmNewPass}
                            setInput={(confirmNewPass) => onChangePassInputChange("confirmNewPass", confirmNewPass)}
                            isError={changePassInputError.confirmNewPass | passwordMatchError}
                            errorText={matchErrorText()}
                            type={isViewPassword.confirmNewPass ? "text":"password"}
                            icon={isViewPassword.confirmNewPass ? EyeOff: Eye}
                            onIconPress={() => onViewPassword("confirmNewPass")}/>

                    </ModalBody>   
                    <ModalFooter>
                        <Button 
                            onPress={() => handleChangePassSubmit()}>
                            <ButtonText>
                                Change Password
                            </ButtonText>
                        </Button>
                    </ModalFooter>
                </ModalContent> 
            </Modal>
        )
    }

    // modal for delete acc
    const deleteAccModal = () => {
        return(
            <Modal size="lg" isOpen={isDeleteAcc} onClose={() => handleOnCloseDelAccModal()} useRNModal>
                <ModalBackdrop/>
                <ModalContent>
                    <ModalHeader>
                        <Heading>
                            Account Deletion
                        </Heading>
                        <ModalCloseButton>
                            <Icon as={X}/>
                        </ModalCloseButton>
                    </ModalHeader>
                    <ModalBody>
                        <Text>
                            Are your sure you want to <Text>Permanently Delete</Text> your account?
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            className="bg-red-500">
                            <ButtonText>
                                Delete Account
                            </ButtonText>
                        </Button>
                        <Button
                            onPress={() => handleOnCloseDelAccModal()}>
                            <ButtonText>
                                Cancel
                            </ButtonText>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        )
    }

    return(
        <>
            {isSecuritySettings && (securitySettings())}
            {isChangePass && (changePassModal())}
            {isDeleteAcc && (deleteAccModal())}
            {isPersonalInfo && (personalInformation())}
            <VStack
                className={`lg:w-2/5 gap-6 ${isPersonalInfo || isSecuritySettings ? "hidden": "flex"}`}>
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
                    onPress={() => logout()}
                    variant="solid"
                    >
                        <ButtonText>
                            Log out
                        </ButtonText>
                    </Button>

            </VStack>
            
        </>
>>>>>>> cc5c33feebb5785e43dc8a8e1d9b9d800146efd4
    )
  }

  const securitySettings = () => {
    return (
      <VStack className="gap-4">
        <HStack className="items-center gap-4">
          <Pressable onPress={() => setSecuritySettings(false)}>
            <Icon as={ChevronLeft} size="xl" />
          </Pressable>
          <Heading>Security Settings</Heading>
        </HStack>
        <Heading>Change Password</Heading>
        <Text>
          If you want to <Text bold>change your password</Text> click the <Text bold>“Change Password”</Text> button.
        </Text>
        <Button onPress={() => setChangePass(true)}>
          <ButtonText>Change Password</ButtonText>
        </Button>
        <Divider className="my-2" />
        <Heading>Account Deletion</Heading>
        <Text>
          If you want to <Text bold>permanently</Text> delete this account and all of its data, you can do so below by
          clicking the <Text bold>“Delete Button”</Text>.
        </Text>
        <Button className="bg-red-500">
          <ButtonText>Delete Account</ButtonText>
        </Button>
      </VStack>
    )
  }

  const router = useRouter()

  const bookmarksSection = () => {
  return (
    <VStack className="gap-2">
      <HStack className="items-center gap-4">
        <Pressable onPress={() => setBookmarks(false)}>
          <Icon as={ChevronLeft} size="xl" />
        </Pressable>
        <Heading>Bookmarks</Heading>
      </HStack>

      {bookmarks.length > 0 ? (
        bookmarks.map((forum) => (
          <TouchableOpacity
            key={forum.id}
            onPress={() => router.push(`/user/(tabs)/${forum.id}`)}
          >
            <Card className="p-4 mb-4 border border-gray-300 rounded-lg bg-white shadow-sm">
                {/* 🔖 Bookmark Icon in top-right */}
<Box className="absolute top-2 right-2">
  <Bookmark size={20} color="#22c55e" fill="#22c55e" /> 
</Box>

              {/* Author Row */}
              <Box className="flex-row items-center mb-3">
                <Image
                  source={{ uri: forum.authorPhoto || "https://i.pravatar.cc/100" }}
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 18,
                    marginRight: 10,
                  }}
                />
                <Box>
                  <Text bold size="md">{forum.authorName || "Anonymous"}</Text>
                  <Text size="xs" className="text-gray-500">
                    {forum.timestamp?.toDate
                      ? forum.timestamp.toDate().toLocaleString()
                      : "Just now"}
                  </Text>
                </Box>
              </Box>

              {/* Title + Content */}
              <Heading size="xl" className="mb-1">
                {forum.title}
              </Heading>
              <Text className="text-gray-700 mb-3">{forum.content}</Text>

              {/* Likes + Comments */}
              <Box className="flex-row items-center space-x-6">
                <Box className="flex-row items-center">
                  <Heart size={18} color="black" />
                  <Text className="ml-1">{forum.likesCount || 0} Likes</Text>
                </Box>
                <Box className="flex-row items-center">
                  <MessageCircle size={18} color="black" />
                  <Text className="ml-1">{forum.commentsCount || 0} Comments</Text>
                </Box>
              </Box>
            </Card>
          </TouchableOpacity>
        ))
      ) : (
        <Text className="text-gray-500">No bookmarks yet.</Text>
      )}
    </VStack>
  )
}

  return (
    <>
      {isSecuritySettings && securitySettings()}
      {isPersonalInfo && personalInformation()}
      {isBookmarks && bookmarksSection()}

      <VStack className={`lg:w-1/5 gap-6 ${isPersonalInfo || isSecuritySettings || isBookmarks ? "hidden" : "flex"}`}>
        <Button onPress={() => setPersonalInfo(true)} variant="outline">
          <ButtonText>Personal Information</ButtonText>
        </Button>
        <Button variant="outline" onPress={() => setSecuritySettings(true)}>
          <ButtonText>Security Settings</ButtonText>
        </Button>
        <Button variant="outline" onPress={() => setBookmarks(true)}>
          <ButtonText>Bookmarks</ButtonText>
        </Button>
        <Divider />
        <Button variant="solid">
          <ButtonText>Log out</ButtonText>
        </Button>
      </VStack>

      <Modal isOpen={isChangePass} onClose={() => setChangePass(false)} useRNModal>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading>Change Password</Heading>
            <ModalCloseButton>
              <Icon as={X} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <InputWithFormControl label="Current Password" placeholder="Current Password" />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default EditUserInfo
