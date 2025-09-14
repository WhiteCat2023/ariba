import { useAuth } from '@/context/AuthContext'
import { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage } from '../ui/avatar'
import { Card } from '../ui/card'
import { VStack } from '../ui/vstack'
import { Text } from '../ui/text'
import { Center } from '../ui/center'
import { Button, ButtonText } from '../ui/button'

export default function ProfileCard() {
    const {user} = useAuth()
    return (
      <Card size="lg" className="border-2 rounded-xl h-full">
        <VStack className='items-center' space='lg'>
          <Avatar size="2xl">
            <AvatarImage
              source={{
                uri: `${user?.photoURL}`,
              }}
            />
            {!user?.photoURL && (
              <AvatarFallbackText>{user?.displayName}</AvatarFallbackText>
            )}
            <AvatarBadge />
          </Avatar>
          <Text bold size='xl'>{user?.displayName}</Text>
          <Button
           variant='outline'>
            <ButtonText>
                View Profile
            </ButtonText>
          </Button>
        </VStack>
      </Card>
    );
}