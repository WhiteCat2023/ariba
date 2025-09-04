import React, { useEffect, useState } from "react"
import {
  SafeAreaView,
  FlatList,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
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
  Trash2,
  ArrowLeft,
  Bookmark,
  Share2,
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
        {/* 🔝 Top row: ARIBA + Search Bar */}
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
                      {forum.timestamp?.toDate ? forum.timestamp.toDate().toLocaleString() : "..."}
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
  {/* Text Input */}
  <TextInput
    placeholder="Write your insights about the discussion"
    value={newComment}
    onChangeText={setNewComment}
    multiline
    className="w-full min-h-[60px] px-3 py-2 rounded-md border border-gray-300 bg-gray-100"
  />

  {/* Buttons Row - Right Aligned */}
  <Box className="flex-row justify-end space-x-3 mt-3">
    <Button
      className="bg-green-600 px-4"
      onPress={addComment}
    >
      <Text className="text-white">Comment</Text>
    </Button>            

    <Button
      className="bg-gray-400 px-4"
      onPress={() => setNewComment("")} // cancel clears input
    >
      <Text className="text-white">Cancel</Text>
    </Button>
    
  </Box>
</Box>
                </>
              }
              renderItem={({ item }) => {
                const isOwner = item.authorId === user?.uid
                return (
                  <Card className="p-4 mb-4 rounded-xl border border-gray-200 bg-white">
                    <Box className="flex-row justify-between mb-1">
                      <Text bold>{item.authorName}</Text>
                      <Text className="text-gray-400 text-sm">
                        {item.timestamp?.toDate ? item.timestamp.toDate().toLocaleString() : "..."}
                      </Text>
                    </Box>
                    <Text className="mb-3">{item.content}</Text>
                    <Box className="flex-row items-center justify-between">
                      <TouchableOpacity
                        onPress={() => toggleCommentLike(item)}
                        className="flex-row items-center"
                      >
                        <Heart
                          size={16}
                          color={commentLikes[item.id] ? "red" : "black"}
                          fill={commentLikes[item.id] ? "red" : "transparent"}
                        />
                        <Text className="ml-1">{item.likesCount || 0} Likes</Text>
                      </TouchableOpacity>
                      <Box className="flex-row items-center">
                        <MessageCircle size={16} />
                        <Text className="ml-1 text-gray-600">Reply</Text>
                      </Box>
                      {isOwner && (
                        <TouchableOpacity onPress={() => deleteComment(item.id)}>
                          <Trash2 size={16} color="red" />
                        </TouchableOpacity>
                      )}
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
