import { SafeAreaView, ScrollView, StatusBar} from 'react-native'
import React from 'react'
import { Box } from '@/components/ui/box'
import { Heading } from '@/components/ui/heading'
import { useAuth } from '@/context/AuthContext'
import { Button, ButtonText } from '@/components/ui/button'
import UserInfoCardWithAvatar from '@/components/cards/UserInfoCardWithAvatar'

const profile = () => {
    const {user, logout} = useAuth();
    return (
        <SafeAreaView className="flex-1 bg-[#D9E9DD] h-full p-4">
        <StatusBar barStyle="dark-content" />
            <ScrollView className='h-full'>
                <Box className='mb-6'>
                    <Heading size='5xl' className='mt-6'>
                        Profile
                    </Heading>
                </Box>
                <Box>
                    <UserInfoCardWithAvatar user={user}/> 
                </Box>
            </ScrollView>
        </SafeAreaView>
    )
}

export default profile