import { useAuth } from "@/context/AuthContext"
import { Button, ButtonText } from "../ui/button"

const SignOutBtn = () => {
    const {logout} = useAuth()
    return (
        <Button             
            onPress={() => logout()}
            className='rounded-xl bg-green-500'>
            <ButtonText>
                LogOut
            </ButtonText>
        </Button>
    )
}

export default SignOutBtn