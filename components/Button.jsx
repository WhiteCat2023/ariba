import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const Button = ({ title, onPress, style, textStyle }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  text: {
    fontWeight: "600",
    fontSize: 16,
  },
});

export default Button;
