import { useState } from "react"
import { Grid, GridItem } from "../ui/grid"
import EditInputWithFormControl from "./formControl/EditInputWithFormControl"
import { useAuth } from "@/context/AuthContext";
import { Button, ButtonText } from "../ui/button";

interface InputState {
  name: string;
  email: string;
  phone: string;
}

interface EditPersonalInfoInputProp {
  isEdit: boolean;
  setEdit?: (value: boolean) => void;
} 

const EditPersonalInfoInput: React.FC<EditPersonalInfoInputProp> = ({
  isEdit,
  setEdit = () => {},
}) => {

  const { user } = useAuth() 
  const [input, setInput] = useState<InputState>({
    name: "",
    email: "",
    phone: ""
  });

  const handleInputChange = (field: keyof InputState, value: string) => {
    setInput(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setInput({
      name: "",
      email: "",
      phone: ""
    });

    setEdit(false);
  };

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
          placeholder={user?.phoneNumber || "1234-1123-1233"}
        />
      </GridItem>
      {
        !isEdit && (
          <GridItem
            _extra={{
              className:""
            }}>
            <Button
              onPress={handleSave} 
              className="rounded-xl w-full">
              <ButtonText>
                Save
              </ButtonText>
            </Button>
          </GridItem>   
        )
      }
    </Grid>
  );
};

export default EditPersonalInfoInput;