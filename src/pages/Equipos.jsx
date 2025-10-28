// src/pages/Equipos.jsx
import React, { useState, useEffect } from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from 'expo-constants';
import Toast from "react-native-toast-message";


const API_URL = Constants.expoConfig.extra.API_URL;

export default function EquiposScreen({ route, navigation: propNavigation }) {
  const { clientId, clientName } = route.params; // Añadir clientName a los parámetros
  const navigation = useNavigation();
  const [search, setSearch] = useState("");
  const [equipos, setEquipos] = useState([]);
  const [filteredEquipos, setFilteredEquipos] = useState([]); // lista filtrada
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [modalVisible, setModalVisible] = useState(false);
  // Estado para cambiar estado de equipo
  const [modalUnidadVisible, setModalUnidadVisible] = useState(false);
  const [modalEstadoVisible, setModalEstadoVisible] = useState(false);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState("");
  // Estados posibles
  const estadosDisponibles = [
    {
      label: "Activo",
      color: "#2ecc40",
      textColor: "#fff"
    },
    {
      label: "Activo: Requiere revisión",
      color: "#ffb300",
      textColor: "#fff"
    },
    {
      label: "Inactivo",
      color: "#e74c3c",
      textColor: "#fff"
    },
    {
      label: "Dado de baja",
      color: "#222",
      textColor: "#fff"
    },
  ];

  // Cambiar estado del equipo
  const cambiarEstadoEquipo = async () => {
    if (!equipoSeleccionado) return;
    try {
      console.log("Datos enviados:", {
        equipment_id: equipoSeleccionado.equipment_id,
        status: nuevoEstado,
      });

      const response = await fetch(`${API_URL}/equipmentsController.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateEquipmentStatus",
          equipment_id: equipoSeleccionado.equipment_id,
          status: nuevoEstado,
        }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchEquipos();
        setModalEstadoVisible(false);

        Toast.show({
          type: "success",
          text1: "Estado actualizado",
          text2: `El equipo ahora está en estado: ${nuevoEstado}`,
          position: "bottom",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: data.error || "No se pudo cambiar el estado",
          position: "bottom",
        });
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error de red",
        text2: "No se pudo conectar al servidor",
      });
    }
  };

  const [loading, setLoading] = useState(true);

  const fetchEquipos = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/equipmentsController.php?action=getEquipmentsByClient&client_id=${clientId}`
      );
      const data = await response.json();

      if (!data.error) {
        const agrupados = agruparEquipos(data);
        setEquipos(agrupados);
        setFilteredEquipos(agrupados);
      } else if (data.error) {
        console.error("Error:", data.error);
        setEquipos([]);
        setFilteredEquipos([]);
      } else {
        setEquipos(data);
        setFilteredEquipos(data);
      }
    } catch (err) {
      console.error("Error de red:", err);
    } finally {
      setLoading(false);
    }
  };

  const agruparEquipos = (equipos) => {
    const mapa = {};

    equipos.forEach(eq => {
      const key = eq.code; // mismo código = mismo equipo físico
      if (!mapa[key]) {
        mapa[key] = { ...eq, unidades: [] };
      }
      mapa[key].unidades.push(eq);
    });

    return Object.values(mapa);
  };

  useEffect(() => {
    fetchEquipos();
  }, []);

  const handleSearch = (text, estado = estadoFiltro) => {
    setSearch(text);
    let filtered = [...equipos];

    if (estado !== "Todos") {
      filtered = filtered.filter((eq) => eq.status === estado);
    }
    if (text.trim() !== "") {
      filtered = filtered.filter((eq) =>
        eq.name.toLowerCase().includes(text.toLowerCase())
      );
    }
    setFilteredEquipos(filtered);
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

  const getTotales = () => {
    const total = equipos.length;
    const activos = equipos.filter((e) => e.status === "Activo").length;
    const revision = equipos.filter(
      (e) => e.status === "Activo: Requiere revisión"
    ).length;
    const inactivos = equipos.filter((e) => e.status === "Inactivo").length;
    const baja = equipos.filter((e) => e.status === "Dado de baja").length;
    return { total, activos, revision, inactivos, baja };
  };

  const totales = getTotales();

  const renderEquipo = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        if (item.unidades.length > 1) {
          // abre modal de selección
          setEquipoSeleccionado(item);
          setModalUnidadVisible(true);
        } else {
          // entra directo
          const unica = item.unidades[0];
          navigation.navigate("FormGeneral", {
            equipmentId: unica.equipment_id,
            typeEquipId: unica.type_equip_id,
            code: unica.code,
            name: unica.name,
          });
        }
      }}
      onLongPress={() => {
        setEquipoSeleccionado(item);
        setNuevoEstado(item.status);
        setModalEstadoVisible(true);
      }}
      activeOpacity={0.85}
    >
      <View style={[styles.cardColor, getEstadoStyle(item.status)]} />
      <View style={styles.cardContent}>
        <View style={{ flex: 1 }}>
          <Text style={styles.nombre}>{item.name}</Text>
          <Text style={styles.codigo}>{item.code}</Text>
          <View style={styles.estadoRow}>
            <View style={[styles.estadoDot, getEstadoStyle(item.status)]} />
            <Text style={styles.estado}>{item.status}</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={22} color="#b0b0b0" />
      </View>
    </TouchableOpacity>
  );

  // Recibe los datos seleccionados del modal y navega al formulario
  const handleContinue = async () => {
    setModalVisible(false);
    await fetchEquipos(); // solo refresca lista
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={{flex: 1}}>
            <Text style={styles.headerTitle}>Equipos</Text>
            <Text style={styles.headerSubtitle}>
              Cliente: {route.params.clientName}
            </Text>
          </View>
          <Image
            source={require("../../assets/logo2.png")}
            style={styles.logoImg}
          />
        </View>
      </View>
      
      {/* Cuerpo */}
      <View style={styles.bodyContainer}>
        {/* Barra de totales con filtro por estado */}
        <View style={styles.totalsBar}>
          <TouchableOpacity
            style={styles.totalBox}
            onPress={() => handleFiltrarEstado("Todos")}
          >
            <Text style={styles.totalNumber}>{totales.total}</Text>
            <Text
              style={[
                styles.totalLabel,
                estadoFiltro === "Todos" && {
                  color: "#0366c9ff",
                  fontWeight: "bold",
                },
              ]}
            >
              Total
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.totalBox}
            onPress={() => handleFiltrarEstado("Activo")}
          >
            <Text style={[styles.totalNumber, { color: "#2ecc40" }]}>
              {totales.activos}
            </Text>
            <Text
              style={[
                styles.totalLabel,
                estadoFiltro === "Activo" && {
                  color: "#2ecc40",
                  fontWeight: "bold",
                },
              ]}
            >
              Activo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.totalBox}
            onPress={() => handleFiltrarEstado("Activo: Requiere revisión")}
          >
            <Text style={[styles.totalNumber, { color: "#ffb300" }]}>
              {totales.revision}
            </Text>
            <Text
              style={[
                styles.totalLabel,
                estadoFiltro === "Activo: Requiere revisión" && {
                  color: "#ffb300",
                  fontWeight: "bold",
                },
              ]}
            >
              Revisión
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.totalBox}
            onPress={() => handleFiltrarEstado("Inactivo")}
          >
            <Text style={[styles.totalNumber, { color: "#e74c3c" }]}>
              {totales.inactivos}
            </Text>
            <Text
              style={[
                styles.totalLabel,
                estadoFiltro === "Inactivo" && {
                  color: "#e74c3c",
                  fontWeight: "bold",
                },
              ]}
            >
              Inactivo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.totalBox}
            onPress={() => handleFiltrarEstado("Dado de baja")}
          >
            <Text style={[styles.totalNumber, { color: "#222" }]}>
              {totales.baja}
            </Text>
            <Text
              style={[
                styles.totalLabel,
                estadoFiltro === "Dado de baja" && {
                  color: "#222",
                  fontWeight: "bold",
                },
              ]}
            >
              Baja
            </Text>
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
          data={filteredEquipos}
          keyExtractor={(item) => item.equipment_id.toString()}
          renderItem={renderEquipo}
          ListEmptyComponent={
            !loading && (
              <View style={styles.emptyBox}>
                <Ionicons name="cube-outline" size={48} color="#b0b0b0" />
                <Text style={styles.emptyText}>No hay equipos para mostrar</Text>
              </View>
            )
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
            clientId={clientId}
            onContinue={handleContinue}
            onCancel={() => setModalVisible(false)}
          />
        </Modal>

        {/* Modal para seleccionar entre exterior e interior */}
        <Modal
          visible={modalUnidadVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalUnidadVisible(false)}
        >
          <View style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.3)",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <View style={{
              backgroundColor: "#fff",
              borderRadius: 20,
              padding: 20,
              width: 300,
              alignItems: "center"
            }}>
              <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15 }}>
                Seleccionar unidad
              </Text>
              {equipoSeleccionado?.unidades.map((unidad) => (
                <TouchableOpacity
                  key={unidad.equipment_id}
                  style={{
                    padding: 12,
                    marginVertical: 6,
                    width: "100%",
                    backgroundColor: "#f1f1f1",
                    borderRadius: 10,
                    alignItems: "center"
                  }}
                  onPress={() => {
                    setModalUnidadVisible(false);
                    navigation.navigate("FormGeneral", {
                      equipmentId: unidad.equipment_id,
                      typeEquipId: unidad.type_equip_id,
                      code: unidad.code,
                      name: unidad.name,
                      placement: unidad.placement ?? null,
                    });
                  }}
                >
                  <Text style={{ fontSize: 16 }}>
                    {unidad.placement
                      ? unidad.placement.toLowerCase() === "interior"
                        ? "Unidad Interior"
                        : "Unidad Exterior"
                      : "Sin definir"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>

        {/* Modal para cambiar estado de equipo */}
        <Modal
          visible={modalEstadoVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalEstadoVisible(false)}
        >
          <View style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.3)",
            justifyContent: "center",
            alignItems: "center"
          }}>
            <View style={{
              backgroundColor: "#fff",
              borderRadius: 20,
              padding: 28,
              width: 320,
              alignItems: "center",
              shadowColor: "#000",
              shadowOpacity: 0.10,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 8,
              elevation: 8,
            }}>
              <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10, color: "#003366" }}>
                Cambiar estado de equipo
              </Text>
              <View style={{ alignItems: "center", marginBottom: 16 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold", color: "#0366c9ff" }}>
                  {equipoSeleccionado?.name}
                </Text>
                {equipoSeleccionado?.unidad && (
                  <Text style={{ fontSize: 15, color: "#666", marginTop: 2 }}>
                    Unidad: {equipoSeleccionado.unidad}
                  </Text>
                )}
              </View>
              <View style={{ width: "100%", marginBottom: 10 }}>
                {estadosDisponibles.map((estado) => {
                  const seleccionado = nuevoEstado === estado.label;
                  return (
                    <TouchableOpacity
                      key={estado.label}
                      style={{
                        padding: 12,
                        marginVertical: 5,
                        backgroundColor: seleccionado ? estado.color : "#f1f1f1",
                        borderRadius: 10,
                        width: "100%",
                        alignItems: "center",
                        borderWidth: seleccionado ? 2 : 1,
                        borderColor: seleccionado ? "#003366" : "#e0e6ed",
                        flexDirection: "row",
                        justifyContent: "center"
                      }}
                      onPress={() => setNuevoEstado(estado.label)}
                    >
                      <View style={{
                        width: 16,
                        height: 16,
                        borderRadius: 8,
                        backgroundColor: estado.color,
                        marginRight: 10,
                        borderWidth: seleccionado ? 2 : 0,
                        borderColor: seleccionado ? "#fff" : "transparent"
                      }} />
                      <Text style={{
                        color: seleccionado ? estado.textColor : "#333",
                        fontWeight: seleccionado ? "bold" : "normal",
                        fontSize: 15,
                        letterSpacing: 0.5
                      }}>
                        {estado.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <View style={{ flexDirection: "row", marginTop: 18 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#0366c9ff",
                    paddingVertical: 12,
                    paddingHorizontal: 24,
                    borderRadius: 10,
                    marginRight: 10,
                    shadowColor: "#0366c9ff",
                    shadowOpacity: 0.12,
                    shadowOffset: { width: 0, height: 2 },
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                  onPress={cambiarEstadoEquipo}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Guardar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#eee",
                    paddingVertical: 12,
                    paddingHorizontal: 24,
                    borderRadius: 10,
                  }}
                  onPress={() => setModalEstadoVisible(false)}
                >
                  <Text style={{ color: "#333", fontSize: 16 }}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#003366" },

  header: {
    backgroundColor: "#003366",
    paddingLeft: 0,
    paddingBottom: 40,
    paddingTop: 18,
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
  logoImg: {
    width: 60,
    height: 60,
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
