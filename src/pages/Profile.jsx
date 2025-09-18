import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig.extra.API_URL;
const { height } = Dimensions.get("window");

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  const handleChangePhoto = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        copyToCacheDirectory: true,
      });

      if (result.type === "cancel") return;

      // Normalizar data (por compatibilidad entre SDKs)
      const file = result.assets ? result.assets[0] : result;
      if (!file?.uri) {
        Alert.alert("Error", "No se pudo obtener la URI de la imagen");
        return;
      }

      const formData = new FormData();
      formData.append("action", "uploadProfilePhoto");
      formData.append("userId", user.id);
      formData.append("photo", {
        uri: file.uri,
        name: file.name || `profile_${user.id}.jpg`,
        type: file.mimeType || "image/jpeg",
      });

      const response = await fetch(`${API_URL}/technicalController.php`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.filename) {
        const updatedUser = { ...user, photo: data.filename };
        setUser(updatedUser);
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
        Alert.alert("Éxito", "Foto actualizada correctamente");
      } else {
        Alert.alert("Error", data.error || "Error desconocido al subir la foto");
      }
    } catch (error) {
      console.error("Error cambiar foto:", error);
      Alert.alert("Error", "Ocurrió un error al subir la foto: " + error.message);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error al cargar usuario:", error);
      }
    };
    loadUser();
  }, []);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 50 }}>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate("Inicio")}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <View style={styles.logoWrapper}>
            <Image source={require("../../assets/logo2.png")} style={styles.logoImage} />
          </View>
        </View>

        <View style={styles.photoWrapper}>
          <Image
            source={{ uri: `${API_URL}/upload/profile/${user.photo}` }}
            style={styles.photo}
          />
          <TouchableOpacity style={styles.cameraIcon} onPress={handleChangePhoto}>
            <Ionicons name="camera" size={26} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Info */}
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
    backgroundColor: "#003366",
    height: 340,
    borderBottomLeftRadius: height * 0.2,
    borderBottomRightRadius: height * 0.2,
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
  logoImage: { width: 60, height: 60, resizeMode: "contain" },
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
  infoBox: { padding: 24, marginHorizontal: 10 },
  infoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0366c9ff",
    marginBottom: 18,
    textAlign: "center",
  },
  infoRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10 },
  infoIcon: { marginRight: 12 },
  infoTextBlock: { flex: 1, justifyContent: "center" },
  label: { fontSize: 13, color: "#888" },
  value: { fontSize: 17, color: "#222", fontWeight: "bold" },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 2,
    marginLeft: 34,
  },
});
