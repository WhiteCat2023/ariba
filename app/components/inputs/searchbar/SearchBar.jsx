import { View, Text } from 'react-native'
import React from 'react'
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input'
import SearchIcon from '../../icons/SearchIcon'


const SearchBar = () => {
  return (
    <Input
      variant="outline"
      size="md"
      isDisabled={false}
      isInvalid={false}
      isReadOnly={false}
      className='m-3 rounded-xl'
    >
      <InputSlot
       className='ms-3'>
        <SearchIcon/>
      </InputSlot>
      <InputField 
        placeholder="Search" 
        
        />
    </Input>
  )
}

export default SearchBar