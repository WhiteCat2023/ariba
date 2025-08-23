
import React from 'react'
import Svg, { Path } from 'react-native-svg';

const SearchIcon = () => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <Path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </Svg>
  )
}

export default SearchIcon