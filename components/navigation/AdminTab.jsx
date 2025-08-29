import { View, Text, Platform } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { AddIcon, Icon, MenuIcon } from '@/components/ui/icon'

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
        tabBarIcon: ({ color }) => <Icon as={MenuIcon} className={`text-[${color}]`} />,
        }}/>
        
    </Tabs>
  )
}

export default AdminTab