import { useState, useEffect } from "react"
import { TouchableOpacity, Image } from "react-native"
import { useRouter } from "expo-router"
import { useAuth } from "@/context/AuthContext"
import { db } from "@/api/config/firebase.config"
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore"

// ✅ UI Components
import { Button, ButtonText } from "@/components/ui/button"
import { VStack } from "@/components/ui/vstack"
import { Grid, GridItem } from "@/components/ui/grid"
import { HStack } from "@/components/ui/hstack"
import { Pressable } from "@/components/ui/pressable"
import { Icon } from "@/components/ui/icon"
import { Heading } from "@/components/ui/heading"
import { Divider } from "@/components/ui/divider"
import { Text } from "@/components/ui/text"
import { Box } from "@/components/ui/box"
import { Card } from "@/components/ui/card"
import EditInputWithFormControl from "@/components/inputs/formControl/EditInputWithFormControl"
import InputWithFormControl from "@/components/inputs/InputWithFormControl"
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal"

// ✅ Icons
import {
  ChevronLeft,
  Eye,
  EyeOff,
  X,
  Heart,
  MessageCircle,
  Bookmark,
} from "lucide-react-native"

const EditUserInfo = ({ user }) => {
  const { logout } = useAuth()
  const router = useRouter()

  // UI States
  const [isPersonalInfo, setPersonalInfo] = useState(false)
  const [isEditPI, setEditPI] = useState(false)
  const [isSecuritySettings, setSecuritySettings] = useState(false)
  const [isChangePass, setChangePass] = useState(false)
  const [isDeleteAcc, setDeleteAcc] = useState(false)
  const [isBookmarks, setBookmarks] = useState(false)

  // Bookmarks
  const [bookmarks, setBookmarksData] = useState([])

  useEffect(() => {
    if (!user) return
    const bookmarksRef = collection(db, "users", user.uid, "bookmarks")
    const unsub = onSnapshot(bookmarksRef, async (snapshot) => {
      const items = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data()
          const forumRef = doc(db, "forums", data.forumId)
          const forumDoc = await getDoc(forumRef)
          return forumDoc.exists() ? { id: forumDoc.id, ...forumDoc.data() } : null
        })
      )
      setBookmarksData(items.filter(Boolean))
    })
    return () => unsub()
  }, [user])

  // 📌 Personal Info
  const personalInformation = () => (
    <VStack>
      <HStack className="items-center gap-4">
        <Pressable onPress={() => setPersonalInfo(false)}>
          <Icon as={ChevronLeft} size="xl" />
        </Pressable>
        <Heading>Personal Information</Heading>
      </HStack>
      <Grid className="lg:w-2/5" _extra={{ className: "grid-cols-1 gap-4" }}>
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
  )

  // 📌 Security Settings
  const securitySettings = () => (
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
        If you want to <Text bold>permanently</Text> delete this account and all of its data, click{" "}
        <Text bold>“Delete Account”</Text>.
      </Text>
      <Button className="bg-red-500" onPress={() => setDeleteAcc(true)}>
        <ButtonText>Delete Account</ButtonText>
      </Button>
    </VStack>
  )

  // 📌 Bookmarks Section
  const bookmarksSection = () => (
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

              {/* Author */}
              <Box className="flex-row items-center mb-3">
                <Image
                  source={{ uri: forum.authorPhoto || "https://i.pravatar.cc/100" }}
                  style={{ width: 35, height: 35, borderRadius: 18, marginRight: 10 }}
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
              <Heading size="xl" className="mb-1">{forum.title}</Heading>
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

  return (
    <>
      {isSecuritySettings && securitySettings()}
      {isPersonalInfo && personalInformation()}
      {isBookmarks && bookmarksSection()}

      {/* Main Menu */}
      <VStack className={`lg:w-1/5 gap-6 ${isPersonalInfo || isSecuritySettings || isBookmarks ? "hidden" : "flex"}`}>
        <Button onPress={() => setPersonalInfo(true)} variant="outline">
          <ButtonText>Personal Information</ButtonText>
        </Button>
        <Button onPress={() => setSecuritySettings(true)} variant="outline">
          <ButtonText>Security Settings</ButtonText>
        </Button>
        <Button onPress={() => setBookmarks(true)} variant="outline">
          <ButtonText>Bookmarks</ButtonText>
        </Button>
        <Divider />
        <Button onPress={() => logout()} variant="solid">
          <ButtonText>Log out</ButtonText>
        </Button>
      </VStack>

      {/* 🔐 Change Password Modal */}
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
            <InputWithFormControl label="New Password" placeholder="New Password" />
            <InputWithFormControl label="Confirm New Password" placeholder="Confirm New Password" />
          </ModalBody>
          <ModalFooter>
            <Button>
              <ButtonText>Update Password</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ❌ Delete Account Modal */}
      <Modal size="lg" isOpen={isDeleteAcc} onClose={() => setDeleteAcc(false)} useRNModal>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading>Account Deletion</Heading>
            <ModalCloseButton>
              <Icon as={X} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Text>
              Are you sure you want to <Text bold>Permanently Delete</Text> your account?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button className="bg-red-500">
              <ButtonText>Delete Account</ButtonText>
            </Button>
            <Button onPress={() => setDeleteAcc(false)}>
              <ButtonText>Cancel</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default EditUserInfo
