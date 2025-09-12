// src/pages/Equipos.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Platform,
  Image,
  Modal,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import TipoEquipoScreen from "../components/TipoEquipo";

const equiposData = [
  { id: "1", nombre: "Refrigerador 1", codigo: "RF-1001", estado: "Activo" },
  { id: "2", nombre: "Refrigerador 2", codigo: "RF-1002", estado: "Activo: Requiere revisión" },
  { id: "3", nombre: "Refrigerador 3", codigo: "RF-1003", estado: "Inactivo" },
  { id: "4", nombre: "Refrigerador 4", codigo: "RF-1004", estado: "Dado de baja" },
];

export default function EquiposScreen({ navigation: propNavigation }) {
  const navigation = useNavigation();
  const [search, setSearch] = useState("");
  const [equipos, setEquipos] = useState(equiposData);
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [modalVisible, setModalVisible] = useState(false);

  const handleSearch = (text, estado = estadoFiltro) => {
    setSearch(text);
    let filtered = equiposData;
    if (estado !== "Todos") {
      filtered = filtered.filter((eq) => eq.estado === estado);
    }
    if (text.trim() !== "") {
      filtered = filtered.filter((eq) =>
        eq.nombre.toLowerCase().includes(text.toLowerCase())
      );
    }
    setEquipos(filtered);
  };

  const handleFiltrarEstado = (estado) => {
    setEstadoFiltro(estado);
    handleSearch(search, estado);
  };

  const getEstadoStyle = (estado) => {
    switch (estado) {
      case "Activo":
        return { backgroundColor: "#2ecc40" };
      case "Activo: Requiere revisión":
        return { backgroundColor: "#ffb300" };
      case "Inactivo":
        return { backgroundColor: "#e74c3c" };
      case "Dado de baja":
        return { backgroundColor: "#222" };
      default:
        return { backgroundColor: "#ccc" };
    }
  };

  const getEstadoTextColor = (estado) => {
    switch (estado) {
      case "Activo":
        return { color: "#2ecc40" };
      case "Activo: Requiere revisión":
        return { color: "#ffb300" };
      case "Inactivo":
        return { color: "#e74c3c" };
      case "Dado de baja":
        return { color: "#222" };
      default:
        return { color: "#666" };
    }
  };

  const getTotales = () => {
    const total = equiposData.length;
    const activos = equiposData.filter(e => e.estado === "Activo").length;
    const revision = equiposData.filter(e => e.estado === "Activo: Requiere revisión").length;
    const inactivos = equiposData.filter(e => e.estado === "Inactivo").length;
    const baja = equiposData.filter(e => e.estado === "Dado de baja").length;
    return { total, activos, revision, inactivos, baja };
  };

  const totales = getTotales();

  const renderEquipo = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("TipoEquipo", { equipo: item })}
      activeOpacity={0.85}
    >
      <View style={[styles.cardColor, getEstadoStyle(item.estado)]} />
      <View style={styles.cardContent}>
        <View style={{ flex: 1 }}>
          <Text style={styles.nombre}>{item.nombre}</Text>
          <Text style={styles.codigo}>{item.codigo}</Text>
          <View style={styles.estadoRow}>
            <View style={[styles.estadoDot, getEstadoStyle(item.estado)]} />
            <Text style={[styles.estado, getEstadoTextColor(item.estado)]}>
              {item.estado}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={22} color="#b0b0b0" />
      </View>
    </TouchableOpacity>
  );

  // Recibe los datos seleccionados del modal y navega al formulario
  const handleContinue = (tipoEquipo, unidad) => {
    setModalVisible(false);
    navigation.navigate("FormGeneral", { tipoEquipo, unidad });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          {/* Botón atrás */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Cliente registrado,</Text>
            <Text style={styles.headerSubtitle}>ahora gestiona sus equipos</Text>
          </View>
          <View style={styles.logoBox}>
            <Image
              source={require("../../assets/logo2.png")}
              style={styles.logoImg}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>
      {/* Cuerpo */}
      <View style={styles.bodyContainer}>
        {/* Barra de totales con filtro por estado */}
        <View style={styles.totalsBar}>
          <TouchableOpacity style={styles.totalBox} onPress={() => handleFiltrarEstado("Todos")}>
            <Text style={styles.totalNumber}>{totales.total}</Text>
            <Text style={[
              styles.totalLabel,
              estadoFiltro === "Todos" && { color: "#0366c9ff", fontWeight: "bold" }
            ]}>Total</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.totalBox} onPress={() => handleFiltrarEstado("Activo")}>
            <Text style={[styles.totalNumber, { color: "#2ecc40" }]}>{totales.activos}</Text>
            <Text style={[
              styles.totalLabel,
              estadoFiltro === "Activo" && { color: "#2ecc40", fontWeight: "bold" }
            ]}>Activo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.totalBox} onPress={() => handleFiltrarEstado("Activo: Requiere revisión")}>
            <Text style={[styles.totalNumber, { color: "#ffb300" }]}>{totales.revision}</Text>
            <Text style={[
              styles.totalLabel,
              estadoFiltro === "Activo: Requiere revisión" && { color: "#ffb300", fontWeight: "bold" }
            ]}>Revisión</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.totalBox} onPress={() => handleFiltrarEstado("Inactivo")}>
            <Text style={[styles.totalNumber, { color: "#e74c3c" }]}>{totales.inactivos}</Text>
            <Text style={[
              styles.totalLabel,
              estadoFiltro === "Inactivo" && { color: "#e74c3c", fontWeight: "bold" }
            ]}>Inactivo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.totalBox} onPress={() => handleFiltrarEstado("Dado de baja")}>
            <Text style={[styles.totalNumber, { color: "#222" }]}>{totales.baja}</Text>
            <Text style={[
              styles.totalLabel,
              estadoFiltro === "Dado de baja" && { color: "#222", fontWeight: "bold" }
            ]}>Baja</Text>
          </TouchableOpacity>
        </View>

        {/* Contenedor de buscador y botón agregar */}
        <View style={styles.searchAddRow}>
          {/* Buscador */}
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar equipo..."
              value={search}
              onChangeText={(text) => handleSearch(text)}
              placeholderTextColor="#b0b0b0"
            />
          </View>
          {/* Botón agregar */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={24} color="#fff" />
            <Text style={styles.addText}>Agregar</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de equipos */}
        <FlatList
          data={equipos}
          keyExtractor={(item) => item.id}
          renderItem={renderEquipo}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="cube-outline" size={48} color="#b0b0b0" />
              <Text style={styles.emptyText}>No hay equipos para mostrar</Text>
            </View>
          }
        />

        {/* Modal de selección de tipo de equipo */}
        <Modal
          visible={modalVisible}
          animationType="fade"
          transparent
          onRequestClose={() => setModalVisible(false)}
        >
          <TipoEquipoScreen
            onContinue={handleContinue}
            onCancel={() => setModalVisible(false)}
          />
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#003366" },

  header: {
    marginBottom: 20,
    backgroundColor: "#003366",
    paddingTop: Platform.OS === "ios" ? 56 : 42,
    paddingLeft: 0,
    paddingBottom: 20,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#e0e6ed",
    fontWeight: "500",
  },
  logoBox: {
    marginLeft: 16,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 4,
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  logoImg: {
    width: 36,
    height: 36,
  },

  bodyContainer: {
    flex: 1,
    backgroundColor: "#fcfcfcff",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: 16,
    marginTop: -24,
  },
  totalsBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
    marginHorizontal: 4,
    backgroundColor: "#f7faff",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 6,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  totalBox: {
    alignItems: "center",
    flex: 1,
  },
  totalNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0366c9ff",
    marginBottom: 2,
  },
  totalLabel: {
    fontSize: 13,
    color: "#666",
    letterSpacing: 0.2,
  },
  searchAddRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 50,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#e0e6ed",
  },
  searchInput: {
    flex: 1,
    height: 50,
    marginLeft: 8,
    fontSize: 15,
    color: "#333",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0366c9ff",
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 44,
    justifyContent: "center",
    shadowColor: "#0366c9ff",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  addText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 6,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    overflow: "hidden",
  },
  cardColor: {
    width: 7,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  cardContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    paddingLeft: 16,
  },
  nombre: { fontSize: 16, fontWeight: "bold", color: "#1C3F6E" },
  codigo: { fontSize: 13, color: "#666", marginTop: 2, marginBottom: 8 },
  estadoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  estadoDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 7,
    marginTop: 1,
  },
  estado: {
    fontSize: 13,
    fontWeight: "bold",
  },
  emptyBox: {
    alignItems: "center",
    marginTop: 60,
    opacity: 0.6,
  },
  emptyText: {
    fontSize: 16,
    color: "#b0b0b0",
    marginTop: 12,
  },
});
