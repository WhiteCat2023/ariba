import React from "react"
import { FormControl, FormControlLabel, FormControlLabelText } from "../ui/form-control"
import { Input, InputField } from "../ui/input"

const DisplayInput = ({
    label,
    value,
    fallback
}) => {
  return (
    <FormControl isReadOnly={true}>
        <FormControlLabel>
            <FormControlLabelText>
                {label}
            </FormControlLabelText>
        </FormControlLabel>
        <Input size="md">
            <InputField
                type="text"
                value={value || fallback}
                onChangeText={() => {}}
            />
        </Input>
    </FormControl>
  )
}

export default DisplayInput