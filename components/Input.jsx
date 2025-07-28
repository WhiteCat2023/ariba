import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

const Input = ({
  placeholder,
  secureTextEntry,
  value,
  onChangeText,
  icon,
  onIconPress,
}) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
      />
      {icon && (
        <Feather name={icon} size={20} color="gray" onPress={onIconPress} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: "white",
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
});

export default Input;
