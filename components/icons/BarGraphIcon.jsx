import { View, Text } from 'react-native'
import React from 'react'
import Svg, { Path } from 'react-native-svg';

const BarGraphIcon = () => {
  return (
    <Svg width="48" height="32" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Path d="M4 32V20" stroke="#34D399" strokeWidth="6" strokeLinecap="round"/>
        <Path d="M16 32V12" stroke="#34D399" strokeWidth="6" strokeLinecap="round"/>
        <Path d="M28 32V24" stroke="#34D399" strokeWidth="6" strokeLinecap="round"/>
        <Path d="M40 32V4" stroke="#34D399" strokeWidth="6" strokeLinecap="round"/>
    </Svg>
  )
}

export default BarGraphIcon