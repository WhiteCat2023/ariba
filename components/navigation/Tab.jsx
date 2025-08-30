import { Icon, MenuIcon } from '@/components/ui/icon'
import { Slot, usePathname, useRouter } from 'expo-router'
import React from 'react'
import { Box } from '../ui/box'
import { Pressable } from '../ui/pressable'
import { Text } from '../ui/text'
import { VStack } from '../ui/vstack'
import { HStack } from '../ui/hstack'

const Tab = ({navItem}) => {
  const router = useRouter()
  const path = usePathname()

  return(
    <Box className='relative flex-1'>
      <Slot/>
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