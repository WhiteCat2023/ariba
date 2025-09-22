import { signUp } from "@/api/controller/auth.controller";
import Button from "@/components/button/Button";
import { FacebookSignInButton } from "@/components/button/facebookAuthButton";
import { GoogleSignUpButton } from "@/components/button/googleAuthButtons";
import Card from "@/components/cards/Card";
import Input from "@/components/inputs/Input";
import { Role } from "@/enums/roles";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import "../global.css";

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

  const [showErrors, setShowErrors] = useState(false);

  const handleChange = (field, value) => {
    setCredentials((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setShowErrors(true); // force error display
    if (
      !credentials.firstName ||
      !credentials.lastName ||
      !credentials.email ||
      credentials.password !== credentials.confirmPassword
    ) {
      Alert.alert("Please fix the errors before submitting.");
      return;
    }
    await signUp(credentials);
    Alert.alert("Account created successfully");
  };

  if (!fontsLoaded) return;

  const isWeb = Platform.OS === "web";

  // 📱 Mobile layout
  if (!isWeb) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center px-6">
            {/* Logo */}
            <View className="items-center mb-6">
              <Image
                source={require("../assets/images/signup_logo.png")} // replace with your green logo
                style={{ width: 120, height: 120, resizeMode: "contain" }}
              />
            </View>

            {/* Greeting */}
            <Text className="text-[18px] text-green-600 font-bold text-center mb-8">
              Welcome Let’s Get you Started!
            </Text>

            {/* Input fields */}
            <Input
              placeholder="First Name"
              value={credentials.firstName}
              onChangeText={(t) => handleChange("firstName", t)}
              leftIconName="user"
              showErrors={showErrors}
            />

            <Input
              placeholder="Last Name"
              value={credentials.lastName}
              onChangeText={(t) => handleChange("lastName", t)}
              leftIconName="user"
              showErrors={showErrors}
            />

            <Input
              placeholder="Email"
              value={credentials.email}
              onChangeText={(t) => handleChange("email", t)}
              leftIconName="mail"
              showErrors={showErrors}
            />

            <Input
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={credentials.password}
              onChangeText={(t) => handleChange("password", t)}
              leftIconName="key"
              icon={showPassword ? "eye-off" : "eye"}
              onIconPress={() => setShowPassword(!showPassword)}
              type="password"
              showErrors={showErrors}
            />

            <Input
              placeholder="Confirm Password"
              secureTextEntry={!showConfirmPassword}
              value={credentials.confirmPassword}
              onChangeText={(t) => handleChange("confirmPassword", t)}
              leftIconName="check"
              icon={showConfirmPassword ? "eye-off" : "eye"}
              onIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
              type="confirmPassword"
              compareWith={credentials.password}
              showErrors={showErrors}
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
            <View className="flex-row justify-center space-x-6">
              <GoogleSignUpButton />
              <FacebookSignInButton />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // 💻 Web layout
  return (
    <SafeAreaView className="flex-1 flex-row bg-white">
      {/* Form Section */}
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
            placeholder="First Name"
            value={credentials.firstName}
            onChangeText={(t) => handleChange("firstName", t)}
            leftIconName="user"
            showErrors={showErrors}
          />

          <Input
            placeholder="Last Name"
            value={credentials.lastName}
            onChangeText={(t) => handleChange("lastName", t)}
            leftIconName="user"
            showErrors={showErrors}
          />

          <Input
            placeholder="Email"
            value={credentials.email}
            onChangeText={(t) => handleChange("email", t)}
            leftIconName="mail"
            showErrors={showErrors}
          />

          <Input
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={credentials.password}
            onChangeText={(t) => handleChange("password", t)}
            leftIconName="key"
            icon={showPassword ? "eye-off" : "eye"}
            onIconPress={() => setShowPassword(!showPassword)}
            type="password"
            showErrors={showErrors}
          />

          <Input
            placeholder="Confirm Password"
            secureTextEntry={!showConfirmPassword}
            value={credentials.confirmPassword}
            onChangeText={(t) => handleChange("confirmPassword", t)}
            leftIconName="check"
            icon={showConfirmPassword ? "eye-off" : "eye"}
            onIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
            type="confirmPassword"
            compareWith={credentials.password}
            showErrors={showErrors}
          />

          <Button
            title="Sign Up"
            onPress={handleSubmit}
            className="w-full py-3 rounded-lg mb-4"
            textStyle={{ color: "white" }}
            style={{ backgroundColor: "#FF7A00" }}
          />

          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-black" />
            <Text className="mx-2 text-gray-600 mb-1">or</Text>
            <View className="flex-1 h-px bg-black" />
          </View>

          <View className="flex-row justify-center space-x-4">
            <GoogleSignUpButton />
            <FacebookSignInButton />
          </View>

          <Text className="w-full text-center mt-4">
            Already have an account?{" "}
            <Text
              onPress={() => router.replace("/")}
              className="font-semibold underline"
            >
              Sign In
            </Text>
          </Text>
        </Card>
      </View>

      {/* Illustration */}
      <View className="flex-1 relative">
        <View className="absolute top-[-10px] left-[-90px]">
          <Text className="text-green-600 text-[80px] font-[Pacifico]">
            Ariba
          </Text>
          <Text className="text-black text-[20px] font-[Roboto] mt-[-30px] ml-[-13px]">
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
