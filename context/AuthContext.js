import { createContext, useContext, useState } from "react";
import { Alert, SafeAreaView } from "react-native";
import { signIn, signOut} from "../api/controller/auth.controller";
import { HttpStatus } from "../enums/status";

const AuthContext = createContext()

export function AuthProvider({ children }) {

    const [loading, setLoading] = useState(false);
    const [session, setSession] = useState(false);
    const [user, setUser] = useState(null);

    const login = async (req) => {
    setLoading(true);
    const res = await signIn(req);

    if (res.status === HttpStatus.OK) {
      setUser(res.data.user);
      setSession(true);
    } else {
      Alert.alert("Login Failed", res.message);
    }
    setLoading(false);
  };

  const register = async (req) => {
    setLoading(true);
    const res = await signUp(req);

    if (res.status === HttpStatus.OK) {
      await login({ email, password }); 
    } else {
      Alert.alert("Signup Failed", res.message);
      setLoading(false);
    }
  };

  const logout = async () => {
    const res = await signOut({ uid: user?.uid });
    if (res.status === HttpStatus.OK) {
      setUser(null);
      setSession(false);
    } else {
      Alert.alert("Logout Failed", res.message);
    }
  };

    const contextData = {session, user, login, logout, register}

    return(
        <AuthContext.Provider value={contextData}>
            {loading ? (
                <SafeAreaView>
                    <Text>Loading</Text>
                </SafeAreaView>
            ): (
                children
            )}
        </AuthContext.Provider>       
    )
    
}

export async function useAuth() {
    return useContext(AuthContext)
}