import { Button, ButtonText } from "../ui/button"

const DeleteAccountBtn = () => {
    return (
        <Button 
            className="bg-red-500 rounded-xl mb-2">
            <ButtonText>
                Delete Account
            </ButtonText>
        </Button>
    )
}

export default DeleteAccountBtn