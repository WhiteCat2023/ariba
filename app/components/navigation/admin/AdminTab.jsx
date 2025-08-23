import { View, Text, Platform } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'

const AdminTab = () => {
  return (
    <Tabs
      screenOptions={{
      headerShown: false,
      tabBarStyle: Platform.select({
        ios: {
          // Use a transparent background on iOS to show the blur effect
          position: 'absolute',
        },
        default: {},
      }),
    }}>
      <Tabs.Screen
        name="dashboard"
        options={{
        title: 'Dashboard',
        tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}/>
    </Tabs>
  )
}

export default AdminTab