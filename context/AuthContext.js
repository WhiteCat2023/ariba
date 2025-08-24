import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { Alert, SafeAreaView, Text } from "react-native";
import { auth } from "@/api/config/firebase.config";
import { signIn, signOut } from "@/api/controller/auth.controller";
import { HttpStatus } from "@/enums/status";



const AuthContext = createContext()

export function AuthProvider({ children }) {

    const [loading, setLoading] = useState(false);
    const [session, setSession] = useState(false);
    const [user, setUser] = useState({});
    
    const router = useRouter()

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          setSession(true);
          router.replace("/admin/(tabs)");
        } else {
          setUser(null);
          setSession(false);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }, []);

    const login = async (req) => {
      setLoading(true);
      const res = await signIn(req);

      if (res.status === HttpStatus.OK) {
        console.log("Login successful");
        console.log(user.data.displayName)
        
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

export function useAuth() {
    return useContext(AuthContext)
}