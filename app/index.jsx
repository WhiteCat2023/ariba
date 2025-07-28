import React, { useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";

export default function Index() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      {/* Left Illustration */}
      <View style={styles.leftContainer}>
        <View style={styles.centered}>
          <Text style={styles.logo}>Ariba</Text>
          <Text style={styles.tagline}>Locate - Report - Connect</Text>
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
            <Button
              title="G"
              onPress={() => {}}
              style={[styles.socialButton, { borderColor: "#ccc" }]}
              textStyle={{ fontSize: 18, color: "black" }}
            />
            <Button
              title="f"
              onPress={() => {}}
              style={[styles.socialButton, { borderColor: "#ccc" }]}
              textStyle={{ fontSize: 18, color: "#2563eb" }}
            />
          </View>

          {/* Username */}
          <Input
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />

          {/* Password */}
          <Input
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            icon={showPassword ? "eye-off" : "eye"}
            onIconPress={() => setShowPassword(!showPassword)}
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
    color: "#15803d",
    fontSize: 40,
    top: 50,
    fontWeight: "bold",
  },
  tagline: {
    color: "#4b5563",
    top: 50,
    fontSize: 14,
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
    borderWidth: 1,
    justifyContent: "center",
    marginHorizontal: 8,
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
    color: "#000000",
    marginBottom: 8,
  },
});
