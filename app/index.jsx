import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { Alert, Image, Platform, SafeAreaView, Text, View } from "react-native";
import { signIn } from "../api/controller/auth.controller";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import "../global.css";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";

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


  const handleSubmit = async () => {
    try {
      await login(credentials);
      Alert.alert("You're logged in");
    } catch (error) {
      Alert.alert(`Login failed: ${error.message}`)
    }
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
          value={credentials.email}
          onChangeText={text => handleChange("email", text)}
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

        <Button title="Login" onPress={handleSubmit} className="bg-green-500 w-full py-3 rounded-lg mb-4" textStyle={{ color: "white" }} />

        <View className="flex-row items-center my-4 -mb-6">
          <View className="flex-1 h-px bg-black mx-2" />
          <Text className="text-xs text-black">Don’t have an account?</Text>
          <View className="flex-1 h-px bg-black mx-2" />
        </View>

        <Button title="Sign up" onPress={() => router.push("/signup")} className="bg-orange-400 w-full py-3 rounded-lg" textStyle={{ color: "white" }} />
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
            value={credentials.email}
            onChangeText={text => handleChange("email", text)}
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

          <Button title="Login" onPress={handleSubmit} className="bg-green-500 mb-4" textStyle={{ color: "white", background: "green" }} />

          <View className="flex-row items-center my-4">
            <View className="flex-1 h-px bg-black mx-2" />
            <Text className="text-center font-bold text-black">Don’t have an account?</Text>
            <View className="flex-1 h-px bg-black mx-2" />
          </View>

          <Button title="Sign up" onPress={() => router.push("/signup")} className="bg-orange-400" textStyle={{ color: "white", background: "green" }} />
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
  },
  leftContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centered: {
    alignItems: "center",
  },
  logo: {
    color: "#34A853",
    fontSize: 75,
    top: 60
  },
  tagline: {
    color: "#000000",
    top: 30,
    fontSize: 18,
  },
  image: {
    width: 650,
    height: 650,
  },
  rightContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    color: "#16a34a",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  socialButton: {
    backgroundColor: "white",
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  socialIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  forgotPassword: {
    textAlign: "right",
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 16,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#000000",
    marginHorizontal: 8,
  },
  signupPrompt: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 8,
  },
});

const stylesMobile = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  welcome: {
    fontSize: 22,
    fontWeight: "bold"
  },
  logo: {
  color: "#34A853",
  fontSize: 80, // make it bigger
  textAlign: "center",
},
  tagline: {
  color: "#000000",
  fontSize: 16,
  marginBottom: 20,
  bottom: 25,
  textAlign: "center",
},
  socialRow: {
    flexDirection: "row",
    marginBottom: 24,
  },
  socialButton: {
    width: 48,
    height: 48,
    marginHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  socialIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  input: {
    width: "100%",
    marginBottom: 16,
  },
  forgot: {
    alignSelf: "flex-end",
    fontSize: 12,
    color: "#000",
    bottom: 35,
    marginBottom: 16,
  },
  loginButton: {
    backgroundColor: "#22c55e",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    bottom: 30,
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#000",
    marginHorizontal: 8,
  },
  dividerText: {
    fontSize: 12,
    color: "#000",
  },
  signupButton: {
    backgroundColor: "#fb923c",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 8,
  },
});
