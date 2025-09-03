import { SafeAreaView, ScrollView, StatusBar, FlatList } from 'react-native'
import React from 'react'
import { Box } from '@/components/ui/box'
import { Text } from '@/components/ui/text'
import { Heading } from '@/components/ui/heading'
import { Image } from '@/components/ui/image'
import SearchBar from '@/components/inputs/searchbar/SearchBar'
import { Grid, GridItem } from '@/components/ui/grid'
import { AdminNavItem } from '@/enums/AdminNavItem'

const index = () => {
  return (
    <SafeAreaView className="flex-1 bg-[#D9E9DD] h-full p-4">
      <StatusBar barStyle="dark-content" />
      <ScrollView className='h-full'>
        <Grid
          _extra={{
            className: "lg:grid-cols-12 grid-cols-1 auto-rows-auto gap-4 h-full"
          }}>
          <GridItem
            _extra={{
              className: "col-span-8"
            }}>
            <Box>
              <Heading size='5xl' className='mt-6'>
                Ariba
              </Heading>
            </Box>
          </GridItem>
          
          <GridItem
            className='flex items-center'
            _extra={{
              className: "col-span-4"
            }}>
            <SearchBar/>
          </GridItem>
          <GridItem
            _extra={{
              className: "col-span-12"
            }}>
              {/* <FlatList
                className='bg-white rounded-xl p-4'
                data={AdminNavItem}
                renderItem={({item}) => <Text className='p-4 border'>{item.name}</Text>}/> */}
              
          </GridItem>
        </Grid>
        
            
      </ScrollView>
    </SafeAreaView>
  )
}

export default index