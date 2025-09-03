import React, { useState } from "react"
import EditPersonalInfoInput from "../inputs/EditPersonalInfoInput"
import { Avatar, AvatarImage } from "../ui/avatar"
import { Box } from "../ui/box"
import { Card } from "../ui/card"
import { Divider } from "../ui/divider"
import { HStack } from "../ui/hstack"
import { Text } from "../ui/text"
import { VStack } from "../ui/vstack"
import { Button, ButtonText } from "../ui/button"
import SignOutBtn from "../button/SignOutBtn"
import DeleteAccountBtn from "../button/DeleteAccountBtn"

interface UserInfoCardWithAvatarProp{
  user: Object;
} 

const UserInfoCardWithAvatar: React.FC<UserInfoCardWithAvatarProp> = ({user}) => {

  const [isEdit, setEdit] = useState<boolean>(false)

  return (
    <Card className="">
        <HStack
          className="justify-between items-center">
            <HStack
              space="md"
              className="items-center">
              <Avatar
                size="lg">
                <AvatarImage
                  source={{
                    uri: `${user?.photoURL}`
                  }}/>
              </Avatar>
              <VStack>
                <Text 
                  size="xl" 
                  bold={true}>
                  {user?.displayName}
                </Text>
                <Text 
                  size="sm">
                  {user?.email}
                </Text>
                <Text 
                  size="md"
                  bold={true}>
                  ROLE
                </Text>
              </VStack>   
            </HStack>
            {
              !isEdit && (
                <Button 
                  className="bg-green-500"
                  onPress={() => setEdit(prev => !prev)}>
                    <ButtonText>
                      Edit
                    </ButtonText>
                </Button> 
              )
            }
                 
        </HStack>
        <Divider className="my-4"/>
        <Text
          bold={true}
          size="md">
          Edit Personal Information
        </Text>
        <EditPersonalInfoInput isEdit={!isEdit} setEdit={setEdit}/>
        <Divider className="my-4"/>
        <Box
          className="lg:w-96">
          <DeleteAccountBtn/>
          <SignOutBtn/>
        </Box>
        
    </Card>
  )
}

export default UserInfoCardWithAvatar