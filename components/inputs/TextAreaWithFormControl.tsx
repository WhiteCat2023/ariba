import { View, Text } from 'react-native'
import React from 'react'
import { Textarea, TextareaInput } from '../ui/textarea'
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlLabel, FormControlLabelText } from '../ui/form-control'
import { AlertCircleIcon } from 'lucide-react-native';

interface TextAreaWithFormControlProps {
    label?: string;
    input?: string;
    setInput?: (value: string) => void;
    placeholder?: string;
    fallbackText?: string;
    errorText?: string;
    isError?: boolean;
}

const TextAreaWithFormControl: React.FC<TextAreaWithFormControlProps> = ({
    label,
    input, 
    setInput = ()=>{},
    placeholder,
    errorText,
    isError = false
}) => {
  return (
    <FormControl isInvalid={isError}>
        <FormControlLabel>
            <FormControlLabelText>
                {label}
            </FormControlLabelText>
        </FormControlLabel>        
        <Textarea 
            size="md"
            className="w-64">
                <TextareaInput 
                    className={`${isError ? 'border-red-500' : ''}`}
                    value={input}
                    onChangeText={(text) => setInput(text)}
                    placeholder={placeholder}/>
        </Textarea>
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} className="text-red-500" />
          <FormControlErrorText className="text-red-500">
            {errorText}
          </FormControlErrorText>
        </FormControlError>
    </FormControl>    
    
  )
}

export default TextAreaWithFormControl