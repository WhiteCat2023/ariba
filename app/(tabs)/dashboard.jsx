import { Text, View } from "react-native";
import { signOut } from "../api/controller/auth.controller";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";


export default function dashboard() {

  const {user} = useAuth();
  return (
    <View >
      <Text>
        Dashboard
      </Text>
      <Text className="text-black font-2xl"> 
        {}
        </Text>
      <Button title="Logout" onPress={() => signOut(user)}/>
    </View>
  )
}
