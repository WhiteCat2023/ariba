import React, { useEffect, useState } from "react"
import {
  SafeAreaView,
  FlatList,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
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
import { Heart, ArrowLeft, MoreVertical, Bookmark, MessageCircle, Share2 } from "lucide-react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

// ✅ Gluestack UI
import { Reply } from "lucide-react-native";
import { Box } from "@/components/ui/box"
import { Text } from "@/components/ui/text"
import { Heading } from "@/components/ui/heading"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import SearchBar from "@/components/inputs/searchbar/SearchBar"
import { Grid, GridItem } from "@/components/ui/grid"

// ⏱️ Helper: format timestamp into relative time
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
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

const ForumDetails = () => {
  const { id } = useLocalSearchParams()
  const { user } = useAuth()
  const router = useRouter()

  const [forum, setForum] = useState(null)
  const [allComments, setAllComments] = useState([])
  const [commentMap, setCommentMap] = useState({})
  const [newComment, setNewComment] = useState("")
  const [replyText, setReplyText] = useState({})
  const [replyVisible, setReplyVisible] = useState({})
  const [editingComment, setEditingComment] = useState(null)
  const [editingReply, setEditingReply] = useState(null)
  const [editText, setEditText] = useState("")
  const [editReplyText, setEditReplyText] = useState({})
  const [menuVisible, setMenuVisible] = useState(null)
  const [replyMenuVisible, setReplyMenuVisible] = useState({})
  const [userLikes, setUserLikes] = useState({})
  const [commentLikes, setCommentLikes] = useState({})
  const [searchQuery, setSearchQuery] = useState("")
  const [now, setNow] = useState(new Date())

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  // --- Local Storage Helpers ---
  const loadLikesFromStorage = async () => {
    try {
      const forumLikes = await AsyncStorage.getItem("forumLikes")
      const commentLikesStorage = await AsyncStorage.getItem("commentLikes")
      if (forumLikes) setUserLikes(JSON.parse(forumLikes))
      if (commentLikesStorage) setCommentLikes(JSON.parse(commentLikesStorage))
    } catch (err) {
      console.error("Error loading likes from storage", err)
    }
  }

  const saveLikesToStorage = async (key, data) => {
    try { await AsyncStorage.setItem(key, JSON.stringify(data)) }
    catch (err) { console.error("Error saving likes to storage", err) }
  }

  useEffect(() => { loadLikesFromStorage() }, [])

  // --- Load forum ---
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "forums", id), (docSnap) => {
      if (docSnap.exists()) setForum({ id: docSnap.id, ...docSnap.data() })
    })
    return () => unsub()
  }, [id])

  // --- Load top-level comments ---
  useEffect(() => {
    const q = query(collection(db, "forums", id, "comments"), orderBy("timestamp", "asc"))
    const unsub = onSnapshot(q, (snapshot) => {
      const comments = snapshot.docs.map((d) => ({ ...d.data(), id: d.id, parentId: null }))
      setAllComments(comments)
    })
    return () => unsub()
  }, [id])

  // --- Load nested replies dynamically ---
  useEffect(() => {
    const map = {}
    const unsubscribers = []

    const attachRepliesListener = (parentId) => {
      const q = query(collection(db, "forums", id, "comments", parentId, "replies"), orderBy("timestamp", "asc"))
      const unsub = onSnapshot(q, (snapshot) => {
        const replies = snapshot.docs.map((d) => ({ ...d.data(), id: d.id, parentId }))
        map[parentId] = replies
        setCommentMap({ ...map })

        replies.forEach((r) => {
          if (!map[r.id]) attachRepliesListener(r.id)
        })
      })
      unsubscribers.push(unsub)
    }

    allComments.forEach((c) => attachRepliesListener(c.id))
    return () => unsubscribers.forEach((u) => u())
  }, [allComments, id])

  // --- Likes Tracking ---
  useEffect(() => {
    if (!user) return
    const forumLikeRef = doc(db, "forums", id, "likes", user.uid)
    const unsub = onSnapshot(forumLikeRef, snap => {
      setUserLikes(prev => { const updated = { ...prev, [id]: snap.exists() }; saveLikesToStorage("forumLikes", updated); return updated })
    })
    return () => unsub()
  }, [id, user])

  useEffect(() => {
    if (!user) return
    const unsubs = allComments.map((c) => {
      const likeRef = doc(db, "forums", id, "comments", c.id, "likes", user.uid)
      return onSnapshot(likeRef, snap => {
        setCommentLikes(prev => { const updated = { ...prev, [c.id]: snap.exists() }; saveLikesToStorage("commentLikes", updated); return updated })
      })
    })
    return () => unsubs.forEach(u => u())
  }, [allComments, id, user])

  // --- Add comment ---
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

  // --- Toggle forum like ---
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

  // --- Toggle comment/reply like (optimistic update) ---
