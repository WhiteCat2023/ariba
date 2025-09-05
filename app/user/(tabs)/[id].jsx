import React, { useEffect, useState } from "react"
import {
  SafeAreaView,
  FlatList,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  View,
} from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { db } from "@/api/config/firebase.config"
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  deleteDoc,
  increment,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  getDoc,
} from "firebase/firestore"
import { useAuth } from "@/context/AuthContext"
import {
  Heart,
  MessageCircle,
  ArrowLeft,
  Bookmark,
  Share2,
  MoreVertical,
} from "lucide-react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

// ✅ Gluestack UI
import { Box } from "@/components/ui/box"
import { Text } from "@/components/ui/text"
import { Heading } from "@/components/ui/heading"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import SearchBar from "@/components/inputs/searchbar/SearchBar"
import { Grid, GridItem } from "@/components/ui/grid"

// ⏱️ Helper: format timestamp into Twitter-style relative time
const timeAgo = (date, now) => {
  if (!date) return "..."
  const seconds = Math.floor((now - date) / 1000)

  if (seconds < 5) return "just now"
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `${weeks}w ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  const years = Math.floor(days / 365)
  return `${years}y ago`
}

const ForumDetails = () => {
  const { id } = useLocalSearchParams()
  const { user } = useAuth()
  const router = useRouter()

  const [forum, setForum] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const [userLikes, setUserLikes] = useState({})
  const [commentLikes, setCommentLikes] = useState({})
  const [searchQuery, setSearchQuery] = useState("")
  const [now, setNow] = useState(new Date()) // ⏱️ real-time ticker

  // 🔄 Menu state
  const [menuVisible, setMenuVisible] = useState(null) // stores commentId if open
  const [editingComment, setEditingComment] = useState(null) // stores commentId if editing
  const [editText, setEditText] = useState("")

  // 🔄 update current time every second
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  // --- Local Storage Helpers ---
  const loadLikesFromStorage = async () => {
    try {
      const forumLikes = await AsyncStorage.getItem("forumLikes")
      const commentLikes = await AsyncStorage.getItem("commentLikes")
      if (forumLikes) setUserLikes(JSON.parse(forumLikes))
      if (commentLikes) setCommentLikes(JSON.parse(commentLikes))
    } catch (err) {
      console.error("Error loading likes from storage", err)
    }
  }

  const saveLikesToStorage = async (key, data) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data))
    } catch (err) {
      console.error("Error saving likes to storage", err)
    }
  }

  useEffect(() => {
    loadLikesFromStorage()
  }, [])

  // Load forum post
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "forums", id), (docSnap) => {
      if (docSnap.exists()) setForum({ id: docSnap.id, ...docSnap.data() })
    })
    return () => unsub()
  }, [id])

  // Load comments
  useEffect(() => {
    const q = query(collection(db, "forums", id, "comments"), orderBy("timestamp", "asc"))
    const unsub = onSnapshot(q, (snapshot) => {
      let fetched = []
      snapshot.forEach((d) => fetched.push({ id: d.id, ...d.data() }))
      setComments(fetched)
    })
    return () => unsub()
  }, [id])

  // Track forum likes
  useEffect(() => {
    if (!user) return
    const likeRef = doc(db, "forums", id, "likes", user.uid)
    const unsub = onSnapshot(likeRef, (snap) => {
      setUserLikes((prev) => {
        const updated = { ...prev, [id]: snap.exists() }
        saveLikesToStorage("forumLikes", updated)
        return updated
      })
    })
    return () => unsub()
  }, [id, user])

  // Track comment likes
  useEffect(() => {
    if (!user) return
    const unsubs = comments.map((c) => {
      const likeRef = doc(db, "forums", id, "comments", c.id, "likes", user.uid)
      return onSnapshot(likeRef, (snap) => {
        setCommentLikes((prev) => {
          const updated = { ...prev, [c.id]: snap.exists() }
          saveLikesToStorage("commentLikes", updated)
          return updated
        })
      })
    })
    return () => unsubs.forEach((u) => u())
  }, [comments, id, user])

  // Add comment
  const addComment = async () => {
    if (!newComment.trim()) return
    await addDoc(collection(db, "forums", id, "comments"), {
      content: newComment,
      authorName: user?.displayName || "Anonymous",
      authorPhoto: user?.photoURL || "https://i.pravatar.cc/100",
      authorId: user?.uid,
      likesCount: 0,
      timestamp: serverTimestamp(),
    })
    await updateDoc(doc(db, "forums", id), { commentsCount: increment(1) })
    setNewComment("")
  }

  // Delete comment
  const deleteComment = async (commentId) => {
    await deleteDoc(doc(db, "forums", id, "comments", commentId))
    await updateDoc(doc(db, "forums", id), { commentsCount: increment(-1) })
    setMenuVisible(null)
  }

  // Edit comment
  const saveEditComment = async (commentId) => {
    if (!editText.trim()) return
    await updateDoc(doc(db, "forums", id, "comments", commentId), {
      content: editText,
    })
    setEditingComment(null)
    setEditText("")
    setMenuVisible(null)
  }

  // Toggle forum like
  const toggleForumLike = async () => {
    if (!user) return
    const forumRef = doc(db, "forums", id)
    const likeRef = doc(db, "forums", id, "likes", user.uid)

    const likeDoc = await getDoc(likeRef)
    if (likeDoc.exists()) {
      await deleteDoc(likeRef)
      await updateDoc(forumRef, { likesCount: increment(-1) })
    } else {
      await setDoc(likeRef, { userId: user.uid })
      await updateDoc(forumRef, { likesCount: increment(1) })
    }
  }

  // Toggle comment like
  const toggleCommentLike = async (comment) => {
    if (!user) return
    const commentRef = doc(db, "forums", id, "comments", comment.id)
    const likeRef = doc(db, "forums", id, "comments", comment.id, "likes", user.uid)

    const likeDoc = await getDoc(likeRef)
    if (likeDoc.exists()) {
      await deleteDoc(likeRef)
      await updateDoc(commentRef, { likesCount: increment(-1) })
    } else {
      await setDoc(likeRef, { userId: user.uid })
      await updateDoc(commentRef, { likesCount: increment(1) })
    }
  }

  if (!forum) return null

  // 🔍 Filtering logic
  const filteredComments = comments.filter(
    (c) =>
      c.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.authorName.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const forumMatchesSearch =
    forum.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    forum.content?.toLowerCase().includes(searchQuery.toLowerCase())

  return (
    <SafeAreaView className="flex-1 bg-[#D9E9DD] p-4">
      <ScrollView className="h-full">
        {/* Top row: ARIBA + Search Bar */}
        <Grid _extra={{ className: "grid-cols-12 gap-4 items-center mb-4" }}>
          <GridItem _extra={{ className: "col-span-8" }}>
            <Heading size="5xl" className="mt-6">
              Ariba
            </Heading>
          </GridItem>

          <GridItem className="flex items-center" _extra={{ className: "col-span-4" }}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search..."
              className="w-full h-12 border border-gray-400 rounded-md px-3"
            />
          </GridItem>
        </Grid>

        {/* Forum + Comments Section */}
        <Box className="bg-white rounded-xl p-6 shadow-sm flex-1">
          {forumMatchesSearch ? (
            <FlatList
              data={filteredComments}
              keyExtractor={(item) => item.id}
              ListHeaderComponent={
                <>
                  {/* Back button */}
                  <TouchableOpacity onPress={() => router.back()} className="mb-4">
                    <ArrowLeft size={24} color="black" />
                  </TouchableOpacity>

                  {/* Title Section */}
                  <Heading size="4xl" className="mb-1">
                    FORUMS
                  </Heading>
                  <Text className="text-2xl font-semibold mb-4">
                    {forum.title || "Discussion Title"}
                  </Text>

                  {/* User Row */}
                  <Box className="flex-row items-center mb-2">
                    <Image
                      source={{ uri: forum.authorPhoto }}
                      style={{ width: 35, height: 35, borderRadius: 18, marginRight: 8 }}
                    />
                    <Text bold>{forum.authorName}</Text>
                    <Text className="text-gray-500 ml-2 text-sm">
                      {forum.timestamp?.toDate ? timeAgo(forum.timestamp.toDate(), now) : "..."}
                    </Text>
                  </Box>

                  {/* Forum Content */}
                  <Text className="text-base text-gray-700 mb-5">{forum.content}</Text>

                  {/* Actions Row */}
                  <Box className="flex-row items-center justify-between border-b border-gray-300 pb-3 mb-5">
                    <TouchableOpacity onPress={toggleForumLike} className="flex-row items-center">
                      <Heart
                        size={20}
                        color={userLikes[id] ? "red" : "black"}
                        fill={userLikes[id] ? "red" : "transparent"}
                      />
                      <Text className="ml-2">{forum.likesCount || 0} Likes</Text>
                    </TouchableOpacity>
                    <Box className="flex-row items-center">
                      <MessageCircle size={20} />
                      <Text className="ml-2">{forum.commentsCount || 0} Comments</Text>
                    </Box>
                    <Box className="flex-row space-x-4">
                      <Bookmark size={20} />
                      <Share2 size={20} />
                    </Box>
                  </Box>

                  {/* Comment Input */}
                  <Heading size="xl" className="mb-3">
                    Comments
                  </Heading>

                  <Box className="mb-6">
                    <TextInput
                      placeholder="Write your insights about the discussion"
                      value={newComment}
                      onChangeText={setNewComment}
                      multiline
                      className="w-full min-h-[60px] px-3 py-2 rounded-md border border-gray-300 bg-gray-100"
                    />

                    <Box className="flex-row justify-end space-x-3 mt-3">
                      <Button className="bg-green-600 px-4" onPress={addComment}>
                        <Text className="text-white">Comment</Text>
                      </Button>

                      <Button className="bg-white px-4" onPress={() => setNewComment("")}>
                        <Text className="text-black">Cancel</Text>
                      </Button>
                    </Box>
                  </Box>
                </>
              }
              renderItem={({ item }) => {
                const isOwner = item.authorId === user?.uid
                return (
                  <Card className="p-3 mb-6 rounded-xl bg-white">
                    {/* Author + Timestamp + Menu Row */}
<Box className="flex-row justify-between items-center mb-1 relative">
  <Box className="flex-row items-center">
    <Text bold>{item.authorName}</Text>
    <Text className="text-gray-400 text-sm ml-2">
      {item.timestamp?.toDate ? timeAgo(item.timestamp.toDate(), now) : "..."}
    </Text>
  </Box>

  {isOwner && (
    <Box>
      <TouchableOpacity onPress={() => setMenuVisible(menuVisible === item.id ? null : item.id)}>
        <MoreVertical size={18} color="black" />
      </TouchableOpacity>

      {/* Dropdown Menu */}
      {menuVisible === item.id && (
        <>
          {/* Overlay to detect outside taps */}
          <TouchableOpacity
            className="absolute inset-0"
            activeOpacity={1}
            onPress={() => setMenuVisible(null)}
          />

          {/* Dropdown itself */}
          <View className="absolute right-0 top-6 bg-white p-3 rounded-lg shadow-lg z-50 w-28">
            <TouchableOpacity
              onPress={() => {
                setEditingComment(item.id)
                setEditText(item.content)
                setMenuVisible(null)
              }}
            >
              <Text className="mb-3 text-blue-600">Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteComment(item.id)}>
              <Text className="text-red-600">Delete</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </Box>
  )}
</Box>
                    {/* Comment Content OR Edit Box */}
                    {editingComment === item.id ? (
                      <Box>
                        <TextInput
                          value={editText}
                          onChangeText={setEditText}
                          className="border border-gray-300 rounded-md p-2 mb-2"
                        />
                        <Box className="flex-row space-x-3">
                          <Button className="bg-green-600 px-4" onPress={() => saveEditComment(item.id)}>
                            <Text className="text-white">Save</Text>
                          </Button>
                          <Button
                            className="bg-white px-4"
                            onPress={() => {
                              setEditingComment(null)
                              setEditText("")
                            }}
                          >
                            <Text className="text-black">Cancel</Text>
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Text className="mb-3">{item.content}</Text>
                    )}

                    {/* Actions Row */}
<Box className="flex-row items-center mt-1">
  <TouchableOpacity
    onPress={() => toggleCommentLike(item)}
    className="flex-row items-center mr-4"
  >
    <Heart
      size={16}
      color={commentLikes[item.id] ? "red" : "black"}
      fill={commentLikes[item.id] ? "red" : "transparent"}
    />
    <Text className="ml-1 text-sm text-gray-700">
      {item.likesCount || 0} Likes
    </Text>
  </TouchableOpacity>

  <TouchableOpacity className="flex-row items-center">
    <MessageCircle size={16} color="black" />
    <Text className="ml-1 text-sm text-gray-600">Reply</Text>
  </TouchableOpacity>
</Box>

                  </Card>
                )
              }}
              contentContainerStyle={{ paddingBottom: 120 }}
            />
          ) : (
            <Text className="text-gray-500 text-center mt-10">
              No forum or comments match your search.
            </Text>
          )}
        </Box>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ForumDetails
