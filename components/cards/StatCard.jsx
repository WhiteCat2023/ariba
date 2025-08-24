import { Card } from '@/components/ui/card'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import React from 'react'
import { View } from 'react-native'
import LineGraphIcon from '../icons/LineGraphIcon'
import BarGraphIcon from '../icons/BarGraphIcon'


const StatCard = ({header, data, icon = <LineGraphIcon/>}) => {
  return (
    <Card size="md" variant="elevated" className="flex flex-row justify-between items-center border-2 rounded-xl">
        <View>
            <Heading size="xs" className="mb-1">
                {header}
            </Heading>
            <Text size="4xl" bold="true">{data}</Text>
        </View>
        {icon}
        {/* <LineGraphIcon/> */}
        {/* <BarGraphIcon/> */}
    </Card>
  )
}

export default StatCard;