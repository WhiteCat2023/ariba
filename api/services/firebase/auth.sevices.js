// working on this
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../config/firebase.config";
import { setDoc,doc } from "firebase/firestore";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useEffect } from "react";
import { Button, Alert } from "react-native";
import { Role } from "../../../enums/roles";


export async function signInUser(email, password){
   return await signInWithEmailAndPassword(auth, email, password);
}

export async function createUser(email, password){
   return await createUserWithEmailAndPassword(auth, email, password);
}

export async function signOutUser(){
   return await signOut(auth)
} 

export async function userForgotPassword(email) {
   return await sendPasswordResetEmail(auth, email)
}

export async function signInGoogle(params) {
    return await signInGoogle()  
}

export async function signInFacebook(params) {
    return await sign()
}

export async function newUserDoc(userCredentials, role) {
  try {
    const {
      uid,
      displayName,
      email,
      phoneNumber,
      metadata,
      providerData,
    } = userCredentials.user;

    if (!role) throw new Error("Role not specified");

    const providerId = providerData?.[0]?.providerId || null;
    const photoUrl = providerData?.[0]?.photoURL || null;

    await setDoc(doc(db, "users", uid), {
      name: displayName,
      email,
      phone: phoneNumber || null,
      photoUrl,
      providerId,
      createdAt: metadata?.creationTime || null,
      lastSignedIn: metadata?.lastSignInTime || null,
      role,
    });
  } catch (error) {
    console.error(`Firestore Error: ${error.message}`);
    throw error;
  }
}

WebBrowser.maybeCompleteAuthSession();

export function GoogleAuth() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    // expoClientId: "354981369830-co33rt64bbom866klbg7dvsckddcriim.apps.googleusercontent.com",
    // androidClientId: "354981369830-vkv1pogoktq6tg7shha660s8ho3kn6c2.apps.googleusercontent.com",
    webClientId: "48415763259-647328idkkd1m3kct8j50l0t9c19rgc4.apps.googleusercontent.com",
    scopes: ["profile", "email"],
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      fetchUserInfo(authentication.accessToken);
    }
  }, [response]);

  const fetchUserInfo = async (accessToken) => {
    try {
      const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const user = await res.json();
      Alert.alert("Welcome", `Hello ${user.name}`);
      console.log("User Info:", user);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch user info");
      console.error(error);
    }
  };

  return (
    <Button
      title="Continue with Google"
      disabled={!request}
      onPress={() => {
        promptAsync()
        console.log("REDIRECT URI", AuthSession.makeRedirectUri());

      }}
    />
  );
}

export function GoogleSignUp() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    // expoClientId: "354981369830-co33rt64bbom866klbg7dvsckddcriim.apps.googleusercontent.com",
    // androidClientId: "354981369830-vkv1pogoktq6tg7shha660s8ho3kn6c2.apps.googleusercontent.com",
    webClientId: "48415763259-647328idkkd1m3kct8j50l0t9c19rgc4.apps.googleusercontent.com",
    scopes: ["profile", "email"],
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.authentication;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          const user = userCredential.user;
          newUserDoc(userCredential, Role.USER)
          Alert.alert("Welcome!", `Signed in as ${user.displayName}`);
          console.log("Signed up user:", user);
        })
        .catch((error) => {
          console.error("Firebase sign-in error:", error);
          Alert.alert("Sign in failed", error.message);
        });
    }
  }, [response]);

  return (
    <Button
      title="Sign up with Google"
      disabled={!request}
      onPress={() => promptAsync()}
    />
  );
}


