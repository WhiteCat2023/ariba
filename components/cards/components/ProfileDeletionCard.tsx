
import { Button, ButtonText } from '@/components/ui/button'
import { LinearGradient } from '@/components/ui/lineragradient/LinearGradient'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'

const ProfileDeletionCard = () => {
  return (
    <VStack space='lg'>
        <Text size='lg' bold={true}>
            Account Deletion
        </Text>
        <Text>
            If you want to <b>permanently delete</b> this account and all of its data, you can do so below by clicking the <b>“Delete Button”</b>. 
        </Text>
        <Button className='w-48 p-0 rounded-xl overflow-hidden'>
            <LinearGradient 
                className="w-full flex-1 items-center py-2"
                colors={['#FF384A', '#FF5463']}
                start={[0, 1]}
                end={[3, 3]}>
                <ButtonText>
                    Delete Account
                </ButtonText>
            </LinearGradient>
        </Button>
    </VStack>
  )
}

export default ProfileDeletionCard