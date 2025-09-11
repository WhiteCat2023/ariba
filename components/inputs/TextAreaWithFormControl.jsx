import React from 'react'
import { Textarea, TextareaInput } from '../ui/textarea'
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlLabel, FormControlLabelText } from '../ui/form-control'
import { AlertCircleIcon } from 'lucide-react-native';
import { Icon } from '../ui/icon';

const TextAreaWithFormControl = ({
    label,
    input, 
    setInput = ()=>{},
    placeholder,
    errorText,
    isError = false
}) => {
  return (
    <FormControl 
      isInvalid={isError} 
      isRequired
      className='mb-4'>
        <FormControlLabel>
            <FormControlLabelText size='lg' bold>
                {label}
            </FormControlLabelText>
        </FormControlLabel>        
        <Textarea 
            size="md"
            isInvalid={isError}
            >
                <TextareaInput 
                    
                    value={input}
                    onChangeText={(text) => setInput(text)}
                    placeholder={placeholder}/>
        </Textarea>
        <FormControlError >
          <Icon className="text-red-500" />
          <FormControlErrorText className="text-red-500">
            {errorText}
          </FormControlErrorText>
        </FormControlError>
    </FormControl>    
    
  )
}

export default TextAreaWithFormControl