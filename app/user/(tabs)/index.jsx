import React, { useEffect, useState } from "react"
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Image,
  View,
  Modal,
  TextInput,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRouter } from "expo-router"

// UI Components
import { Box } from "@/components/ui/box"
import { Text } from "@/components/ui/text"
import { Heading } from "@/components/ui/heading"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Grid, GridItem } from "@/components/ui/grid"
import SearchBar from "@/components/inputs/searchbar/SearchBar"

// Firebase
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

// Context
import { useAuth } from "@/context/AuthContext"

// Icons
import { Plus, Heart, MessageCircle, Trash2, Edit, SortAsc, SortDesc } from "lucide-react-native"

const ForumsScreen = () => {
  const { user } = useAuth()
  const router = useRouter()

  // States
  const [modalVisible, setModalVisible] = useState(false)
  const [discussions, setDiscussions] = useState([])
  const [newDiscussion, setNewDiscussion] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [filter, setFilter] = useState("newest")
  const [sortOrder, setSortOrder] = useState("desc")
  const [userLikes, setUserLikes] = useState({})
  const [currentTime, setCurrentTime] = useState(new Date())

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

  // Filter & sort discussions
  const getFilteredDiscussions = () => {
    let sorted = [...discussions]

    if (filter === "newest") {
      sorted.sort((a, b) => {
        const ta = a.timestamp?.toDate ? a.timestamp.toDate().getTime() : 0
        const tb = b.timestamp?.toDate ? b.timestamp.toDate().getTime() : 0
        return tb - ta
      })
    } else if (filter === "ongoing") {
      sorted.sort((a, b) => (b.commentsCount || 0) - (a.commentsCount || 0))
    }

    if (sortOrder === "asc") sorted.reverse()
    return sorted
  }

  // Save discussion (new or edit)
  const saveDiscussion = async () => {
  if (!newDiscussion.title.trim() || !newDiscussion.description.trim()) return

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

  if (seconds < 10) return "Just now"   // ✅ show Just now for <10s
  if (seconds < 60) return `${seconds}s ago`
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
            <SearchBar />
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
        onPress={() => setModalVisible(true)}
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
            setNewDiscussion({ ...newDiscussion, title: text })
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
            setNewDiscussion({ ...newDiscussion, description: text })
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
          <Text bold size="md">{item.authorName}</Text>
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
            </Box>
          </GridItem>
        </Grid>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ForumsScreen



