import { SafeAreaView, StatusBar, ScrollView, Image, View } from 'react-native'
import React from 'react'
import { Box } from '@/components/ui/box'
import { Heading } from '@/components/ui/heading'
import MapCard from '@/components/cards/MapCard'

const MapScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-[#D9E9DD] h-full">
      <StatusBar barStyle="dark-content" />
      <ScrollView className='h-full p-4'>
        <Box className='mb-6'>
          <Heading size='5xl' className='mt-6'>
            Map
          </Heading>
        </Box>
        <MapCard/>    
      </ScrollView>
    </SafeAreaView>
  )
}

export default MapScreen
