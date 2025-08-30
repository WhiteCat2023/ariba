import { Icon, MenuIcon } from '@/components/ui/icon'
import { Slot, usePathname, useRouter } from 'expo-router'
import React from 'react'
import { Box } from '../ui/box'
import { Pressable } from '../ui/pressable'
import { Text } from '../ui/text'
import { VStack } from '../ui/vstack'
import { HStack } from '../ui/hstack'
import { Button, ButtonText } from '../ui/button'
import { Send } from 'lucide-react-native'
import { LinearGradient } from '../ui/lineragradient/LinearGradient'

const Tab = ({navItem}) => {
  const router = useRouter()
  const path = usePathname()
  const user = true

  return(
    <Box className='relative flex-1'>
      <Box className='flex-1'>
        <Slot/>
        {user && (
            <Button
              className="absolute right-4 bottom-4 p-0 rounded-xl">
              <LinearGradient
                className="w-full flex-1 items-center py-2 px-5 rounded-xl"
                colors={['#FF6348', '#FFA502']}
                start={[0, 1]}
                end={[3, 3]}>
                <ButtonText 
                  className='flex items-center gap-2'>
                  <Icon 
                    as={Send}
                    className='text-white'/>
                  Send a report
                </ButtonText>
              </LinearGradient>
            </Button>
            )}
      </Box>

      
      
      <HStack
        className='w-full h-16 border-t bg-white justify-between sticky py-2 px-4'>
          {navItem.map(({icon, name, route}, index) => {

            const isActive = path === route

            return(
              <Pressable
                key={index}
                android_ripple={{
                  color: "#89ffa9ff"
                }}
                onPress={() => router.push(route)}>
                <VStack
                  className='items-center'>
                  <Icon 
                    as={icon} 
                    className={`text-typography-500 m-1 ${isActive ? "text-[#34A853]":"text-black"}`} 
                    size='lgl'/>
                  <Text 
                    size='xs'
                    className={`${isActive ? "text-[#34A853]":"text-black"}`} >
                    {name}
                  </Text>
                </VStack>
              </Pressable>
            )
          })}
          
      </HStack>
    </Box>
  )
}

export default Tab