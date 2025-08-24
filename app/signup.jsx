  import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, Platform, SafeAreaView, Text, View } from "react-native";
import { signUp } from "@/api/controller/auth.controller";
import "../global.css";
import Button from "@/components/button/Button";
import { GoogleSignUpButton } from "@/components/button/googleAuthButtons";
import Card from "@/components/cards/Card";
import Input from "@/components/inputs/Input";
import { Role } from "@/enums/roles";
import { FacebookSignInButton } from "@/components/button/facebookAuthButton";

  export default function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [credentials, setCredentials] = useState({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: Role.USER,
    });

    const router = useRouter();

    const [fontsLoaded] = useFonts({
      Pacifico: require("../assets/fonts/Pacifico-Regular.ttf"),
      Roboto: require("../assets/fonts/Roboto-Bold.ttf"),
    });

    const handleChange = (field, value) => {
      setCredentials((prev) => ({
        ...prev,
        [field]: value,
      }));
    };
    

    const handleSubmit = async () => {
      if (credentials.password !== credentials.confirmPassword) {
        Alert.alert("Passwords do not match");
        return;
      }
      await signUp(credentials);
      Alert.alert("Account created successfully");
    };

    if (!fontsLoaded) return;

    const isWeb = Platform.OS === "web";

    // Mobile layout
  if (!isWeb) {
    return (
      <SafeAreaView className="flex-1 bg-white px-6">
        <View className="flex-1 justify-center">
          {/* Logo */}
          <Text className="text-green-600 text-[64px] text-center font-[Pacifico]">
            Ariba
          </Text>
          <Text className="text-[16px] text-black font-[Roboto] text-center -mt-6">
            Locate - Report- Connect
          </Text>

          {/* Greeting */}
          <Text className="text-[18px] text-green-600 text-lg font-bold text-center mt-4 mb-16">
            Welcome Let’s Get you Started!
          </Text>

          {/* Input fields */}
          <Input
            placeholder="Email"
            value={credentials.email}
            onChangeText={(t) => handleChange("email", t)}
            leftIconName="mail"
            className="w-full mb-4 border border-green-500 rounded-lg"
          />
          <Input
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={credentials.password}
            onChangeText={(t) => handleChange("password", t)}
            leftIconName="key"
            icon={showPassword ? "eye-off" : "eye"}
            onIconPress={() => setShowPassword(!showPassword)}
            className="w-full mb-4 border border-green-500 rounded-lg"
          />
          <Input
            placeholder="Confirm Password"
            secureTextEntry={!showConfirmPassword}
            value={credentials.confirmPassword}
            onChangeText={(t) => handleChange("confirmPassword", t)}
            leftIconName="check"
            icon={showConfirmPassword ? "eye-off" : "eye"}
            onIconPress={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
            className="w-full mb-6 border border-green-500 rounded-lg"
          />

          {/* Confirm button */}
          <Button
            title="Confirm"
            onPress={handleSubmit}
            className="w-full py-3 rounded-lg mb-6"
            textStyle={{ color: "white", fontWeight: "bold" }}
            style={{ backgroundColor: "#FF7A00" }}
          />

          {/* Divider */}
          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-px bg-black" />
            <Text className="mx-2 text-xs text-black">or</Text>
            <View className="flex-1 h-px bg-black" />
          </View>

          {/* Social buttons */}
          <View className="flex-row justify-center space-x-6 mt-8">
            {/* <Button 
            onPress={() => {}}
            style={{ marginRight: 20 }} // Add spacing here
            className="w-12 h-12 rounded-lg bg-white justify-center items-center shadow-md"
            >
              <Image
                source={require("../assets/images/google.png")}
                style={{ width: 18, height: 18 }}
                resizeMode="contain"
              />
            </Button> */}
            <View
              style={{ marginRight: 20 }} // Add spacing here
              className="w-12 h-12 rounded-lg bg-white justify-center items-center shadow-md">
              <GoogleSignUpButton/>
            </View>

            
            <Button className="w-12 h-12 rounded-lg bg-white justify-center items-center shadow-md">
              <Image
                source={require("../assets/images/facebook.png")}
                style={{ width: 18, height: 18 }}
                resizeMode="contain"
              />
            </Button>
          </View>
        </View>
      </SafeAreaView>
    );
  }


    // Web layout
    return (
      <SafeAreaView className="flex-1 flex-row bg-white">
        {/* Form Section (Left) */}
        <View className="flex-1 justify-center items-center z-10 top-3">
          <Card className="w-[90%] max-w-md rounded-2xl shadow-lg p-8">
            <Text className="text-green-600 font-[Pacifico] text-2xl text-center">
              Ariba
            </Text>
            <Text className="text-green-600 text-xl font-bold text-center mt-2">
              Greetings!
            </Text>
            <Text className="text-green-600 text-base text-center mb-6">
              Welcome Let’s set you up first!
            </Text>

          
            <Input
              placeholder="Email"
              value={credentials.email}
              onChangeText={(t) => handleChange("email", t)}
              leftIconName="mail"
              className="mb-4"
            />
            <Input
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={credentials.password}
              onChangeText={(t) => handleChange("password", t)}
              leftIconName="key"
              icon={showPassword ? "eye-off" : "eye"}
              onIconPress={() => setShowPassword(!showPassword)}
              className="mb-4"
            />
            <Input
              placeholder="Confirm Password"
              secureTextEntry={!showConfirmPassword}
              value={credentials.confirmPassword}
              onChangeText={(t) => handleChange("confirmPassword", t)}
              leftIconName="key"
              icon={showConfirmPassword ? "eye-off" : "eye"}
              onIconPress={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="mb-6"
            />

            <Button
              title="Sign Up"
              onPress={handleSubmit}
              className="w-full py-3 rounded-lg mb-4"
              textStyle={{ color: "white" }}
              style={{
                backgroundColor: "#FF7A00",
              }}
            />

            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-black" />
              <Text className="mx-2 text-gray-600 mb-1">or</Text>
              <View className="flex-1 h-px bg-black" />
            </View>

            <View className="flex-row justify-center space-x-4">
              {/* <Button onPress={() => {}} className="w-12 h-12 rounded-lg bg-white justify-center items-center shadow-md">
              <Image 
                source={require("../assets/images/google.png")} 
                style={{ width: 24, height: 24 }}
                resizeMode="contain" />
            </Button> */}
            <GoogleSignUpButton/>
            <FacebookSignInButton/>

              {/* <Button className="w-12 h-12 rounded-lg bg-white justify-center items-center shadow-md">
                <Image
                  source={require("../assets/images/facebook.png")}
                  style={{ width: 24, height: 24 }}
                  resizeMode="contain"
                />
              </Button> */}
            </View>
            <Text
             className="w-full text-center">
              Already have an account?&nbsp; 
              <Text 
                onPress={() => router.replace("/")}
                className="font-semibold text-decoration: underline">Sign In</Text>
            </Text>
          </Card>
        </View>

        {/* Illustration Section (Right) */}
  <View className="flex-1 relative">
    <View className="absolute top-[-10px] left-[-90px]">
      <Text className="text-green-600 text-[80px] font-[Pacifico]">
        Ariba
      </Text>
      <Text className="text-black text-[20px] text-lg font-[Roboto] mt-[-30px] ml-[-13px]">
        Locate - Report - Connect
      </Text>
    </View>

    <View className="flex-1 justify-center items-center">
      <Image
        source={require("../assets/images/signup_illustration.png")}
        className="w-[600px] h-[600px] mt-80 ml-[-470px]"
        resizeMode="contain"
      />
    </View>
  </View>
      </SafeAreaView>
    );
  }
