import { Text, View } from "react-native";
import "../global.css";
import { Text, TextInput, View } from "react-native";
import "../global.css"
import { useEffect, useId, useState } from "react";
import { Button } from "react-native";
import { newUser, signIn } from "../api/controller/auth.controller";
import { allUsers } from "../api/controller/users.controller";
import { getAllUsers } from "../api/services/firebase/users.services";


export default function Index() {

  

//   const [user, setUser] = useState({
//     email: "",
//     password: ""
//   });

//   const [data, setData] = useState({})
//   const [users, setUsers] = useState([])

// useEffect(() => {
//   const unsubscribe = getAllUsers(setUsers); // set up real-time listener
//   return () => unsubscribe && unsubscribe(); // clean up on unmount
// }, []);



//   const handleCreate = async () => {
//     if (!user.email || !user.password) {
//       return;
//     }

//     try {
//       const response = await signIn(user);
//       console.log("User created:", response);
//       const userData = setUser({ email: "", password: "" }); // reset input
//       setData(userData)
//     } catch (error) {
//       console.error("User creation failed:", error);
//     }
//   };



  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* <Text className="text-xl font-bold text-blue-500">Ariba</Text>
      <TextInput
        placeholder="Email"
        value={user.email}
        onChangeText={(text) => setUser({...user, email: text})}
      />
      <TextInput
        placeholder="password"
        value={user.password}
        onChangeText={(text) => setUser({...user, password: text})}
      />
      <Button
        title="Create"
        onPress={handleCreate}
      />

      <Text style={{ marginTop: 20, fontWeight: "bold" }}>All Users:</Text>
      {users.map((userss, index) => (
        <Text key={index}>{userss.name}</Text>
      ))} */}
    </View>
  );
}

