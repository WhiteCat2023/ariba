import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useEffect, useState } from "react";
import { Button, Alert, Pressable, Image } from "react-native";
import { Role } from "../../enums/roles";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../../api/config/firebase.config";
import { googleSignUp } from "../../api/controller/auth.controller";
import { signInWithToken } from "../../api/services/firebase/auth.sevices";
import * as AuthSession from "expo-auth-session";
import { newUserDoc } from "../../api/services/firebase/auth.sevices";

WebBrowser.maybeCompleteAuthSession();

export function GoogleSignInButton() {
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

export function GoogleSignUpButton() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: "171583954238-942e4itp9jo655aaf6rjf85p892jdfra.apps.googleusercontent.com",
    androidClientId: "171583954238-tis828c1rgbaos9e9uom9majjr9c4s8f.apps.googleusercontent.com",
    scopes: ["profile", "email", "openid"],
    responseType: "id_token",
    usePKCE: false,
    redirectUri: AuthSession.makeRedirectUri({ useProxy: false }),
  });

  useEffect(() => {
    if (response?.type === "success") {

      console.log(response)
      const {  id_token } = response.params;
      
      console.log("Full response object:", JSON.stringify(response, null, 2));

      if (id_token) {
        const credential = GoogleAuthProvider.credential(id_token);
        signInWithToken(credential)
          .then((userCredential) => {
            const user = userCredential.user;
            newUserDoc(userCredential, Role.USER);
            Alert.alert("Welcome!", `Signed in as ${user.displayName}`);
            console.log("Signed up user:", user);
          })
          .catch((error) => {
            console.error("Firebase sign-in error:", error);
            Alert.alert("Sign in failed", error.message);
          });
      } else {
        console.error("ID Token not found in the response.");
        Alert.alert("Sign in failed", "Google authentication failed to return an ID token.");
      }
    }
  }, [response]);

  return (

    <Pressable
      disabled={!request}
      onPress={() => promptAsync()}
      className="w-12 h-12 rounded-lg bg-white justify-center items-center shadow-sm">
      <Image 
        source={require("../../assets/images/google.png")} 
        style={{ width: 24, height: 24 }}
        resizeMode="contain" />
    </Pressable  >
  );
}
