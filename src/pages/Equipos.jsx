// src/pages/Equipos.jsx
import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const equiposData = [
  { id: "1", nombre: "Refrigerador 1", codigo: "RF-1001", estado: "Activo" },
  { id: "2", nombre: "Refrigerador 2", codigo: "RF-1002", estado: "Activo: Requiere revisión" },
  { id: "3", nombre: "Refrigerador 3", codigo: "RF-1003", estado: "Inactivo" },
  { id: "4", nombre: "Refrigerador 4", codigo: "RF-1004", estado: "Dado de baja" },
];

export default function EquiposScreen() {
  const [search, setSearch] = useState("");
  const [equipos, setEquipos] = useState(equiposData);

  const handleSearch = (text) => {
    setSearch(text);
    if (text.trim() === "") {
      setEquipos(equiposData);
    } else {
      const filtered = equiposData.filter((eq) =>
        eq.nombre.toLowerCase().includes(text.toLowerCase())
      );
      setEquipos(filtered);
    }
  };

  const getEstadoStyle = (estado) => {
    switch (estado) {
      case "Activo":
        return styles.activo;
      case "Activo: Requiere revisión":
        return styles.revision;
      case "Inactivo":
        return styles.inactivo;
      case "Dado de baja":
        return styles.baja;
      default:
        return {};
    }
  };

  const renderEquipo = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardContent}>
        <View style={{ flex: 1 }}>
          <Text style={styles.nombre}>{item.nombre}</Text>
          <Text style={styles.codigo}>{item.codigo}</Text>
        </View>
        <Text style={[styles.estado, getEstadoStyle(item.estado)]}>
          {item.estado}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Cliente registrado,{"\n"}ahora gestiona sus equipos</Text>
      </View>

      {/* Buscador */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar equipo..."
          value={search}
          onChangeText={handleSearch}
        />
      </View>

      {/* Lista de equipos */}
      <FlatList
        data={equipos}
        keyExtractor={(item) => item.id}
        renderItem={renderEquipo}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Botón agregar */}
      <View style={styles.addContainer}>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.addText}>Agregar equipo</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },

  header: { marginBottom: 20 },
  headerText: { fontSize: 18, fontWeight: "bold", color: "#003366" },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  searchInput: { flex: 1, height: 50, marginLeft: 8, fontSize: 14, color: "#333" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  cardContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  nombre: { fontSize: 16, fontWeight: "bold", color: "#1C3F6E" },
  codigo: { fontSize: 13, color: "#666", marginTop: 2 },
  estado: { fontSize: 13, fontWeight: "bold" },
  activo: { color: "green" },
  revision: { color: "orange" },
  inactivo: { color: "red" },
  baja: { color: "#222" },

  addContainer: { alignItems: "center", marginTop: 20 },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#0366c9ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  addText: { fontSize: 14, color: "#333" },
});
