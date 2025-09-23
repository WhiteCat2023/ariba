import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// UI Components
import SearchBar from "@/components/inputs/searchbar/SearchBar";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Grid, GridItem } from "@/components/ui/grid";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

// Firebase
import { db } from "@/api/config/firebase.config";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  increment,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

// Context
import { useAuth } from "@/context/AuthContext";

// Icons
import { Edit, Heart, MessageCircle, Plus, SortAsc, SortDesc, Trash2 } from "lucide-react-native";

const ForumsScreen = () => {
  const { user } = useAuth()
  const router = useRouter()
  const isWeb = Platform.OS === "web"

  // States
  const [modalVisible, setModalVisible] = useState(false)
  const [discussions, setDiscussions] = useState([])
  const [newDiscussion, setNewDiscussion] = useState({ title: "", description: "" }) // <-- fixed: object
  const [editingId, setEditingId] = useState(null)
  const [filter, setFilter] = useState("newest")
  const [sortOrder, setSortOrder] = useState("desc")
  const [userLikes, setUserLikes] = useState({})
  const [currentTime, setCurrentTime] = useState(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredDiscussions, setFilteredDiscussions] = useState([])

  // Update current time every minute (for "time ago")
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  // Load cached likes
  useEffect(() => {
    const loadCachedLikes = async () => {
      try {
        const cached = await AsyncStorage.getItem(`userLikes_${user?.uid}`)
        if (cached) setUserLikes(JSON.parse(cached))
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

  // Realtime discussions
  useEffect(() => {
    const q = collection(db, "forums")
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }))
      setDiscussions(fetched)
    })
    return () => unsubscribe()
  }, [])

  // Listen for user likes
  useEffect(() => {
    if (!user) return
    const likesRef = collection(db, "userLikes", user.uid, "forums")
    const unsubscribe = onSnapshot(likesRef, (snapshot) => {
      const likedPosts = {}
      snapshot.forEach((docSnap) => {
        likedPosts[docSnap.id] = true
      })
      setUserLikes(likedPosts)
      saveLikesToCache(likedPosts)
    })
    return () => unsubscribe()
  }, [user])

  // Compute filtered + sorted discussions whenever dependencies change
  useEffect(() => {
    const computeFiltered = () => {
      let list = Array.isArray(discussions) ? [...discussions] : []

      // Filter by search query (title OR content)
      const q = (searchQuery || "").trim().toLowerCase()
      if (q.length > 0) {
        list = list.filter((item) => {
          const title = (item.title || "").toString().toLowerCase()
          const content = (item.content || "").toString().toLowerCase()
          return title.includes(q) || content.includes(q)
        })
      }

      // Apply filter options
      if (filter === "newest") {
        list.sort((a, b) => {
          const ta = a.timestamp?.toDate ? a.timestamp.toDate().getTime() : 0
          const tb = b.timestamp?.toDate ? b.timestamp.toDate().getTime() : 0
          return tb - ta
        })
      } else if (filter === "ongoing") {
        list.sort((a, b) => (b.commentsCount || 0) - (a.commentsCount || 0))
      }

      // sortOrder toggle (if asc reverse)
      if (sortOrder === "asc") list.reverse()
      return list
    }

    setFilteredDiscussions(computeFiltered())
  }, [discussions, searchQuery, filter, sortOrder])

  // Save discussion (new or edit)
  const saveDiscussion = async () => {
    if (!newDiscussion.title || !newDiscussion.title.trim() || !newDiscussion.description || !newDiscussion.description.trim()) {
      // Could show an error toast, highlight fields, etc.
      return
    }

    if (editingId) {
      await updateDoc(doc(db, "forums", editingId), {
        title: newDiscussion.title,
        content: newDiscussion.description,
      })
      setEditingId(null)
    } else {
      await addDoc(collection(db, "forums"), {
        title: newDiscussion.title,
        content: newDiscussion.description,
        likesCount: 0,
        commentsCount: 0,
        authorName: user?.displayName || "Anonymous",
        authorPhoto: user?.photoURL || "https://i.pravatar.cc/100",
        authorId: user?.uid,
        timestamp: serverTimestamp(),
      })
    }

    setNewDiscussion({ title: "", description: "" })
    setModalVisible(false)
  }

  const deleteDiscussion = async (forumId) => {
    await deleteDoc(doc(db, "forums", forumId))
  }

  // Time formatter
  const formatTimeAgo = (date, now = new Date()) => {
    if (!date) return "..."

    const diff = now - date
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const weeks = Math.floor(days / 7)
    const months = Math.floor(days / 30)

    if (seconds < 60) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    if (weeks < 5) return `${weeks}w ago`
    if (months < 12) return `${months}mo ago`

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Toggle like
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

  const [fontsLoaded] = useFonts({
    Pacifico: require("../../../assets/fonts/Pacifico-Regular.ttf"),
    SpaceMono: require("../../../assets/fonts/SpaceMono-Regular.ttf"),
    Roboto: require("../../../assets/fonts/Roboto-Bold.ttf"),
    Poppins: require("../../../assets/fonts/Poppins-Bold.ttf"),
  });

  if (!fontsLoaded) return null;


  // ====== MOBILE VERSION (Expo Go) ======
if (!isWeb) {
  return (
    <SafeAreaView className="flex-1 bg-[#D9E9DD] px-3">
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <Box className="flex-row items-center justify-between mt-4 mb-6">
        <Box className="flex-row items-center">
          <Image
            source={require("@/assets/images/ariba-logo.png")} // <-- place your Ariba logo asset here
            style={{ width: 60, height: 60, marginRight: 3 }}
            resizeMode="contain"
          />
          <Text className="text-green-700 text-3xl font-[Pacifico]">
            Ariba
          </Text>
        </Box>
        <Box className="w-[140px] mt-5">
        <SearchBar
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          placeholder="Search"
          className="w-[140px]"
        />
        </Box>
      </Box>

      {/* FORUMS HEADER */}
      <Box className="bg-white rounded-2xl p-4 shadow-sm">
        <Box className="flex-row items-center justify-between mb-4">
          {/* Left: Title + Count */}
          <Box>
            <Text size="4xl" className="font-[Poppins] mb-1">
              FORUMS
            </Text>
            <Text className="text-gray-600">{discussions.length} Discussions</Text>
          </Box>

          {/* Right: Add + Filter Buttons */}
          <Box className="flex-row items-center">
            {/* Add Button */}
            <TouchableOpacity
              onPress={() => {
                setModalVisible(true)
                setEditingId(null)
                setNewDiscussion({ title: "", description: "" })
              }}
              className="bg-green-600 w-9 h-9 items-center justify-center rounded-md mr-1 mt-11"
            >
              <Plus size={20} color="white" />
            </TouchableOpacity>

            {/* Toggle Buttons */}
            <TouchableOpacity
              onPress={() => setFilter("newest")}
              className={`px-2 py-1 border border-green-600 rounded-l-md mt-11 ${
                filter === "newest" ? "bg-green-600" : "bg-white"
              }`}
            >
              <Text className={filter === "newest" ? "text-white" : "text-black"}>
                Newest
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFilter("ongoing")}
              className={`px-2 py-1 border border-green-600 rounded-r-md mt-11 ${
                filter === "ongoing" ? "bg-green-600" : "bg-white"
              }`}
            >
              <Text className={filter === "ongoing" ? "text-white" : "text-black"}>
                Ongoing
              </Text>
            </TouchableOpacity>
          </Box>
        </Box>

        {/* DISCUSSION LIST */}
<FlatList
  data={filteredDiscussions}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => {
    const liked = userLikes[item.id] || false
    const isOwner = item.authorId === user?.uid
    return (
      <Card className="p-4 mb-4 rounded-xl border border-gray-300 bg-white">
        <TouchableOpacity onPress={() => router.push(`/user/(tabs)/${item.id}`)}>
          {/* Title + Timestamp Row */}
          <Box className="flex-row items-center mb-2">
            <Text className="text-lg font-bold">{item.title}</Text>
            <Text className="mx-2 text-gray-400">•</Text>
            <Text className="text-xs text-gray-500">
              {item.timestamp?.toDate
                ? formatTimeAgo(item.timestamp.toDate(), currentTime)
                : "..."}
            </Text>
          </Box>

          {/* Content */}
          <Text numberOfLines={2} className="text-gray-700 mb-3">
            {item.content}
          </Text>
        </TouchableOpacity>

        {/* Likes + Comments */}
        <Box className="flex-row items-center">
          <TouchableOpacity
            onPress={() => toggleLike(item)}
            className="flex-row items-center mr-6"
          >
            <Heart
              size={18}
              color={liked ? "red" : "black"}
              fill={liked ? "red" : "transparent"}
            />
            <Text className="ml-1 text-gray-700">{item.likesCount || 0} Likes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push(`/user/(tabs)/${item.id}`)}
            className="flex-row items-center"
          >
            <MessageCircle size={18} />
            <Text className="ml-1 text-gray-700">
              {item.commentsCount || 0} Comments
            </Text>
          </TouchableOpacity>
        </Box>
      </Card>
    )
  }}
  contentContainerStyle={{ paddingBottom: 160 }}
