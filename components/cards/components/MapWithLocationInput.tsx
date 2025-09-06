import { Box } from '@/components/ui/box';
import { AppleMaps, GoogleMaps } from 'expo-maps';
import React from 'react';
import { Platform, Text } from 'react-native';

const MapWithLocationInput = () => {
  if (Platform.OS === 'ios') {
    return <AppleMaps.View style={{ flex: 1 }} />;
  } else if (Platform.OS === 'android' || Platform.OS === 'web') {
    return <GoogleMaps.View style={{ flex: 1 }} />;
  } else {
    return <Text>Maps are only available on Android and iOS</Text>;
  }
}

export default MapWithLocationInput