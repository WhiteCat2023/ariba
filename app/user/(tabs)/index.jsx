import { 
  SafeAreaView, 
  ScrollView, 
  StatusBar, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  TextInput 
} from "react-native"
import React, { useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Box } from "@/components/ui/box"
import { Text } from "@/components/ui/text"
import { Heading } from "@/components/ui/heading"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Grid, GridItem } from "@/components/ui/grid"
import { db } from "@/api/config/firebase.config"
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  increment,
  onSnapshot,
  setDoc,
  deleteDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore"
import { Heart, MessageCircle, Trash2, Edit } from "lucide-react-native"
import { useAuth } from "@/context/AuthContext"
import SearchBar from "@/components/inputs/searchbar/SearchBar"
import { useRouter } from "expo-router"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal"

const ForumsScreen = () => {
  const { user } = useAuth()
  const router = useRouter()

  const [discussions, setDiscussions] = useState([])
  const [newDiscussion, setNewDiscussion] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [filter, setFilter] = useState("newest")
  const [userLikes, setUserLikes] = useState({})
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Load cached likes
  useEffect(() => {
    const loadCachedLikes = async () => {
      try {
        const cached = await AsyncStorage.getItem(`userLikes_${user?.uid}`)
        if (cached) {
          setUserLikes(JSON.parse(cached))
        }
      } catch (e) {
        console.error("Error loading cached likes:", e)
      }
    }
    if (user) loadCachedLikes()
  }, [user])

  const saveLikesToCache = async (likes) => {
    try {
      await AsyncStorage.setItem(`userLikes_${user?.uid}`, JSON.stringify(likes))
    } catch (e) {
      console.error("Error saving likes:", e)
    }
  }

  // Discussions realtime
  useEffect(() => {
    const q = collection(db, "forums")
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let fetched = []
      snapshot.forEach((docSnap) => {
        fetched.push({ id: docSnap.id, ...docSnap.data() })
      })
      setDiscussions(fetched)
    })
    return () => unsubscribe()
  }, [])

  // Apply filter sorting locally
  const getFilteredDiscussions = () => {
    if (filter === "newest") {
      return [...discussions].sort((a, b) => {
        const ta = a.timestamp?.toDate ? a.timestamp.toDate().getTime() : 0
        const tb = b.timestamp?.toDate ? b.timestamp.toDate().getTime() : 0
        return tb - ta
      })
    } else if (filter === "ongoing") {
      return [...discussions].sort((a, b) => (b.commentsCount || 0) - (a.commentsCount || 0))
    }
    return discussions
  }

  // Sync likes realtime
  useEffect(() => {
    if (!user) return
    const likesRef = collection(db, "userLikes", user.uid, "forums")
    const unsubscribe = onSnapshot(likesRef, (snapshot) => {
      let likedPosts = {}
      snapshot.forEach((docSnap) => {
        likedPosts[docSnap.id] = true
      })
      setUserLikes(likedPosts)
      saveLikesToCache(likedPosts)
    })
    return () => unsubscribe()
  }, [user])

  // Create or Update Discussion
  const saveDiscussion = async () => {
    if (!newDiscussion.trim()) return

    if (editingId) {
      await updateDoc(doc(db, "forums", editingId), {
        content: newDiscussion,
      })
      setEditingId(null)
    } else {
      await addDoc(collection(db, "forums"), {
        title: "Discussion",
        content: newDiscussion,
        likesCount: 0,
        commentsCount: 0,
        authorName: user?.displayName || "Anonymous",
        authorPhoto: user?.photoURL || "https://i.pravatar.cc/100",
        authorId: user?.uid,
        timestamp: serverTimestamp(),
      })
    }

    setNewDiscussion("")
  }

  const deleteDiscussion = async (forumId) => {
    await deleteDoc(doc(db, "forums", forumId))
  }

  const toggleLike = async (forum) => {
    if (!user) return
    const forumRef = doc(db, "forums", forum.id)
    const likeRef = doc(db, "forums", forum.id, "likes", user.uid)
    const userLikeRef = doc(db, "userLikes", user.uid, "forums", forum.id)

    const likeDoc = await getDoc(likeRef)
    if (likeDoc.exists()) {
      await deleteDoc(likeRef)
      await deleteDoc(userLikeRef)
      await updateDoc(forumRef, { likesCount: increment(-1) })
      const updatedLikes = { ...userLikes }
      delete updatedLikes[forum.id]
      setUserLikes(updatedLikes)
      saveLikesToCache(updatedLikes)
    } else {
      await setDoc(likeRef, { userId: user.uid })
      await setDoc(userLikeRef, { forumId: forum.id })
      await updateDoc(forumRef, { likesCount: increment(1) })
      const updatedLikes = { ...userLikes, [forum.id]: true }
      setUserLikes(updatedLikes)
      saveLikesToCache(updatedLikes)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-[#D9E9DD] h-full p-4">
      <StatusBar barStyle="dark-content" />
      <ScrollView className="h-full">
        <Grid _extra={{ className: "lg:grid-cols-12 grid-cols-1 auto-rows-auto gap-4 h-full" }}>
          <GridItem _extra={{ className: "col-span-8" }}>
            <Box>
              <Heading size="5xl" className="mt-6 font-poppins">Ariba</Heading>
            </Box>
          </GridItem>

          <GridItem className="flex items-center" _extra={{ className: "col-span-4" }}>
            <SearchBar />
          </GridItem>

          <GridItem _extra={{ className: "col-span-12" }}>
            <Box className="bg-white rounded-xl p-6 shadow-sm">
              {/* Forums Header + Filters */}
              <Box className="flex-row items-center justify-between">
                <Box>
                  <Heading size="4xl">FORUMS</Heading>
                  <Text className="text-gray-500 mt-3 mb-3">{discussions.length} Discussions</Text>
                </Box>

                {/* Filters */}
                <Box className="flex-row items-center">
                  <Box className="flex-row border border-green-700 rounded-lg overflow-hidden mr-2">
                    <TouchableOpacity
                      onPress={() => setFilter("newest")}
                      className={`px-4 py-2 ${filter === "newest" ? "bg-green-600" : "bg-white"}`}
                    >
                      <Text className={`${filter === "newest" ? "text-white" : "text-black"}`}>Newest</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setFilter("ongoing")}
                      className={`px-4 py-2 ${filter === "ongoing" ? "bg-green-600" : "bg-white"}`}
                    >
                      <Text className={`${filter === "ongoing" ? "text-white" : "text-black"}`}>Ongoing</Text>
                    </TouchableOpacity>
                  </Box>

                  {/* Filters Button */}
                  <TouchableOpacity
                    className="flex-row items-center border border-gray-400 rounded-lg px-3 py-2"
                    onPress={() => setIsFilterOpen(true)}
                  >
                    <Image
                      source={{ uri: "https://img.icons8.com/ios-filled/50/000000/filter.png" }}
                      style={{ width: 16, height: 16, marginRight: 4 }}
                    />
                    <Text>Filters</Text>
                  </TouchableOpacity>
                </Box>
              </Box>

              {/* Forum List */}
              <FlatList
                data={getFilteredDiscussions()}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  const liked = userLikes[item.id] || false
                  const isOwner = item.authorId === user?.uid
                  return (
                    <Card className="p-5 mb-4 rounded-xl border border-gray-300 bg-white shadow-sm">
                      <TouchableOpacity onPress={() => router.push(`/user/(tabs)/${item.id}`)}>
                        <Box className="flex-row items-center mb-3 justify-between">
                          <Box className="flex-row items-center">
                            <Image
                              source={{ uri: item.authorPhoto }}
                              style={{ width: 35, height: 35, borderRadius: 18, marginRight: 10 }}
                            />
                            <Text bold size="md">{item.authorName}</Text>
                          </Box>
                          {isOwner && (
                            <Box className="flex-row space-x-3">
                              <TouchableOpacity onPress={() => { setEditingId(item.id); setNewDiscussion(item.content) }}>
                                <Edit size={18} color="blue" />
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => deleteDiscussion(item.id)}>
                                <Trash2 size={18} color="red" />
                              </TouchableOpacity>
                            </Box>
                          )}
                        </Box>

                        <Text size="xs" className="text-gray-500 mb-2">
                          {item.timestamp?.toDate ? item.timestamp.toDate().toLocaleString() : "..."}
                        </Text>

                        <Text className="mb-3 leading-5">{item.content}</Text>
                      </TouchableOpacity>

                      <Box className="flex-row items-center">
                        <TouchableOpacity onPress={() => toggleLike(item)} className="flex-row items-center mr-6">
                          <Heart size={20} color={liked ? "red" : "black"} fill={liked ? "red" : "transparent"} />
                          <Text className="ml-1 text-gray-700">{item.likesCount || 0} Likes</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.push(`/user/(tabs)/${item.id}`)} className="flex-row items-center">
                          <MessageCircle size={20} />
                          <Text className="ml-1 text-gray-700">{item.commentsCount || 0} Comments</Text>
                        </TouchableOpacity>
                      </Box>
                    </Card>
                  )
                }}
              />

              {/* Add or Edit Discussion */}
              <Box  className="flex-row items-center mt-4">
                <TextInput
                  id="add-update-form"
                  name="add-update-form"
                  placeholder={editingId ? "Edit your discussion..." : "Write a discussion..."}
                  value={newDiscussion}
                  onChangeText={setNewDiscussion}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 mr-2"
                />
                <Button className="bg-green-600 text-white" onPress={saveDiscussion}>
                    <Text>
                      {editingId ? "Update" : "+ Add"}
                    </Text>                    
                </Button>
              </Box>
            </Box>
          </GridItem>
        </Grid>
      </ScrollView>

      {/* Filters Modal */}
      <Modal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
        <ModalContent>
          <ModalHeader>
            <Text bold>Filter Discussions</Text>
          </ModalHeader>
          <ModalBody>
            <TouchableOpacity onPress={() => { setFilter("newest"); setIsFilterOpen(false) }}>
              <Text className="text-lg mb-3">Newest</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setFilter("ongoing"); setIsFilterOpen(false) }}>
              <Text className="text-lg mb-3">Ongoing</Text>
            </TouchableOpacity>
          </ModalBody>
          <ModalFooter>
            <Button onPress={() => setIsFilterOpen(false)}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </SafeAreaView>
  )
}

export default ForumsScreen
