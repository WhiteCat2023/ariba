import { useFonts } from "expo-font";
import { useState } from "react";
import { Alert, Image, Platform, SafeAreaView, Text, View } from "react-native";
import { signIn, signUp } from "../api/controller/auth.controller";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import "../global.css";
import { Role } from "../enums/roles";
import { useRouter } from "expo-router";

export default function Index() {
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    name: "",
    password: ""
  });

  const router = useRouter()
 
  const [fontsLoaded] = useFonts({
    Pacifico: require("../assets/fonts/Pacifico-Regular.ttf"),
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Roboto: require("../assets/fonts/Roboto-Bold.ttf"),
  });

   const handleChange = (field, value) => {
    setCredentials((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit =  async () => {
    await signUp(credentials, Role.USER)
    Alert.alert("Your logged in")
  }

  if (!fontsLoaded) return null;

  const isWeb = Platform.OS === "web";

  if (!isWeb) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-2xl font-bold">Welcome Back!</Text>
        <Text className="text-green-600 text-[64px] text-center font-[Pacifico]">Ariba</Text>
        <Text className="text-base text-black mb-5 -mb-6 font-[Roboto] text-center">Locate - Report - Connect</Text>

        <View className="flex-row mb-6 space-x-4">
          <Button onPress={() => {}} className="w-12 h-12 rounded-lg bg-white justify-center items-center shadow-md">
            <Image 
              source={require("../assets/images/google.png")} 
              style={{ width: 24, height: 24 }}
              resizeMode="contain" />
          </Button>

          <Button onPress={() => {}} className="w-12 h-12 rounded-lg bg-white justify-center items-center shadow-md">
            <Image 
              source={require("../assets/images/facebook.png")} className="w-6 h-6"
              style={{ width: 24, height: 24 }}
              resizeMode="contain" />
          </Button>
        </View>

        <Input
          placeholder="Username"
          value={credentials.name}
          onChangeText={text => handleChange("name", text)}
          leftIconName="user"
          className="w-full mb-4"
        />

        <Input
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={credentials.password}
          onChangeText={text => handleChange("password", text)}
          leftIconName="key"
          icon={showPassword ? "eye-off" : "eye"}
          onIconPress={() => setShowPassword(!showPassword)}
          className="w-full mb-4"
        />

        <Text className="self-end text-xs text-black mb-4 -mb-6">Forget Password?</Text>

        <Button title="Login" onPress={() => {}} className="bg-green-500 w-full py-3 rounded-lg mb-4" textStyle={{ color: "white" }} />

        <View className="flex-row items-center my-4 -mb-6">
          <View className="flex-1 h-px bg-black mx-2" />
          <Text className="text-xs text-black">Don’t have an account?</Text>
          <View className="flex-1 h-px bg-black mx-2" />
        </View>

        <Button title="Sign up" onPress={() => {}} className="bg-orange-400 w-full py-3 rounded-lg" textStyle={{ color: "white" }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 flex-row bg-white" head>
      {/* Left Side */}
      <View className="flex-1 justify-center items-center">
        <View className="items-center">
          <Text className="text-green-600 text-[75px] mt-14 font-[Pacifico]">Ariba</Text>
          <Text className="text-black text-lg mt-8 font-[Roboto]">Locate - Report - Connect</Text>
          <Image source={require("../assets/images/ariba-illustration.png")} className="w-[650px] h-[650px]" resizeMode="contain" />
        </View>
      </View>

      {/* Right Side */}
      <View className="flex-1 justify-center items-center">
        <Card className="w-[90%] max-w-md">
          <Text className="text-green-600 text-lg font-semibold text-center mb-5">
            Greetings!{"\n"}Welcome Back
          </Text>

          <View className="flex-row justify-center mb-5 space-x-4">
            <Button onPress={() => {}} className="w-12 h-12 rounded-lg bg-white justify-center items-center shadow-md">
              <Image 
                source={require("../assets/images/google.png")} 
                style={{ width: 24, height: 24 }}
                resizeMode="contain" />
            </Button>
            <Button onPress={() => {}} className="w-12 h-12 rounded-lg bg-white justify-center items-center shadow-md">
              <Image 
                source={require("../assets/images/facebook.png")} className="w-6 h-6"
                style={{ width: 24, height: 24 }}
                resizeMode="contain"/>
            </Button>
          </View>

          <Input
            placeholder="Username"
            value={credentials.name}
            onChangeText={text => handleChange("name", text)}
            leftIconName="user"
            className="mb-4 border-0 outline-none"
          />

          <Input
            placeholder="Password"
            value={credentials.password}
            onChangeText={text => handleChange("password", text)}
            secureTextEntry={!showPassword}
            icon={showPassword ? "eye-off" : "eye"}
            onIconPress={() => setShowPassword(!showPassword)}
            leftIconName="key"
            className="mb-4"
          />

          <Text className="text-right text-xs text-gray-500 mb-4">Forgot Password?</Text>

          <Button title="Sign Up" onPress={handleSubmit} className="bg-green-500 mb-4" />

          <View className="flex-row items-center my-4">
            <View className="flex-1 h-px bg-black mx-2" />
            <Text className="text-center font-bold text-black">Already have an account?</Text>
            <View className="flex-1 h-px bg-black mx-2" />
          </View>

          <Button title="Log In" onPress={() => router.push("/")} className="bg-orange-400"  />
        </Card>
      </View>
    </SafeAreaView>
  );
}
