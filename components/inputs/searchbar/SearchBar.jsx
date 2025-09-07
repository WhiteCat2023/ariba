import React from 'react'
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input'
import { Search } from 'lucide-react-native'


const SearchBar = () => {
  return (
    <Input
      variant="outline"
      size="md"
      isDisabled={false}
      isInvalid={false}
      isReadOnly={false}
      className=' bg-white rounded-xl flex-1'
    >
      <InputSlot
       className='ms-3'>
        <InputIcon as={Search}/>
      </InputSlot>
      <InputField 
        placeholder="Search" 
        
        />
    </Input>
  )
}

export default SearchBar