import { Box } from '../ui/box'
import { Card } from '../ui/card'
import { Heading } from '../ui/heading'
import { Link, LinkText } from '../ui/link'

export default function ProfileCard() {
    return (
        <Card 
            size='lg'
            className='border-2 rounded-xl'>
            <Box className='flex flex-row justify-between'>
                <Heading>Reports by tier list</Heading>
                <Link 
                    href='#'
                    isExternal="false">
                    <LinkText className='flex items-center gap-2 text-[#28a745]'>View all<Icon as={ArrowRightIcon}/></LinkText>
                </Link>
            </Box>

            <Card className='rounded-xl' >
                <Card>
                    <Box>
                        <Heading>Tier name</Heading>
                        <Text>date</Text>
                    </Box>
                </Card>
                
            </Card>
            <Card className='rounded-xl' >
                <Card>
                    <Box>
                        <Heading>Tier name</Heading>
                        <Text>date</Text>
                    </Box>
                </Card>
                
            </Card>

        </Card>
    )
}