const toggleCommentLike = async (item) => {
  if (!user) return

  const itemId = item.id
  const currentlyLiked = commentLikes[itemId] || false

  // --- Optimistic UI update ---
  setCommentLikes(prev => {
    const updated = { ...prev, [itemId]: !currentlyLiked }
    saveLikesToStorage("commentLikes", updated)
    return updated
  })

  let path = ["comments", itemId]
  if (item.parentId) path = ["comments", item.parentId, "replies", itemId]

  const itemRef = doc(db, "forums", id, ...path)
  const likeRef = doc(db, "forums", id, ...path, "likes", user.uid)

  try {
    const likeDoc = await getDoc(likeRef)
    if (likeDoc.exists()) {
      await deleteDoc(likeRef)
      await updateDoc(itemRef, { likesCount: increment(-1) })
    } else {
      await setDoc(likeRef, { userId: user.uid })
      await updateDoc(itemRef, { likesCount: increment(1) })
    }
  } catch (err) {
    console.error("Error updating like:", err)
    // Revert UI if there is an error
    setCommentLikes(prev => ({ ...prev, [itemId]: currentlyLiked }))
  }
}

  // --- Add nested reply ---
  const addNestedReply = async (parentId) => {
    if (!replyText[parentId]?.trim()) return
    await addDoc(collection(db, "forums", id, "comments", parentId, "replies"), {
      content: replyText[parentId],
      authorName: user?.displayName || "Anonymous",
      authorPhoto: user?.photoURL || "https://i.pravatar.cc/100",
      authorId: user?.uid,
      likesCount: 0,
      timestamp: serverTimestamp(),
    })
    setReplyText(prev => ({ ...prev, [parentId]: "" }))
    setReplyVisible(prev => ({ ...prev, [parentId]: false }))
  }

  // --- Delete comment/reply ---
  const deleteItem = async (item) => {
    const path = item.parentId ? ["comments", item.parentId, "replies", item.id] : ["comments", item.id]
    await deleteDoc(doc(db, "forums", id, ...path))
  }

  // --- Save edited comment/reply ---
  const saveEditItem = async (item) => {
    const path = item.parentId ? ["comments", item.parentId, "replies", item.id] : ["comments", item.id]
    const newContent = item.parentId ? editReplyText[item.id] : editText
    if (!newContent?.trim()) return
    await updateDoc(doc(db, "forums", id, ...path), { content: newContent })
    if (item.parentId) setEditingReply(null)
    else setEditingComment(null)
  }

  // --- Recursive render function ---
  const renderCommentThread = (item, level = 0, parentAuthor = null) => {
  const children = commentMap[item.id] || []
  const isOwner = item.authorId === user?.uid
  const isEditing = editingReply?.[item.id] || editingComment === item.id

  return (
    <View key={item.id} style={{ flexDirection: "row" }}>
      {/* Left connector line */}
      <View style={{ width: 16 * level, alignItems: "center" }}>
        {level > 0 && (
          <View style={{ width: 2, backgroundColor: "#ccc", flex: 1 }} />
        )}
      </View>

      {/* Comment card */}
      <Card className="p-3 mb-3 bg-white rounded-xl flex-1">
        <Box className="flex-row justify-between items-center mb-1">
          <Box className="flex-row items-center">
            <Image
              source={{ uri: item.authorPhoto || "https://i.pravatar.cc/100" }}
              style={{ width: 30, height: 30, borderRadius: 15, marginRight: 6 }}
            />
            <Text bold>{item.authorName}</Text>
            <Text className="text-gray-400 text-sm ml-2">
              {item.timestamp?.toDate ? timeAgo(item.timestamp.toDate(), now) : "..."}
            </Text>
          </Box>
        </Box>

        {/* Replying to parent author */}
        {parentAuthor && (
          <Box className="flex-row items-center mb-1">
            <Reply size={14} color="#555" />
            <Text className="ml-1 text-sm text-gray-600">
              Replying to @{parentAuthor}
            </Text>
          </Box>
        )}

        {isEditing ? (
          <TextInput
            value={item.parentId ? editReplyText[item.id] : editText}
            onChangeText={text =>
              item.parentId
                ? setEditReplyText(prev => ({ ...prev, [item.id]: text }))
                : setEditText(text)
            }
            className="border border-gray-300 rounded-md p-2 mb-2"
          />
        ) : (
          <Text className="mb-2">{item.content}</Text>
        )}

        {/* Likes & reply button row */}
<Box className="flex-row items-center mt-1">
  {/* Likes */}
  <TouchableOpacity
    onPress={() => toggleCommentLike(item)}
    className="flex-row items-center mr-4"
  >
    <Heart
      size={14}
      color={commentLikes[item.id] ? "red" : "black"}
      fill={commentLikes[item.id] ? "red" : "transparent"}
    />
    <Text className="ml-1 text-sm">{item.likesCount || 0} Likes</Text>
  </TouchableOpacity>

  {/* Reply as clickable text with icon */}
  <TouchableOpacity
    onPress={() =>
      setReplyVisible(prev => ({ ...prev, [item.id]: !prev[item.id] }))
    }
    className="flex-row items-center"
  >
    <Reply size={14} color="#555" />
    <Text className="ml-1 text-sm text-gray-600">
      {replyVisible[item.id] ? "Cancel" : "Reply"}
    </Text>
  </TouchableOpacity>
</Box>

        {/* Reply input */}
        {replyVisible[item.id] && (
          <Box className="mb-2 mt-2">
            <TextInput
              placeholder="Write a reply..."
              value={replyText[item.id] || ""}
              onChangeText={text =>
                setReplyText(prev => ({ ...prev, [item.id]: text }))
              }
              className="border border-gray-300 rounded-md p-2 mb-2"
            />
            <Button className="bg-green-600 px-3" onPress={() => addNestedReply(item.id)}>
              <Text className="text-white">Reply</Text>
            </Button>
          </Box>
        )}

        {/* Render children recursively */}
        {children.map(child => renderCommentThread(child, level + 1, item.authorName))}
      </Card>
    </View>
  )
}

  if (!forum) return null

  const filteredComments = allComments.filter(c =>
    c.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.authorName.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const forumMatchesSearch =
    forum.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    forum.content?.toLowerCase().includes(searchQuery.toLowerCase())

  return (
    <SafeAreaView className="flex-1 bg-[#D9E9DD] p-4">
      <ScrollView className="h-full">
        <Grid _extra={{ className: "grid-cols-12 gap-4 items-center mb-4" }}>
          <GridItem _extra={{ className: "col-span-8" }}>
            <Heading size="5xl" className="mt-6">Ariba</Heading>
          </GridItem>
          <GridItem className="flex items-center" _extra={{ className: "col-span-4" }}>
            <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="Search..." className="w-full h-12 border border-gray-400 rounded-md px-3"/>
          </GridItem>
        </Grid>

        <Box className="bg-white rounded-xl p-6 shadow-sm flex-1">
          {forumMatchesSearch ? (
            <>
              <TouchableOpacity onPress={() => router.back()} className="mb-4">
                <ArrowLeft size={24} color="black" />
              </TouchableOpacity>

              <Heading size="4xl" className="mb-1">FORUMS</Heading>
              <Text className="text-2xl font-semibold mb-4">{forum.title || "Discussion Title"}</Text>

              <Box className="flex-row items-center mb-2">
                <Image source={{ uri: forum.authorPhoto }} style={{ width: 35, height: 35, borderRadius: 18, marginRight: 8 }} />
                <Text bold>{forum.authorName}</Text>
                <Text className="text-gray-500 ml-2 text-sm">
                  {forum.timestamp?.toDate ? timeAgo(forum.timestamp.toDate(), now) : "..."}
                </Text>
              </Box>

              <Text className="text-base text-gray-700 mb-5">{forum.content}</Text>

              <Box className="flex-row items-center justify-between border-b border-gray-300 pb-3 mb-5">
                <TouchableOpacity onPress={toggleForumLike} className="flex-row items-center">
                  <Heart size={20} color={userLikes[id] ? "red" : "black"} fill={userLikes[id] ? "red" : "transparent"} />
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
<Heading size="xl" className="mb-2">Comments</Heading>
<TextInput
  placeholder="Write your insights about the discussion..."
  value={newComment}
  onChangeText={setNewComment}
  className="bg-gray-100 border border-gray-300 text-slate-700 rounded-md p-2 mb-2"
  style={{ height: 80 }} // <-- Increased height
  multiline
  textAlignVertical="top" // <-- Ensures text starts at the top
/>
<Box className="flex-row justify-end space-x-2 mb-4">
  <Button className="bg-green-600 px-4" onPress={addComment}>
    <Text className="text-white">Comment</Text>
  </Button>
  <Button className="bg-gray-300 px-4" onPress={() => setNewComment("")}>
    <Text className="text-black">Cancel</Text>
  </Button>
</Box>

              {/* Comments */}
              {filteredComments.map(c => renderCommentThread(c))}
            </>
          ) : <Text className="text-center text-gray-500 py-10">No results found for "{searchQuery}"</Text>}
        </Box>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ForumDetails
