
import DisplayInput from '@/components/inputs/DisplayInput'
import { Button, ButtonText } from '@/components/ui/button'
import { Grid, GridItem } from '@/components/ui/grid'
import { Text } from '@/components/ui/text'
import { VStack } from '@/components/ui/vstack'
import React from 'react'

interface EditUserInfoProp{
    user: {
        displayName: string,
        email: string,
        phoneNumber: string
    }
} 

const EditUserInfo: React.FC<EditUserInfoProp> = ({user}) => {

    return (
        <VStack>
            <Text size='lg' bold={true}>
                Edit Account Information
            </Text>
            <Grid 
                _extra={{
                    className: "lg:grid-cols-12 lg:grid-cols-12 grid-cols-1 gap-4"
                }}>
                <GridItem
                    _extra={{
                    className: "lg:col-span-4"
                    }}>
                    <DisplayInput label='Name' value={user?.displayName} fallback='Ex. John Doe'/>
                </GridItem>
                <GridItem
                    _extra={{
                    className: "lg:col-span-4"
                    }}>
                    <DisplayInput label='Email' value={user?.email} fallback='Ex. example@email.com'/>
                </GridItem>
                <GridItem
                    _extra={{
                    className: "lg:col-span-4 lg:row-span-2"
                    }}></GridItem>
                <GridItem
                    _extra={{
                    className: "lg:col-span-4 lg:row-span-2"
                    }}>
                    <DisplayInput label='Phone Number' value={user?.phoneNumber} fallback='N/A'/>
                </GridItem>
                
                <GridItem
                    _extra={{
                    className: "lg:col-span-4 lg:row-span-2"
                    }}></GridItem>
                <GridItem
                    _extra={{
                    className: "lg:col-span-4 lg:row-span-2"
                    }}></GridItem>

                <GridItem
                    _extra={{
                    className: "lg:col-span-4 lg:row-span-2"
                    }}>
                    <DisplayInput label='Phone Number' value={user?.phoneNumber} fallback='N/A'/>
                </GridItem>
                <GridItem
                    _extra={{
                    className: "lg:col-span-4 lg:row-span-2 flex items-end"
                    }}>
                    <Button className='bg-green-500'>
                        <ButtonText>
                            Verify Email
                        </ButtonText>
                    </Button>
                </GridItem>
            </Grid>
        </VStack>
    )
}

export default EditUserInfo