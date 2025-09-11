import { FormControl, FormControlLabel, FormControlLabelText } from "@/components/ui/form-control"
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input"
import React, { useState } from "react";

const EditInputWithFormControl = ({
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
            onChangeText={(text) => setInput(text)}
          />
        </Input>
      </FormControl>
    )
}

export default EditInputWithFormControl