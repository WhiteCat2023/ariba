import { Card } from "@/components/ui/card"
import { Divider } from "@/components/ui/divider"
import { HStack } from "@/components/ui/hstack"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"
import React from "react"

type Props = {
    title:string,
    date: string
}

const ReportListItemCard = ({title, date}: Props) => {
    return (
        <Card className="p-2">
            <HStack space="sm">
                <Divider orientation="verical" className="w-2 bg-green-500 rounded" />
                <VStack className="my-2">
                    <Text className=" text-[#084518]" bold={true}>
                        {title}     
                    </Text>
                    <Text>
                        {date}
                    </Text>
                </VStack>
            </HStack>
        </Card>
    )
}

export default ReportListItemCard