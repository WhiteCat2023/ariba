import { Button, ButtonText } from "../ui/button"

interface ProfileCancelButtonProp {
    onPress: () => void
} 


const ProfileCancelButton: React.FC<ProfileCancelButtonProp> = ({
    onPress
}) => {
  return (
    <Button
        onPress={onPress} 
        className="rounded-xl w-full">
            <ButtonText>
                Cancel
            </ButtonText>
    </Button>
  )
}

export default ProfileCancelButton