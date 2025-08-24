import { SafeAreaView, ScrollView, StatusBar } from 'react-native'
import React from 'react'
import { Box } from '@/components/ui/box'
import { Text } from '@/components/ui/text'
import { Heading } from '@/components/ui/heading'
import { VStack } from '@/components/ui/vstack'
import { Card } from '@/components/ui/card'
import { HStack } from '@/components/ui/hstack'

const notifications = () => {
  return (
    <SafeAreaView className="flex-1 bg-[#D9E9DD] h-full">
      <StatusBar barStyle="dark-content" />
      <ScrollView className='h-full p-4'>
        <Box className='mb-6'>
          <Heading size='5xl' className='mt-6'>
            Notifications
          </Heading>
        </Box>
        <VStack space='sm'>
          <Card className='rounded-2xl'>
            <HStack
              className='justify-between items-center px-4'>
              <Box>
                <Heading>notification title</Heading>
                <Text>notification description or route</Text>
              </Box>
              <Text>
                new
              </Text>
            </HStack>
          </Card>
          <Card className='rounded-2xl'>
            <HStack
              className='justify-between items-center px-4'>
              <Box>
                <Heading>notification title</Heading>
                <Text>notification description or route</Text>
              </Box>
              <Text>
                new
              </Text>
            </HStack>
          </Card>
          <Card className='rounded-2xl'>
            <HStack
              className='justify-between items-center px-4'>
              <Box>
                <Heading>notification title</Heading>
                <Text>notification description or route</Text>
              </Box>
              <Text>
                12:45 AM
              </Text>
            </HStack>
          </Card>
          <Card className='rounded-2xl'>
            <HStack
              className='justify-between items-center px-4'>
              <Box>
                <Heading>notification title</Heading>
                <Text>notification description or route</Text>
              </Box>
              <Text>
                Jul 16, 2025
              </Text>
            </HStack>
          </Card>
          <Card className='rounded-2xl'>
            <HStack
              className='justify-between items-center px-4'>
              <Box>
                <Heading>notification title</Heading>
                <Text>notification description or route</Text>
              </Box>
              <Text>
                Mar 1, 2025
              </Text>
            </HStack>
          </Card>
          
          
        </VStack>

            
      </ScrollView>
    </SafeAreaView>
  )
}

export default notifications