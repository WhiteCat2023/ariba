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
  icon,
  onIconPress,
  leftIconName,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const isWeb = Platform.OS === "web";

  const currentStyles = isWeb ? stylesWeb : stylesMobile;

  return (
    <View
      style={[
        currentStyles.inputContainer,
        isFocused && currentStyles.focusedBorder,
      ]}
    >
      {leftIconName && (
        <Feather
          name={leftIconName}
          size={20}
          color="#4b5563"
          style={currentStyles.leftIcon}
        />
      )}

      <TextInput
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={currentStyles.input}
        placeholderTextColor="#111827"
      />

      {icon && (
        <TouchableOpacity onPress={onIconPress}>
          <Ionicons name={icon} size={20} color="#4b5563" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const baseStyles = {
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#22c55e",
    borderRadius: 8,
    backgroundColor: "white",
  },
  focusedBorder: {
    borderColor: "#16a34a",
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
};

// Web-specific styles
const stylesWeb = StyleSheet.create({
  ...baseStyles,
  inputContainer: {
    ...baseStyles.inputContainer,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 16,
  },
});

// Mobile-specific styles
const stylesMobile = StyleSheet.create({
  ...baseStyles,
  inputContainer: {
    ...baseStyles.inputContainer,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    bottom: 30
  },
});

export default Input;
