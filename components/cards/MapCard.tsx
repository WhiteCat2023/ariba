
import { Box } from "../ui/box"
import { Card } from "../ui/card"
import { Grid, GridItem } from "../ui/grid"
import { HStack } from "../ui/hstack"
import { Text } from "../ui/text"
import { VStack } from "../ui/vstack"
import ReportPinpointList from "./components/ReportPinpointList"


const MapCard = () => {
  return (
    <Card>
        <Grid
            _extra={{
                className: "lg:grid-cols-12 gap-4"
            }}>
                <GridItem
                    _extra={{
                        className: "lg:col-span-6"
                    }}>
                        <VStack space="sm">
                            <Text size="2xl" bold={true}>
                                OVERSEE
                            </Text>
                            <Text>
                                List of places needed action
                            </Text>
                            <ReportPinpointList/>
                        </VStack>
                </GridItem>
                <GridItem
                    _extra={{
                        className: "lg:col-span-6"
                    }}>
                    <ReportPinpointList/>
                </GridItem>
           
        </Grid>
    </Card>
  )
}

export default MapCard