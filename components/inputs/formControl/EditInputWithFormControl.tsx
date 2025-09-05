import { FormControl, FormControlLabel, FormControlLabelText } from "@/components/ui/form-control"
import { Icon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input"
import { Pressable } from "@/components/ui/pressable";
import { useAuth } from "@/context/AuthContext"
import { Edit } from "lucide-react-native";
import { useState } from "react";

interface EditInputWithFormControlProps {
  label: string;
  input: string;
  setInput?: (value: string) => void;
  isEdit?: boolean;
  placeholder: string;
  fallbackText: string;
}

const EditInputWithFormControl: React.FC<EditInputWithFormControlProps> = ({
    label,
    input, 
    setInput = ()=>{},
    isEdit,
    placeholder,
    fallbackText
    }) => {

    return (
      <FormControl isReadOnly={isEdit}>
        <FormControlLabel>
          <FormControlLabelText>
            {label}
          </FormControlLabelText>
        </FormControlLabel>
        <Input size="md">
          <InputField
            type="text"
            placeholder={placeholder || fallbackText}
            value={input}
            onChangeText={(text: string) => setInput(text)}
          />
        </Input>
      </FormControl>
    )
}

export default EditInputWithFormControl