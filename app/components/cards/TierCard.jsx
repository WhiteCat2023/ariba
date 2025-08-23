
import React from 'react'
import { Card } from '@/components/ui/card'
import { Heading } from '@/components/ui/heading'
import { Box } from '@/components/ui/box'
import { Text } from '@/components/ui/text'
import { Link, LinkText } from '@/components/ui/link'
import { ArrowRightIcon, Icon } from '@/components/ui/icon'

const TierCard = () => {
  return (
    <Card className='m-4 border-2 rounded-xl'>
        <Box className='flex flex-row justify-between'>
            <Heading>Reports by tier list</Heading>
            <Link 
                href='#'
                isExternal="false">
                <LinkText className='flex items-center gap-2 text-[#28a745]'>View all<Icon as={ArrowRightIcon}/></LinkText>
            </Link>
        </Box>

        <Card className='rounded-xl' >
            <Box>
                <Heading>Tier name</Heading>
                <Text>date</Text>
            </Box>
            <Text>2 reports</Text>
        </Card>

    </Card>
  )
}

export default TierCard