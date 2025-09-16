import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import CustomInput from "./CustomInput";
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.API_URL;

const tipos = [
  "Split", "Rooftop", "Centrales", "Cassette",
  "Camara Frigorifica", "Heladera Residencial", "Freezer", "Exhibidoras", "Heladeras Comercial"
];

const requiereUnidad = ["Split", "Rooftop", "Centrales", "Cassette"];

export default function TipoEquipoScreen({ clientId, onContinue, onCancel }) {
  const [tipo, setTipo] = useState("");
  const [unidad, setUnidad] = useState("");

  const handleContinue = async (tipo, unidad) => {
    try {
      const typeEquipMap = {
        "Split": 1,
        "Rooftop": 2,
        "Centrales": 3,
        "Cassette": 4,
        "Camara Frigorifica": 5,
        "Heladera Residencial": 6,
        "Freezer": 7,
        "Exhibidoras": 8,
        "Heladeras Comercial": 9
      };

      const typeEquipId = typeEquipMap[tipo];

      const response = await fetch(
        `${API_URL}/equipmentsController.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "addEquipment",
            client_id: clientId,
            type_equip_id: typeEquipId,
            unidad: unidad
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        console.log("Equipo creado con id:", data.equipment_id, "y code:", data.code);

        onContinue(tipo, unidad, data.code, data.equipment_id);
      } else {
        console.error("Error al agregar equipo:", data.error);
      }

    } catch (error) {
      console.error("Error en fetch:", error);
    }
  };

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
          onPress={() => handleContinue(tipo, unidad)}
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