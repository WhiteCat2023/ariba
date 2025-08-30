import { SafeAreaView, ScrollView, StatusBar } from 'react-native'
import React from 'react'
import { Box } from '@/components/ui/box'
import { Heading } from '@/components/ui/heading'
import { useAuth } from '@/context/AuthContext'
import { Button, ButtonText } from '@/components/ui/button'


const profile = () => {

  const { logout } = useAuth();
  return (
    <SafeAreaView className="flex-1 bg-[#D9E9DD] h-full p-4">
      <StatusBar barStyle="dark-content" />
      <ScrollView className='h-full'>
        <Box>
          <Heading size='5xl' className='mt-6'>
            Profile
          </Heading>
        </Box>
        <Box>
          <Button           
            onPress={() => logout()}
            className='m-8 rounded-xl'>
              <ButtonText>
                LogOut
            </ButtonText>
        </Button>
        </Box>
                  
      </ScrollView>
    </SafeAreaView>
  )
}

export default profile