import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

const Input = ({
  placeholder,
  secureTextEntry,
  value,
  onChangeText,
  icon,         // right icon (for eye/eye-off)
  onIconPress,
  leftIconName, // NEW: left-side icon (user, key)
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      style={[
        styles.inputContainer,
        isFocused && styles.focusedBorder,
      ]}
    >
      {/* Left icon */}
      {leftIconName && (
        <Feather
          name={leftIconName}
          size={20}
          color="#4b5563"
          style={styles.leftIcon}
        />
      )}

      {/* Text input */}
      <TextInput
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={styles.input}
        placeholderTextColor="#111827"
      />

      {/* Right icon (if any) */}
      {icon && (
        <TouchableOpacity onPress={onIconPress}>
          <Ionicons name={icon} size={20} color="#4b5563" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#22c55e", // green border
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "web" ? 4 : 4,
    marginBottom: 16,
    backgroundColor: "white",
  },
  focusedBorder: {
    borderColor: "#16a34a", // darker green when focused
  },
  leftIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
});

export default Input;
