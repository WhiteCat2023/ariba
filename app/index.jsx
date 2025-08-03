import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { Alert, Image, Platform, SafeAreaView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import "../global.css";
import { signIn } from "../api/controller/auth.controller";



export default function Index() {
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const router = useRouter()
  const { login, session } = useAuth()

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session]);

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

  // useEffect(() => {
  //   GoogleSignIn
  // })

  const handleSubmit = async () => {
    try {
      await login(credentials);
      Alert.alert("You're logged in");
    } catch (error) {
      Alert.alert(`Login failed: ${error.message}`)
    }
  }

  // useEffect(() => {
  //   if (session) {
  //     router.replace("/dashboard");
  //   }
  // }, [session]);


  if (!fontsLoaded) return null;

  const isWeb = Platform.OS === "web";

  // ===== MOBILE VERSION =====
  if (!isWeb) {
    return (
      <SafeAreaView className="flex-1 bg-white px-6 justify-center">
        {/* Title */}
        <Text className="text-[22px] font-bold text-center mb-10">
          Welcome Back!
        </Text>

        {/* Logo */}
        <Text className="text-green-600 text-8xl text-center font-[Pacifico] ">
          Ariba
        </Text>
        <Text className="text-black text-[16px] text-base text-center mb-12 font-[Roboto]">
          Locate - Report- Connect
        </Text>

        {/* Social buttons */}
        <View className="flex-row justify-center mb-6 space-x-6">
          <Button
            onPress={() => {}}
            style={{ marginRight: 20 }} // Add spacing here
            className="w-12 h-12 rounded-lg bg-white justify-center items-center shadow-md"
          >
            <Image
              source={require("../assets/images/google.png")}
              style={{ width: 18, height: 18 }}
              resizeMode="contain"
            />
          </Button>

          <Button
            onPress={() => {}}
            className="w-12 h-12 rounded-lg bg-white justify-center items-center shadow-md"
          >
            <Image
              source={require("../assets/images/facebook.png")}
              style={{ width: 18, height: 18 }}
              resizeMode="contain"
            />
          </Button>
        </View>

        {/* Username */}
        <Input
          placeholder="Username"
          value={credentials.email}
          onChangeText={(text) => handleChange("email", text)}
          leftIconName="user"
          className="w-full mb-4 border border-green-500 rounded-lg"
        />

        {/* Password */}
        <Input
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={credentials.password}
          onChangeText={(text) => handleChange("password", text)}
          leftIconName="key"
          icon={showPassword ? "eye-off" : "eye"}
          onIconPress={() => setShowPassword(!showPassword)}
          className="w-full mb-2 border border-green-500 rounded-lg"
        />

        {/* Forget Password text */}
        <Text
          className="text-right text-xs text-black mb-14 -mt-12"
          onPress={() => router.push("/forgot-password")}
        >
        Forget Password?
      </Text>

        {/* Login button */}
        <Button
          title="Login"
          onPress={handleSubmit}
          className="bg-green-500 w-full py-3 rounded-lg"
          textStyle={{ color: "white", fontWeight: "bold" }}
          style={{ backgroundColor: "#34A853" }}
        />

        {/* Divider */}
        <View className="flex-row items-center mb-16">
          <View className="flex-1 h-px bg-black mx-2" />
          <Text className="text-xs text-black">Don’t have an account?</Text>
          <View className="flex-1 h-px bg-black mx-2" />
        </View>

        {/* Sign up button */}
        <Button
          title="Sign up"
          onPress={() => router.push("/signup")}
          className="bg-orange-400 w-full py-3 rounded-lg"
          textStyle={{ color: "white", fontWeight: "bold" }}
          style={{ backgroundColor: "#FF7A00" }}
        />
      </SafeAreaView>
    );
  }

  // ===== WEB VERSION (UNCHANGED) =====
  return (
    <SafeAreaView className="flex-1 flex-row bg-white">
      {/* Left Side */}
      <View className="flex-1 mt-20 justify-center items-center">
        <View className="items-center">
          <Text className="text-green-600 text-[75px] mb-[-30px] font-[Pacifico]">
            Ariba
          </Text>
          <Text className="text-black text-lg font-[Roboto]">
            Locate - Report - Connect
          </Text>
          <Image
            source={require("../assets/images/ariba-illustration.png")}
            className="w-[650px] h-[650px]"
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Right Side */}
      <View className="flex-1 justify-center items-center">
        <Card className="w-[90%] max-w-md">
          <Text className="text-green-600 text-lg font-semibold text-center mb-5">
            Greetings!{"\n"}Welcome Back
          </Text>

          <View className="flex-row justify-center mb-5 space-x-4">
            <Button
              onPress={() => {}}
              style={{ marginRight: 14 }} // Add spacing here
              className="w-12 h-12 rounded-lg bg-white justify-center items-center shadow-md"
            >
              <Image
                source={require("../assets/images/google.png")}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
            </Button>
            <Button
              onPress={() => {}}
              className="w-12 h-12 rounded-lg bg-white justify-center items-center shadow-md"
            >
              <Image
                source={require("../assets/images/facebook.png")}
                className="w-6 h-6"
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
            </Button>
          </View>

          <Input
            placeholder="Username"
            value={credentials.email}
            onChangeText={(text) => handleChange("email", text)}
            leftIconName="user"
            className="mb-4 border-0 outline-none"
          />

          <Input
            placeholder="Password"
            value={credentials.password}
            onChangeText={(text) => handleChange("password", text)}
            secureTextEntry={!showPassword}
            icon={showPassword ? "eye-off" : "eye"}
            onIconPress={() => setShowPassword(!showPassword)}
            leftIconName="key"
            className="mb-4"
          />

          <Text
          onPress={() => router.push("/forgot-password")}
          className="text-right text-xs text-black 	text-decoration: underline mb-6 -mt-3 font-bold">
            Forgot Password?
          </Text>

          <Button
            title="Login"
            onPress={handleSubmit}
            className="w-full py-3 rounded-lg mb-4"
            textStyle={{ color: "white" }}
            style={{ backgroundColor: "#34A853" }}
          />

          <View className="flex-row items-center my-5">
            <View className="flex-1 h-px bg-black mx-2" />
            <Text className="text-center font-bold text-black text-xs">
              Don’t have an account?
            </Text>
            <View className="flex-1 h-px bg-black mx-2" />
          </View>

          <Button
            title="Sign up"
            onPress={() => router.push("/signup")}
            className="w-full py-3 rounded-lg mb-4"
            textStyle={{ color: "white" }}
            style={{ backgroundColor: "#FF7A00" }}
          />
        </Card>
      </View>
    </SafeAreaView>
  );
}
