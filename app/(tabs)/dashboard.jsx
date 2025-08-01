import { View, Text } from "react-native";
import Button from "../../components/Button";
import { signOut } from "../../api/controller/auth.controller";
import { useAuth } from "../../context/AuthContext";


export default function dashboard() {

  const {user} = useAuth();
  return (
    <View>
      <Text>
        Dashboard
      </Text>
      <Button title="Logout" onPress={() => signOut(user)}/>
    </View>
  )
}
