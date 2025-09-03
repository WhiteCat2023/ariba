import { Button, ButtonSpinner, ButtonText } from "../ui/button";



interface ProfileSaveButtonProps {
    onPress: () => void;
    isLoading: boolean;
} 

const ProfileSaveButton: React.FC<ProfileSaveButtonProps> = ({
    onPress,
    isLoading
}) => {
  return (
    <Button
        onPress={onPress} 
        className="rounded-xl w-full">
            {isLoading ? (
            <>
                <ButtonSpinner color="white"/>
                <ButtonText>
                    Saving
                </ButtonText>
            </>
            ): (
            <ButtonText>
                Save
            </ButtonText>
            )}
                
        </Button>
  )
}

export default ProfileSaveButton