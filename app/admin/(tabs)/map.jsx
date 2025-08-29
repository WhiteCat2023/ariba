import { SafeAreaView, StatusBar, ScrollView, Image, View } from 'react-native'
import React from 'react'
import { Box } from '@/components/ui/box'
import { Text } from '@/components/ui/text'
import { Heading } from '@/components/ui/heading'
import { Input, InputField } from '@/components/ui/input'
import { Grid, GridItem } from '@/components/ui/grid'

const MapScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-[#D9E9DD]">
      <StatusBar barStyle="dark-content" />

      <ScrollView className="p-6">
        {/* GRID CONTAINER */}
        <Grid
          _extra={{
            className: 'lg:grid-cols-12 grid-cols-1 auto-rows-auto gap-6',
          }}
        >
          {/* HEADER: MAP title + Search */}
          <GridItem
            _extra={{
              className:
                'lg:col-span-12 flex flex-row justify-between items-center mb-6',
            }}
          >
            <Heading size="5xl" className="font-extrabold text-black">
              MAP
            </Heading>

            <Box className="w-[250px]">
              <Input className="rounded-lg bg-white">
                <InputField placeholder="Search" />
              </Input>
            </Box>
          </GridItem>

          {/* MAIN WHITE CONTAINER */}
          <GridItem
            _extra={{
              className: 'lg:col-span-12',
            }}
          >
            <Box className="bg-white rounded-xl shadow p-6">
              <Grid
                _extra={{
                  className: 'lg:grid-cols-12 grid-cols-1 gap-6',
                }}
              >
                {/* LEFT SIDE LIST */}
                <GridItem
                  _extra={{
                    className: 'lg:col-span-7',
                  }}
                >
                  {/* OVERSEE + subtitle stacked */}
                  <View className="mb-4">
                    <Text className="text-4xl font-bold text-black">
                      OVERSEE
                    </Text>
                    <Text className="text-base text-gray-600">
                      List of places needed action
                    </Text>
                  </View>

                  {[
                    'Crash around Colon Bridge',
                    'Pothole Spotted A–Borress',
                    'Shooting near Tupas Street',
                    'Pothole Spotted Lakandula Street',
                    'Gang War at Tres De Abril Street',
                    'E-bike Crash Tupas Street',
                    'Crashed Out Guadalupe River',
                    'Flood Canete Eskinita',
                    'Injured Person at Espelita',
                  ].map((item, idx) => (
                    <View
                      key={idx}
                      className="mb-3 bg-white rounded-lg border border-[#00A347] flex-row"
                      style={{
                        paddingVertical: 10,
                        paddingHorizontal: 14,
                        alignItems: 'stretch',
                      }}
                    >
                      {/* Left green vertical line */}
                      <View
                        style={{
                          width: 4,
                          backgroundColor: '#00A347',
                          borderRadius: 2,
                          marginRight: 10,
                        }}
                      />
                      {/* Text content */}
                      <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text className="font-bold text-base text-[#004d25]">
                          {item}
                        </Text>
                        <Text className="text-sm text-gray-500 mt-1">
                          01:00 PM – 02:00 PM
                        </Text>
                      </View>
                    </View>
                  ))}
                </GridItem>

                {/* RIGHT SIDE MAP */}
                <GridItem
                  _extra={{
                    className: 'lg:col-span-5',
                  }}
                >
                  <Image
                    source={require('@/assets/images/mapshit.png')}
                    className="w-full h-[420px] rounded-xl"
                    resizeMode="cover"
                  />
                </GridItem>
              </Grid>
            </Box>
          </GridItem>
        </Grid>
      </ScrollView>
    </SafeAreaView>
  )
}

export default MapScreen
