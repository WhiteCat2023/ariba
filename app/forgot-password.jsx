import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, Platform, SafeAreaView, Text, View } from "react-native";
import { forgotPassword } from "./api/controller/auth.controller";
import Button from "./components/button/Button";
import Card from "./components/cards/Card";
import Input from "./components/inputs/Input";
import { GoogleSignUpButton } from "./components/button/googleAuthButtons";
import { HttpStatus } from "./enums/status";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const isWeb = Platform.OS === "web";

  const handleSendEmail = async () => {
    if (!email) {
      Alert.alert("Please enter your email");
      return;
    }

    const req = await forgotPassword(email)
    if(req.status === HttpStatus.OK){
      console.log("REQ SENT")
    }

  // Alert.alert(
  //   "Password reset link sent",
  //   "Check your email for the reset link.",
  //   [
  //     {
  //       text: "OK",
  //       onPress: () => router.push("/reset-password"),
  //     },
  //   ]
  // );
};

// ===== MOBILE VERSION =====
  if (!isWeb) {
    return (
    <SafeAreaView className="flex-1 px-6 bg-white justify-center">
        {/* Logo */}
        <Text className="text-green-600 text-6xl mb-1 text-center font-[Pacifico]">
          Ariba
        </Text>
        <Text className="text-black text-center mb-6 font-semibold">
          Locate - Report- Connect
        </Text>

        {/* Email prompt */}
        <Text className="text-center text-black mb-14">
          Enter Email so we can send you confirmation
        </Text>

        {/* Input */}
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          leftIconName="mail"
          className="mb-6 border border-green-500 rounded-md bg-white"
        />

        {/* Send Email button */}
        <Button
          title="Send Email"
          onPress={handleSendEmail}
          className="w-full py-3 rounded-lg mb-6"
          textStyle={{ color: "white", fontWeight: "bold" }}
          style={{ backgroundColor: "#34C759" }}
        />

        {/* Divider */}
        <View className="flex-row items-center my-10">
          <View className="flex-1 h-px bg-black -mt-14" />
          <Text className="text-xs text-black mx-2 -mt-14">Sign up Instead</Text>
          <View className="flex-1 h-px bg-black -mt-14" />
        </View>

        {/* Sign up button */}
        <Button
          title="Sign up"
          onPress={() => router.push("/signup")}
          className="w-full py-3 rounded-lg mt-4"
          textStyle={{ color: "white", fontWeight: "bold" }}
          style={{ backgroundColor: "#FF7A00" }}
        />

        {/* Social login buttons */}
        <View className="flex-row justify-center mt-6 space-x-6">
          {/* <Button
          onPress={() => {}}
          style={{ marginRight: 30 }} // Add spacing here
          className="w-12 h-12 rounded-lg bg-white justify-center items-center shadow-md">
            <Image
              source={require("../assets/images/google.png")}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          </Button> */}
          <View 
            style={{ marginRight: 30 }} // Add spacing here
            className="w-12 h-12 rounded-lg bg-white justify-center items-center shadow-md">
            <GoogleSignUpButton/>
          </View>
          <Button className="w-12 h-12 rounded-lg bg-white justify-center items-center shadow-md">
            <Image
              source={require("../assets/images/facebook.png")}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          </Button>
        </View>
    </SafeAreaView>
  );
}


  return (
    <SafeAreaView
      className={`flex-1 ${isWeb ? "flex-row" : "px-6"} bg-[#f6f6f6] justify-center items-center`}
    >
      <Card className="w-[90%] max-w-md p-8 rounded-2xl">
        <Text className="text-green-600 text-6xl mb-4 text-center font-[Pacifico]">
          Ariba
        </Text>

        <Text className="text-black text-center mb-6">
          Enter Email so we can send you confirmation
        </Text>

        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          leftIconName="mail"
          className="mb-6 border border-green-500 rounded-lg"
        />

        <Button
          title="Send Email"
          onPress={handleSendEmail}
          className="w-full py-3 rounded-lg mb-4"
          textStyle={{ color: "white", fontWeight: "bold" }}
          style={{ backgroundColor: "#34A853" }}
        />

        <View className="flex-row items-center my-4">
          <View className="flex-1 h-px bg-black mx-2" />
          <Text className="text-xs text-black">Don’t have an account?</Text>
          <View className="flex-1 h-px bg-black mx-2" />
        </View>

        <Button
          title="Sign up"
          onPress={() => router.push("/signup")}
          className="bg-orange-400 w-full py-3 rounded-lg mb-6"
          textStyle={{ color: "white", fontWeight: "bold" }}
          style={{ backgroundColor: "#FF7A00" }}
        />

        {/* Social login buttons */}
        <View className="flex-row justify-center mt-2">
          <View
            style={{ marginRight: 14 }}
            className="w-12 h-12 rounded-lg bg-white justify-center items-center">
            <GoogleSignUpButton/>
          </View>
          
          <Button className="w-12 h-12 rounded-lg bg-white justify-center items-center shadow-md">
            <Image
              source={require("../assets/images/facebook.png")}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          </Button>
        </View>
      </Card>
    </SafeAreaView>
  );
}
