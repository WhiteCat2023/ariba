import { SafeAreaView, ScrollView, StatusBar, FlatList, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Box } from '@/components/ui/box'
import { Text } from '@/components/ui/text'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Input, InputField } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@/components/ui/modal'
import { Grid, GridItem } from '@/components/ui/grid'
import { db } from '@/api/config/firebase.config'
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  increment,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'
import { Heart, MessageCircle, Edit, Trash2 } from 'lucide-react-native'
import { useAuth } from '@/context/AuthContext'
import SearchBar from '@/components/inputs/searchbar/SearchBar'

const ForumsScreen = () => {
  const { user } = useAuth()

  const [discussions, setDiscussions] = useState([])
  const [newDiscussion, setNewDiscussion] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filter, setFilter] = useState('newest')

  const [selectedForum, setSelectedForum] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false)

  const [userLikes, setUserLikes] = useState({})
  const [isEditPostOpen, setIsEditPostOpen] = useState(false)
  const [editPostText, setEditPostText] = useState('')

  // Load cached likes
  useEffect(() => {
    const loadCachedLikes = async () => {
      try {
        const cached = await AsyncStorage.getItem(`userLikes_${user?.uid}`)
        if (cached) {
          setUserLikes(JSON.parse(cached))
        }
      } catch (e) {
        console.error('Error loading cached likes:', e)
      }
    }
    if (user) loadCachedLikes()
  }, [user])

  const saveLikesToCache = async (likes) => {
    try {
      await AsyncStorage.setItem(`userLikes_${user?.uid}`, JSON.stringify(likes))
    } catch (e) {
      console.error('Error saving likes:', e)
    }
  }

  // Discussions realtime
  useEffect(() => {
    let q = collection(db, 'forums')
    if (filter === 'newest') {
      q = query(collection(db, 'forums'), orderBy('timestamp', 'desc'))
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let fetched = []
      snapshot.forEach((docSnap) => {
        fetched.push({ id: docSnap.id, ...docSnap.data() })
      })
      setDiscussions(fetched)
    })

    return () => unsubscribe()
  }, [filter])

  // Sync likes
  useEffect(() => {
    if (!user) return
    const likesRef = collection(db, 'userLikes', user.uid, 'forums')
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

  const addDiscussion = async () => {
    if (!newDiscussion.trim()) return
    await addDoc(collection(db, 'forums'), {
      title: 'Discussion Title',
      content: newDiscussion,
      likesCount: 0,
      commentsCount: 0,
      authorName: user?.displayName || 'Anonymous',
      authorPhoto: user?.photoURL || 'https://i.pravatar.cc/100',
      authorId: user?.uid,
      timestamp: serverTimestamp(),
    })
    setNewDiscussion('')
    setIsModalOpen(false)
  }

  const editDiscussion = async () => {
    if (!editPostText.trim() || !selectedForum) return
    const forumRef = doc(db, 'forums', selectedForum.id)
    await updateDoc(forumRef, { content: editPostText })
    setIsEditPostOpen(false)
    setSelectedForum(null)
    setEditPostText('')
  }

  const deleteDiscussion = async (forumId) => {
    await deleteDoc(doc(db, 'forums', forumId))
  }

  const toggleLike = async (forum) => {
    if (!user) return
    const forumRef = doc(db, 'forums', forum.id)
    const likeRef = doc(db, 'forums', forum.id, 'likes', user.uid)
    const userLikeRef = doc(db, 'userLikes', user.uid, 'forums', forum.id)

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

  const openComments = (forum) => {
    setSelectedForum(forum)
    setIsCommentsModalOpen(true)

    const commentsRef = collection(db, 'forums', forum.id, 'comments')
    const q = query(commentsRef, orderBy('timestamp', 'asc'))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let fetched = []
      snapshot.forEach((docSnap) => {
        fetched.push({ id: docSnap.id, ...docSnap.data() })
      })
      setComments(fetched)
    })

    return unsubscribe
  }

  const addComment = async () => {
    if (!newComment.trim() || !selectedForum) return

    const commentsRef = collection(db, 'forums', selectedForum.id, 'comments')
    await addDoc(commentsRef, {
      content: newComment,
      authorName: user?.displayName || 'Anonymous',
      authorPhoto: user?.photoURL || 'https://i.pravatar.cc/100',
      authorId: user?.uid,
      timestamp: serverTimestamp(),
    })

    const forumRef = doc(db, 'forums', selectedForum.id)
    await updateDoc(forumRef, { commentsCount: increment(1) })

    setNewComment('')
  }

  return (
    <SafeAreaView className="flex-1 bg-[#D9E9DD] h-full p-4">
      <StatusBar barStyle="dark-content" />
      <ScrollView className="h-full">
        <Grid
          _extra={{
            className: 'lg:grid-cols-12 grid-cols-1 auto-rows-auto gap-4 h-full',
          }}
        >
          <GridItem _extra={{ className: 'col-span-8' }}>
            <Box>
              <Heading size="5xl" className="mt-6">Ariba</Heading>
            </Box>
          </GridItem>

          <GridItem className="flex items-center" _extra={{ className: 'col-span-4' }}>
            <SearchBar />
          </GridItem>

          <GridItem _extra={{ className: 'col-span-12' }}>
            <Box className="bg-white rounded-xl p-6 shadow-sm">
              <Heading size="3xl">FORUMS</Heading>
              <Text className="text-gray-500 mt-1">{discussions.length} Discussions</Text>

              {/* Filters */}
              <Box className="flex-row items-center mt-4 mb-4">
                <Button
                  variant={filter === 'newest' ? 'solid' : 'outline'}
                  className="mr-2"
                  onPress={() => setFilter('newest')}
                >
                  Newest
                </Button>
                <Button
                  variant={filter === 'ongoing' ? 'solid' : 'outline'}
                  className="mr-2"
                  onPress={() => setFilter('ongoing')}
                >
                  Ongoing
                </Button>
                <Button variant="outline">Filters</Button>
              </Box>

              {/* Forum List */}
              <FlatList
                data={discussions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  const liked = userLikes[item.id] || false
                  const isOwner = item.authorId === user?.uid
                  return (
                    <Card className="p-5 mb-4 rounded-xl border border-gray-300 bg-white shadow-sm">
                      <Box className="flex-row items-center mb-3 justify-between">
                        <Box className="flex-row items-center">
                          <Image
                            source={{ uri: item.authorPhoto }}
                            style={{ width: 35, height: 35, borderRadius: 18, marginRight: 10 }}
                          />
                          <Text bold size="md">{item.authorName}</Text>
                        </Box>
                        {isOwner && (
                          <Box className="flex-row">
                            <TouchableOpacity
                              onPress={() => {
                                setSelectedForum(item)
                                setEditPostText(item.content)
                                setIsEditPostOpen(true)
                              }}
                            >
                              <Edit size={18} style={{ marginRight: 10 }} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => deleteDiscussion(item.id)}>
                              <Trash2 size={18} color="red" />
                            </TouchableOpacity>
                          </Box>
                        )}
                      </Box>

                      <Text size="xs" className="text-gray-500 mb-2">
                        {item.timestamp?.toDate ? item.timestamp.toDate().toLocaleString() : '...'}
                      </Text>

                      <Text className="mb-3 leading-5">{item.content}</Text>

                      <Box className="flex-row items-center">
                        <TouchableOpacity onPress={() => toggleLike(item)} className="flex-row items-center mr-6">
                          <Heart
                            size={20}
                            color={liked ? 'red' : 'black'}
                            fill={liked ? 'red' : 'transparent'}
                          />
                          <Text className="ml-1 text-gray-700">{item.likesCount || 0} Likes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => openComments(item)} className="flex-row items-center">
                          <MessageCircle size={20} />
                          <Text className="ml-1 text-gray-700">{item.commentsCount || 0} Comments</Text>
                        </TouchableOpacity>
                      </Box>
                    </Card>
                  )
                }}
              />

              <Button className="mt-4" onPress={() => setIsModalOpen(true)}>
                + New Discussion
              </Button>
            </Box>
          </GridItem>
        </Grid>
      </ScrollView>

      {/* New Discussion Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalContent>
          <ModalHeader>
            <Text bold>Start a Discussion</Text>
          </ModalHeader>
          <ModalBody>
            <Input>
              <InputField
                placeholder="Write your discussion..."
                value={newDiscussion}
                onChangeText={setNewDiscussion}
              />
            </Input>
          </ModalBody>
          <ModalFooter>
            <Button onPress={addDiscussion}>Post</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Discussion Modal */}
      <Modal isOpen={isEditPostOpen} onClose={() => setIsEditPostOpen(false)}>
        <ModalContent>
          <ModalHeader>
            <Text bold>Edit Post</Text>
          </ModalHeader>
          <ModalBody>
            <Input>
              <InputField
                placeholder="Edit your discussion..."
                value={editPostText}
                onChangeText={setEditPostText}
              />
            </Input>
          </ModalBody>
          <ModalFooter>
            <Button onPress={editDiscussion}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Comments Modal */}
      <Modal isOpen={isCommentsModalOpen} onClose={() => setIsCommentsModalOpen(false)}>
        <ModalContent className="h-[70%]">
          <ModalHeader>
            <Text bold>Comments</Text>
          </ModalHeader>
          <ModalBody>
            <FlatList
              data={comments}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Card className="p-3 mb-2 rounded-lg border border-gray-200 bg-gray-50">
                  <Box className="flex-row items-start">
                    <Image
                      source={{ uri: item.authorPhoto }}
                      style={{ width: 28, height: 28, borderRadius: 14, marginRight: 8 }}
                    />
                    <Box className="flex-1">
                      <Text bold>{item.authorName}</Text>
                      <Text>{item.content}</Text>
                      <Text size="xs" className="text-gray-400 mt-1">
                        {item.timestamp?.toDate ? item.timestamp.toDate().toLocaleString() : '...'}
                      </Text>
                    </Box>
                  </Box>
                </Card>
              )}
            />
            <Input className="mt-4">
              <InputField
                placeholder="Write a comment..."
                value={newComment}
                onChangeText={setNewComment}
              />
            </Input>
          </ModalBody>
          <ModalFooter>
            <Button onPress={addComment}>Reply</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </SafeAreaView>
  )
}

export default ForumsScreen
