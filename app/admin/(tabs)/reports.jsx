import { SafeAreaView, ScrollView, StatusBar } from 'react-native'
import React from 'react'
import { Box } from '@/components/ui/box'
import { Text } from '@/components/ui/text'
import { Heading } from '@/components/ui/heading'


const reports = () => {
  return (
        <SafeAreaView className="flex-1 bg-[#D9E9DD] h-full p-4">
            <StatusBar barStyle="dark-content" />
            <ScrollView className='h-full'>
                <Box>
                    <Heading size='5xl' className='mt-6'>
                        Reports
                    </Heading>
                </Box>
                <Box>

                </Box>
            
            </ScrollView>
        </SafeAreaView>
  )
}

export default reports