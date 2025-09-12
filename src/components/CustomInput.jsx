import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function CustomInput({
  value,
  onChangeText,
  placeholder,
  multiline = false,
  type = "text", // "text" o "picker"
  items = [],
  ...props
}) {
  return (
    <View style={styles.inputBox}>
      {type === "picker" ? (
        <Picker
          selectedValue={value}
          onValueChange={onChangeText}
          style={styles.picker}
          dropdownIconColor="#003366"
          {...props}
        >
          <Picker.Item label={placeholder || "Seleccionar..."} value="" />
          {items.map((item, idx) =>
            typeof item === "string"
              ? <Picker.Item key={item} label={item} value={item} />
              : <Picker.Item key={item.value || idx} label={item.label} value={item.value} />
          )}
        </Picker>
      ) : (
        <TextInput
          style={[
            styles.input,
            multiline && styles.textarea,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          placeholderTextColor="#7a8fa6"
          {...props}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputBox: {
    marginVertical: 10,
    borderRadius: 14,
    backgroundColor: "#eaf2fb",
    borderWidth: 2,
    borderColor: "#003366",
    shadowColor: "#003366",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  input: {
    fontSize: 17,
    color: "#003366",
    padding: 12,
    fontWeight: "500",
    backgroundColor: "#eaf2fb",
    borderRadius: 10,
  },
  textarea: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  picker: {
    color: "#003366",
    fontWeight: "500",
    borderRadius: 10,
    minHeight: 48,
  },
});