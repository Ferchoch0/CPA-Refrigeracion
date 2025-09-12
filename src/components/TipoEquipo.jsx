import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import CustomInput from "./CustomInput";

const tipos = [
  "Split", "Rooftop", "Centrales", "Cassette",
  "Camara Frigorifica", "Heladera Residencial", "Freezer", "Exhibidoras", "Heladeras Comercial"
];

const requiereUnidad = ["Split", "Rooftop", "Centrales", "Cassette"];

export default function TipoEquipoScreen({ onContinue, onCancel }) {
  const [tipo, setTipo] = useState("");
  const [unidad, setUnidad] = useState("");

  return (
    <View style={styles.modalBackground}>
      <View style={styles.modalContainer}>
        <Text style={styles.label}>Tipo de refrigerador:</Text>
        <CustomInput
          type="picker"
          value={tipo}
          onChangeText={setTipo}
          items={tipos}
          placeholder="Seleccionar..."
        />

        {requiereUnidad.includes(tipo) && (
          <>
            <Text style={styles.label}>Unidad:</Text>
            <CustomInput
              type="picker"
              value={unidad}
              onChangeText={setUnidad}
              items={[
                { label: "Unidad exterior", value: "exterior" },
                { label: "Unidad interior", value: "interior" }
              ]}
              placeholder="Seleccionar..."
            />
          </>
        )}

        <TouchableOpacity
          style={styles.button}
          disabled={!tipo || (requiereUnidad.includes(tipo) && !unidad)}
          onPress={() => onContinue(tipo, unidad)}
        >
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
        >
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 24,
    elevation: 8,
  },
  label: { fontSize: 16, marginBottom: 8, fontWeight: "bold", color: "#003366" },
  button: {
    backgroundColor: "#003366",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    opacity: 1,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  cancelButton: {
    marginTop: 12,
    alignItems: "center",
  },
  cancelText: {
    color: "#003366",
    fontWeight: "bold",
    fontSize: 15,
  },
});