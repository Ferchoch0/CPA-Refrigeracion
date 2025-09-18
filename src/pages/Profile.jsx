import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";

const { height } = Dimensions.get("window");

export default function Profile() {
  const [user, setUser] = useState({
    name: "Nombre Técnico",
    dni: "12345678",
    email: "correo@ejemplo.com",
    phone: "+54 11 1234-5678",
    photo: "https://randomuser.me/api/portraits/men/3.jpg",
  });
  const navigation = useNavigation();

  const handleChangePhoto = () => {
    // Aquí iría la lógica para cambiar la foto
    alert("Cambiar foto (no implementado)");
  };

  return (
    <View style={styles.container}>
      {/* Header azul oscuro ocupa la mitad de la pantalla */}
      <View style={styles.header}>
        {/* Contenedor para el botón atrás y el logo */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate("Inicio")}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <View style={styles.logoWrapper}>
            <Image
              source={require("../../assets/logo2.png")}
              style={styles.logoImage}
            />
          </View>
        </View>
        <View style={styles.photoWrapper}>
          <Image source={{ uri: user.photo }} style={styles.photo} />
          <TouchableOpacity style={styles.cameraIcon} onPress={handleChangePhoto}>
            <Ionicons name="camera" size={26} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      {/* Zona blanca con datos */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Información del Técnico</Text>
        <View style={styles.infoRow}>
          <Ionicons name="person" size={22} color="#0366c9ff" style={styles.infoIcon} />
          <View style={styles.infoTextBlock}>
            <Text style={styles.label}>Nombre</Text>
            <Text style={styles.value}>{user.name}</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Ionicons name="card" size={22} color="#0366c9ff" style={styles.infoIcon} />
          <View style={styles.infoTextBlock}>
            <Text style={styles.label}>DNI</Text>
            <Text style={styles.value}>{user.dni}</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Ionicons name="mail" size={22} color="#0366c9ff" style={styles.infoIcon} />
          <View style={styles.infoTextBlock}>
            <Text style={styles.label}>Correo</Text>
            <Text style={styles.value}>{user.email}</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Ionicons name="call" size={22} color="#0366c9ff" style={styles.infoIcon} />
          <View style={styles.infoTextBlock}>
            <Text style={styles.label}>Teléfono</Text>
            <Text style={styles.value}>{user.phone}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#0366c9ff",
    height: 340,
    borderBottomLeftRadius: height * 0.25,
    borderBottomRightRadius: height * 0.25,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  topBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    top: 20,
    left: 0,
    paddingHorizontal: 20,
    zIndex: 3,
  },
  logoWrapper: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  photoWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: -60,
  },
  photo: {
    width: 160,
    height: 160,
    borderRadius: 1000,
    backgroundColor: "#2e2cf7",
    borderWidth: 5,
    borderColor: "#ffffffff",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 5,
    right: -5,
    backgroundColor: "#0366c9ff",
    borderRadius: 18,
    padding: 6,
    borderWidth: 2,
    borderColor: "#ffffffff",
  },
  infoBox: {
    padding: 24,
    marginHorizontal: 10,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0366c9ff",
    marginBottom: 18,
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoTextBlock: {
    flex: 1,
    justifyContent: "center",
  },
  label: {
    fontSize: 13,
    color: "#888",
  },
  value: {
    fontSize: 17,
    color: "#222",
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 2,
    marginLeft: 34,
  },
});