/>

        {/* Add Discussion Modal (MOBILE) */}
        <Modal visible={modalVisible} transparent animationType="fade">
          <View className="flex-1 bg-black/40 justify-center items-center px-4">
            <View className="bg-white w-full rounded-2xl shadow-lg p-6">
              {/* Back Button */}
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false)
                  setEditingId(null)
                  setNewDiscussion({ title: "", description: "" })
                }}
              >
                <Text className="text-sm font-bold text-black mb-2">BACK</Text>
              </TouchableOpacity>

              {/* Title */}
              <Text className="text-xl font-[Poppins] text-center mb-2">
                START A DISCUSSION
              </Text>
              <View className="border-t border-gray-300 mb-4" />

              {/* Discussion Title */}
              <Text className="font-semibold text-black mb-2">Discussion Title</Text>
              <TextInput
                placeholder="Write your report title here."
                value={newDiscussion.title}
                onChangeText={(text) =>
                  setNewDiscussion((prev) => ({ ...prev, title: text }))
                }
                className="bg-gray-200 rounded-md px-4 py-3 mb-4 text-gray-800"
              />

              {/* Report Description */}
              <Text className="font-semibold text-black mb-2">Report Description</Text>
              <TextInput
                placeholder="Write your report description here."
                value={newDiscussion.description}
                onChangeText={(text) =>
                  setNewDiscussion((prev) => ({ ...prev, description: text }))
                }
                className="bg-gray-200 rounded-md px-4 py-3 text-gray-800 mb-6 h-32"
                multiline
                textAlignVertical="top"
              />

              {/* Buttons */}
              <View className="flex-row justify-between mt-2">
                <TouchableOpacity
                  className="flex-1 bg-green-600 py-3 rounded-md mr-2 items-center"
                  onPress={saveDiscussion}
                >
                  <Text className="text-white font-semibold">Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 bg-red-600 py-3 rounded-md ml-2 items-center"
                  onPress={() => {
                    setModalVisible(false)
                    setEditingId(null)
                    setNewDiscussion({ title: "", description: "" })
                  }}
                >
                  <Text className="text-white font-semibold">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </Box>
    </SafeAreaView>
  )
}

  return (
    <SafeAreaView className="flex-1 bg-[#D9E9DD] h-full p-4">
      <StatusBar barStyle="dark-content" />

      <ScrollView className="h-full">
        <Grid _extra={{ className: "lg:grid-cols-12 grid-cols-1 auto-rows-auto gap-4 h-full" }}>
          {/* Title */}
          <GridItem _extra={{ className: "col-span-8" }}>
            <Box>
              <Heading size="5xl" className="mt-6 font-poppins">
                Ariba
              </Heading>
            </Box>
          </GridItem>

          {/* Search */}
          <GridItem className="flex items-center" _extra={{ className: "col-span-4" }}>
            <SearchBar
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
              placeholder="Search discussions..."
            />
          </GridItem>

          {/* Forums Section */}
          <GridItem _extra={{ className: "col-span-12" }}>
            <Box className="bg-white rounded-xl p-6 shadow-sm">
              {/* Header */}
              <Box>
                <Heading size="4xl">FORUMS</Heading>
                <Box className="flex-row items-center justify-between mt-2 mb-4">
                  {/* Left: Discussions count */}
                  <Text className="text-gray-500">{discussions.length} Discussions</Text>

                  {/* Right: Controls */}
                  <Box className="flex-row items-center">
                    {/* Add Discussion */}
                    <TouchableOpacity
                      className="flex-row items-center bg-green-600 px-4 py-2 rounded-lg mr-2"
                      onPress={() => {
                        setModalVisible(true)
                        setEditingId(null)
                        setNewDiscussion({ title: "", description: "" })
                      }}
                    >
                      <Plus size={18} color="white" strokeWidth={2} />
                      <Text className="text-white font-medium ml-2">Add Discussion</Text>
                    </TouchableOpacity>

                    {/* Filters */}
                    <Box className="flex-row border border-green-700 rounded-lg overflow-hidden mr-2">
                      <TouchableOpacity
                        onPress={() => setFilter("newest")}
                        className={`px-4 py-2 ${filter === "newest" ? "bg-green-600" : "bg-white"}`}
                      >
                        <Text className={filter === "newest" ? "text-white" : "text-black"}>
                          Newest
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setFilter("ongoing")}
                        className={`px-4 py-2 ${filter === "ongoing" ? "bg-green-600" : "bg-white"}`}
                      >
                        <Text className={filter === "ongoing" ? "text-white" : "text-black"}>
                          Ongoing
                        </Text>
                      </TouchableOpacity>
                    </Box>

                    {/* Sort */}
                    <TouchableOpacity
                      className="flex-row items-center justify-center border border-gray-400 rounded-lg px-3 py-2"
                      onPress={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    >
                      {sortOrder === "asc" ? (
                        <SortAsc size={24} color="#000" strokeWidth={2} />
                      ) : (
                        <SortDesc size={24} color="#000" strokeWidth={2} />
                      )}
                    </TouchableOpacity>
                  </Box>
                </Box>
              </Box>

              {/* Add Discussion Modal */}
              <Modal visible={modalVisible} transparent animationType="fade">
                <View className="flex-1 bg-black/50 justify-center items-center">
                  <View className="bg-white w-8/12 h-5/6 rounded-xl shadow-lg p-14 relative">
                    {/* Close Button */}
                    <TouchableOpacity
                      className="absolute top-4 right-4"
                      onPress={() => {
                        setModalVisible(false)
                        setEditingId(null)
                        setNewDiscussion({ title: "", description: "" })
                      }}
                    >
                      <Text className="text-xl font-bold text-gray-600">✕</Text>
                    </TouchableOpacity>

                    {/* Title */}
                    <Heading size="4xl" className="text-center mb-4 font-Poppins font-extrabold">
                      START A DISCUSSION
                    </Heading>

                    {/* Discussion Title */}
                    <View className="mb-5">
                      <View className="border-t border-black mb-4" />
                      <Text className="text-base font-semibold mb-2 text-black">Discussion Title</Text>
                      <TextInput
                        placeholder="Write your report title here."
                        value={newDiscussion.title}
                        onChangeText={(text) =>
                          setNewDiscussion((prev) => ({ ...prev, title: text }))
                        }
                        className="bg-gray-200 rounded-md px-4 py-3 text-gray-800"
                      />
                    </View>

                    {/* Report Description */}
                    <View className="flex-1 mb-6">
                      <Text className="text-base font-semibold mb-2 text-black">Report Description</Text>
                      <TextInput
                        placeholder="Write your report description here."
                        value={newDiscussion.description}
                        onChangeText={(text) =>
                          setNewDiscussion((prev) => ({ ...prev, description: text }))
                        }
                        className="bg-gray-200 rounded-md px-4 py-3 text-gray-800 h-full"
                        multiline
                        textAlignVertical="top"
                      />
                    </View>

                    {/* Buttons Bottom Right */}
                    <View className="flex-row justify-end space-x-4 mt-4">
                      <TouchableOpacity
                        className="bg-green-600 px-6 py-3 rounded-md"
                        onPress={saveDiscussion}
                      >
                        <Text className="text-white font-semibold">Confirm</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        className="bg-red-600 px-6 py-3 rounded-md"
                        onPress={() => {
                          setModalVisible(false)
                          setEditingId(null)
                          setNewDiscussion({ title: "", description: "" })
                        }}
                      >
                        <Text className="text-white font-semibold">Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>

              {/* Forum List */}
              {filteredDiscussions.length === 0 ? (
                <Box className="items-center justify-center py-10">
                  <Text className="text-gray-500 text-lg">
                    {searchQuery.trim() ? "No results found" : "No discussions yet"}
                  </Text>
                </Box>
              ) : (
                <FlatList
                  data={filteredDiscussions}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => {
                    const liked = userLikes[item.id] || false
                    const isOwner = item.authorId === user?.uid
                    return (
                      <Card className="p-5 mb-4 rounded-xl border border-gray-300 bg-white shadow-sm">
                        <TouchableOpacity onPress={() => router.push(`/user/(tabs)/${item.id}`)}>
                          <Box className="flex-row items-center mb-3 justify-between">
                            {/* Author */}
                            <Box className="flex-row items-center">
                              <Image
                                source={{ uri: item.authorPhoto }}
                                style={{
                                  width: 35,
                                  height: 35,
                                  borderRadius: 18,
                                  marginRight: 10,
                                }}
                              />
                              <Box>
                                <Text bold size="md">
                                  {item.authorName}
                                </Text>
                                <Text size="xs" className="text-gray-500">
                                  {item.timestamp?.toDate
                                    ? formatTimeAgo(item.timestamp.toDate(), currentTime)
                                    : "..."}
                                </Text>
                              </Box>
                            </Box>

                            {/* Owner Actions */}
                            {isOwner && (
                              <Box className="flex-row space-x-3">
                                <TouchableOpacity
                                  onPress={() => {
                                    setEditingId(item.id)
                                    setNewDiscussion({ title: item.title, description: item.content })
                                    setModalVisible(true)
                                  }}
                                >
                                  <Edit size={18} color="blue" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => deleteDiscussion(item.id)}>
                                  <Trash2 size={18} color="red" />
                                </TouchableOpacity>
                              </Box>
                            )}
                          </Box>

                          {/* Title + Description */}
                          <Text className="text-lg font-bold mb-2">{item.title}</Text>
                          <Text className="mb-3 leading-5 text-gray-700">{item.content}</Text>
                        </TouchableOpacity>

                        {/* Likes + Comments */}
                        <Box className="flex-row items-center">
                          <TouchableOpacity
                            onPress={() => toggleLike(item)}
                            className="flex-row items-center mr-6"
                          >
                            <Heart
                              size={20}
                              color={liked ? "red" : "black"}
                              fill={liked ? "red" : "transparent"}
                            />
                            <Text className="ml-1 text-gray-700">{item.likesCount || 0} Likes</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => router.push(`/user/(tabs)/${item.id}`)}
                            className="flex-row items-center"
                          >
                            <MessageCircle size={20} />
                            <Text className="ml-1 text-gray-700">
                              {item.commentsCount || 0} Comments
                            </Text>
                          </TouchableOpacity>
                        </Box>
                      </Card>
                    )
                  }}
                />
              )}
            </Box>
          </GridItem>
        </Grid>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ForumsScreen
