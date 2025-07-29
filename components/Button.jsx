import React from "react";
import { TouchableOpacity, Text, StyleSheet, Platform } from "react-native";

export default function Button({ title, onPress, style, textStyle, children }) {
  const isWeb = Platform.OS === "web";
  const currentStyles = isWeb ? stylesWeb : stylesMobile;

  return (
    <TouchableOpacity style={[currentStyles.button, style]} onPress={onPress}>
      {children ? (
        children
      ) : (
        <Text style={[currentStyles.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const baseStyles = {
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
};

const stylesWeb = StyleSheet.create({
  ...baseStyles,
  button: {
    ...baseStyles.button,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

const stylesMobile = StyleSheet.create({
  ...baseStyles,
  button: {
    ...baseStyles.button,
    bottom: 30,
    paddingHorizontal: 12,
    paddingVertical: 14, // slightly bigger tap target
  },
});
