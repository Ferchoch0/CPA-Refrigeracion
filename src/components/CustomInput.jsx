import React from "react";
import { View, TextInput, StyleSheet, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker"; // si usás Expo

export default function CustomInput({
  value,
  onChangeText,
  placeholder,
  multiline = false,
  type = "text", // "text", "picker", "number", "file"
  items = [],
  ...props
}) {
  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // acepta cualquier tipo, podés filtrar ej: "image/*" o "application/pdf"
      });
      if (result.type === "success") {
        onChangeText(result.uri); // guarda la URI del archivo
      }
    } catch (error) {
      console.error("Error al seleccionar archivo:", error);
    }
  };

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
      ) : type === "file" ? (
        <>
          <Button title={placeholder || "Seleccionar archivo"} onPress={handlePickFile} />
          {value ? <TextInput value={value} editable={false} style={styles.input} /> : null}
        </>
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
          keyboardType={type === "number" ? "numeric" : "default"} // 👈 soporte numérico
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
