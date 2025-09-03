import { FormControl, FormControlLabel, FormControlLabelText } from "../ui/form-control"
import { Input, InputField } from "../ui/input"

interface DisplayInputProps {
    label: string,
    value: string,
    fallback: string
}

const DisplayInput: React.FC<DisplayInputProps> = ({
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