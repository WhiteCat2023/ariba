
import { useState } from "react";
import { View, Text, Image, StyleSheet, Platform } from "react-native";
import { useFonts } from "expo-font";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";

export default function Index() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [fontsLoaded] = useFonts({
  Pacifico: require("../assets/fonts/Pacifico-Regular.ttf"),
  SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  Roboto: require("../assets/fonts/Roboto-Bold.ttf")
});

  if (!fontsLoaded) {
    return null; // Show a loading state if fonts aren't ready
  }

  const isWeb = Platform.OS === "web";

  // --- MOBILE LAYOUT ---
  if (!isWeb) {
    return (
      <View style={stylesMobile.container}>
        <Text style={stylesMobile.welcome}>Welcome Back!</Text>

        <Text style={[stylesMobile.logo, { fontFamily: "Pacifico" }]}>
            Ariba
        </Text>
        <Text style={[stylesMobile.tagline, {fontFamily: "Roboto"}]  }>Locate - Report- Connect</Text>

        {/* Social Buttons */}
        <View style={stylesMobile.socialRow}>
          <Button onPress={() => {}} style={stylesMobile.socialButton}>
            <Image
              source={require("../assets/images/google.png")}
              style={stylesMobile.socialIcon}
            />
          </Button>

          <Button onPress={() => {}} style={stylesMobile.socialButton}>
            <Image
              source={require("../assets/images/facebook.png")}
              style={stylesMobile.socialIcon}
            />
          </Button>
        </View>

       <Input
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          leftIconName="user"
          style={stylesMobile.input}
        />

        <Input
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          leftIconName="key"
          icon={showPassword ? "eye-off" : "eye"}
          onIconPress={() => setShowPassword(!showPassword)}
          style={stylesMobile.input}
        />

        <Text style={stylesMobile.forgot}>Forget Password?</Text>

        <Button
          title="Login"
          onPress={() => {}}
          style={stylesMobile.loginButton}
          textStyle={{ color: "white" }}
        />

        <View style={stylesMobile.dividerContainer}>
          <View style={stylesMobile.divider} />
          <Text style={stylesMobile.dividerText}>Don’t have an account?</Text>
          <View style={stylesMobile.divider} />
        </View>

        <Button
          title="Sign up"
          onPress={() => {}}
          style={stylesMobile.signupButton}
          textStyle={{ color: "white" }}
        />
      </View>
    );
  }

  // --- WEB LAYOUT ---
  return (
    <View style={styles.container}>
      {/* Left Illustration */}
      <View style={styles.leftContainer}>
        <View style={styles.centered}>
          <Text style={[styles.logo, { fontFamily: "Pacifico" }]}>
            Ariba
          </Text>
          <Text style={[styles.tagline, {fontFamily: "Roboto"}]  }>Locate - Report- Connect</Text>
          <Image
            source={require("../assets/images/ariba-illustration.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Right Login Card */}
      <View style={styles.rightContainer}>
        <Card>
          <Text style={styles.welcomeText}>
            Greetings!{"\n"}Welcome Back
          </Text>

          {/* Social Buttons */}
          <View style={styles.socialRow}>
            <Button onPress={() => {}} style={styles.socialButton}>
              <Image
                source={require("../assets/images/google.png")}
                style={styles.socialIcon}
              />
            </Button>

            <Button onPress={() => {}} style={styles.socialButton}>
              <Image
                source={require("../assets/images/facebook.png")}
                style={styles.socialIcon}
              />
            </Button>
          </View>

          {/* Username */}
          <Input
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              leftIconName="user"
          />

          {/* Password */}
          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            icon={showPassword ? "eye-off" : "eye"}
            onIconPress={() => setShowPassword(!showPassword)}
            leftIconName="key"
          />

          {/* Forgot Password */}
          <Text style={styles.forgotPassword}>Forgot Password?</Text>

          {/* Login Button */}
          <Button
            title="Login"
            onPress={() => {}}
            style={{ backgroundColor: "#22c55e", marginBottom: 16 }}
            textStyle={{ color: "white" }}
          />

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.signupPrompt}>Don’t have an account?</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Sign up Button */}
          <Button
            title="Sign up"
            onPress={() => {}}
            style={{ backgroundColor: "#fb923c" }}
            textStyle={{ color: "white" }}
          />
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
