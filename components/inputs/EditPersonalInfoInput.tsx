import React, { useState } from "react"
import { Grid, GridItem } from "../ui/grid"
import EditInputWithFormControl from "./formControl/EditInputWithFormControl"
import { useAuth } from "@/context/AuthContext";
import { Button, ButtonSpinner, ButtonText } from "../ui/button";
import { updateName } from "@/api/controller/users.controller";
import { Card } from "../ui/card";
import { Text } from "../ui/text";
import { HttpStatus } from "@/enums/status";
import ProfileSaveButton from "../button/ProfileSaveButton";
import ProfileCancelButton from "../button/ProfileCancelButton";

interface InputState {
  name: string;
  email: string;
  phone: string;
}

interface EditPersonalInfoInputProps {
  isEdit: boolean;
  setEdit?: (value: boolean) => void;
} 

interface NewCredentials {
  name?: string,
  phone?:string,
}

const EditPersonalInfoInput: React.FC<EditPersonalInfoInputProps> = ({
  isEdit,
  setEdit = () => {},
}) => {

  const { user } = useAuth() 
  const [input, setInput] = useState<InputState>({
    name: "",
    email: "",
    phone: ""
  });
  const [isSave, setSave] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleSave = (input: NewCredentials) => {
    const newCredentials = {
      uid: user.uid,
      name: input.name
    }
    const save = updateName(newCredentials)
    // console.log(newCredentials)
    if(save.status === HttpStatus.OK) return true;
    console.log(save)

    return false;
  }

  const handleInputChange = (field: keyof InputState, value: string) => {
    setInput(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSetInput = () => {
    setLoading(true)
    setInput({
      name: "",
      email: "",
      phone: ""
    });
    
    const save = handleSave(input)
    setSave(save)
    setLoading(false)
    setEdit(false);
  };

  const handleCancel = () => {
    setEdit(false)
  }

  return (
    <Grid 
      _extra={{
        className: "lg:grid-cols-12 lg:grid-cols-12 grid-cols-1 gap-4"
      }}>
      <GridItem
        _extra={{
          className: "lg:col-span-4"
        }}>
        <EditInputWithFormControl
          label="Name"
          input={input.name}
          setInput={(value) => handleInputChange('name', value)}
          isEdit={isEdit}
          placeholder={user?.displayName}
          fallbackText="Ex. John Doe"
        />
      </GridItem>
      <GridItem
        _extra={{
          className: "lg:col-span-4"
        }}>
        <EditInputWithFormControl
          label="Email"
          input={input.email}
          setInput={(value) => handleInputChange('email', value)}
          isEdit={isEdit}
          placeholder={user?.email}
          fallbackText="example@email.com"
        />
      </GridItem>
      <GridItem
        _extra={{
          className: "lg:col-span-4 lg:row-span-2"
        }}>
        <EditInputWithFormControl
          label="Phone"
          input={input.phone}
          setInput={(value) => handleInputChange('phone', value)}
          isEdit={isEdit}
          placeholder={user?.phoneNumber}
          fallbackText="1234-1123-1233"
        />
      </GridItem>
      {isSave && (
        <Card>
          <Text
            className={`${isSave ? "text-green-500": "text-red-500"}`}>{isSave ? "Updated Successfully!": "Something went wrong."}</Text>
        </Card>
      )}
      {
        !isEdit && (
          <>
            <GridItem
              _extra={{
                className:""
              }}>
              <ProfileSaveButton onPress={handleSetInput} isLoading={isLoading}/>
            </GridItem>   
            <GridItem
              _extra={{
                className:""
              }}>
              <ProfileCancelButton onPress={handleCancel}/>
            </GridItem>
          </>   
        )
      }
    </Grid>
  );
};

export default EditPersonalInfoInput;