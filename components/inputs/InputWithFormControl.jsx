import React from 'react'
import { FormControl, FormControlLabel, FormControlLabelText, FormControlError, FormControlErrorIcon, FormControlErrorText } from '../ui/form-control'
import { Input, InputField, InputIcon } from '../ui/input'
import { AlertCircleIcon, LucideIcon, TrendingUpDown } from 'lucide-react-native';
import { Pressable } from 'react-native';

const InputWithFormControl = ({
    label,
    input, 
    setInput = ()=>{},
    placeholder,
    fallbackText,
    errorText,
    isError,
    icon,
    type,
    onIconPress = ()=>{}
}) => {
  return (
    <FormControl isInvalid={isError} isRequired className='mb-4'>
        <FormControlLabel>
          <FormControlLabelText size='lg' bold>
            {label}
          </FormControlLabelText>
        </FormControlLabel>
        <Input size="md" className={`items-center ${isError ? 'border-red-500' : ''}`}>

          <InputField
            type={type || "text"}
            placeholder={placeholder || fallbackText}
            value={input}
            onChangeText={(text) => setInput(text)}
          />
          <Pressable
            className='px-4'
            onPress={() => onIconPress()}>
            <InputIcon as={icon}/>
          </Pressable>
        </Input>
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} className="text-red-500" />
          <FormControlErrorText className="text-red-500">
            {errorText}
          </FormControlErrorText>
        </FormControlError>
      </FormControl>
  )
}

export default InputWithFormControl