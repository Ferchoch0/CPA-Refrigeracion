import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

import useAuth from "../hooks/useAuth";
import { uploadProfilePhoto, getProfilePhotoUrl } from "../services/profileService";

const { height } = Dimensions.get("window");

export default function Profile() {
  const { user, setUser } = useAuth();
  const navigation = useNavigation();
  const [imageError, setImageError] = useState(false);

  const handleChangePhoto = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        copyToCacheDirectory: true,
      });

      if (result.type === "cancel") return;

      const file = result.assets ? result.assets[0] : result;
      if (!file?.uri) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "No se pudo obtener la URI de la imagen",
        });
        return;
      }

      const photoFile = {
        uri: file.uri,
        name: file.name || `profile_${user.id}.jpg`,
        type: file.mimeType || "image/jpeg",
      };

      const data = await uploadProfilePhoto(user.id, photoFile);

      if (data.success && data.filename) {
        await setUser({ ...user, photo: data.filename });

        Toast.show({
          type: "success",
          text1: "Éxito",
          text2: "Foto actualizada correctamente",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: data.error || "Error desconocido al subir la foto",
        });
      }
    } catch (error) {
      console.error("Error cambiar foto:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Ocurrió un error al subir la foto",
      });
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Salir",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("user");
            navigation.reset({ index: 0, routes: [{ name: "Login" }] });
          }
        }
      ]
    );
  };

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
      <SafeAreaView style={styles.header}>
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
            source={
              !user.photo || imageError
                ? require("../../assets/icon-profile.png")
                : { uri: getProfilePhotoUrl(user.photo) }
            }
            style={styles.photo}
            onError={() => setImageError(true)}
          />
          <TouchableOpacity style={styles.cameraIcon} onPress={handleChangePhoto}>
            <Ionicons name="camera" size={26} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

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

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#fff" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
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
    paddingTop: 16,
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
    backgroundColor: "#ffffffff",
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
  logoutBtn: {
    backgroundColor: "#d9534f",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 30,
  },
  logoutIcon: { marginRight: 8 },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
