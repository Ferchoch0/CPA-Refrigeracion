import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Image, Modal, ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-toast-message";

import { login } from "../services/authService";
import { syncDataAfterLogin } from "../services/syncService";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [syncLabel, setSyncLabel] = useState("");
  const [syncProgress, setSyncProgress] = useState({ current: 0, total: 0 });

  const handleLogin = async () => {
    try {
      const result = await login(email, pass);

      if (result.success) {

        if (result.isOnline) {
          Toast.show({
            type: "success",
            text1: "¡Logueado correctamente!",
            text2: `Bienvenido, ${result.user.name || "usuario"}`,
            position: "top"
          });

          // Mostrar overlay de sincronización
          setSyncing(true);
          setSyncLabel("Iniciando sincronización...");
          setSyncProgress({ current: 0, total: 0 });

          await syncDataAfterLogin(result.user.id, (current, total, label) => {
            setSyncProgress({ current, total });
            setSyncLabel(label);
          });

          setSyncing(false);
        } else {
          Toast.show({
            type: "info",
            text1: "Sesión offline",
            text2: "Conectado con datos guardados localmente",
            position: "top"
          });
        }

        navigation.navigate("Main", { user: result.user });
      } else {
        if (result.error === 'no_previous_session') {
          Toast.show({
            type: "error",
            text1: "Sin conexión",
            text2: "No hay sesión guardada. Conectate a internet para el primer inicio de sesión",
            position: "top"
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Error de autenticación",
            text2: "Email o contraseña incorrectos",
            position: "top"
          });
        }
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error inesperado",
        text2: "Ocurrió un error al iniciar sesión",
        position: "top"
      });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#003366" }}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={10}
      >
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <View style={styles.header}>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>PORTAL DE ACCESO</Text>
            </View>
            <Text style={styles.title}>¡HOLA!</Text>
            <Text style={styles.subtitle}>Nos alegra verte de nuevo.{"\n"}Ingresa tus datos para continuar.</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.form_title}>Ingresar {"\n"} usuario</Text>
            <Image
              source={require("../../assets/rooftop.png")}
              style={styles.refrigerador}
              resizeMode="contain"
            />

            <TextInput
              placeholder="Email"
              style={styles.input}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#808080"
            />

            <TextInput
              placeholder="Contraseña"
              style={styles.input}
              secureTextEntry
              value={pass}
              onChangeText={setPass}
              placeholderTextColor="#808080"
              textContentType="password"
              autoCapitalize="none"
            />

            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
              <Text style={styles.loginText}>Iniciar sesión</Text>
            </TouchableOpacity>

            <View style={styles.logoContainer}>
              <Image
                source={require("../../assets/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>

      {/* Modal de sincronización */}
      <Modal visible={syncing} transparent animationType="fade">
        <View style={styles.syncOverlay}>
          <View style={styles.syncCard}>
            <ActivityIndicator size="large" color="#003366" />
            <Text style={styles.syncTitle}>Descargando datos</Text>
            <Text style={styles.syncLabel}>{syncLabel}</Text>
            {syncProgress.total > 0 && (
              <>
                <View style={styles.syncBarBg}>
                  <View
                    style={[
                      styles.syncBarFill,
                      {
                        width: `${Math.round(
                          (syncProgress.current / syncProgress.total) * 100
                        )}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.syncCount}>
                  {syncProgress.current} / {syncProgress.total}
                </Text>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: 60,
    paddingHorizontal: 40,
  },
  badgeContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  badgeText: {
    color: "#EAF4FA",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1.5,
  },
  logoContainer: {
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#EAF4FA",
    width: "100%",
    marginTop: 30,
  },
  logo: { width: 220 },
  refrigerador: { position: "absolute", top: -50, right: -310, zIndex: 10, height: 200 },
  title: { fontSize: 48, fontWeight: "900", color: "#fff", letterSpacing: 1, marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#B0D4FF", marginBottom: 30, fontWeight: "500", lineHeight: 24 },
  form: {
    padding: 40,
    width: "100%",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: "#EAF4FA",
    justifyContent: "flex-start",
  },
  form_title: { fontSize: 38, letterSpacing: 2, fontWeight: "bold", color: "#003366", marginBottom: 32 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    color: "#003366",
    fontSize: 16,
  },
  loginBtn: {
    backgroundColor: "#003366",
    borderRadius: 25,
    padding: 15,
    alignItems: "center"
  },
  loginText: { color: "#EAF4FA", fontSize: 16, fontWeight: "bold" },

  // Sync overlay
  syncOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  syncCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    width: 280,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
  },
  syncTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#003366",
    marginTop: 16,
    marginBottom: 8,
  },
  syncLabel: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  syncBarBg: {
    width: "100%",
    height: 8,
    backgroundColor: "#e0e6ed",
    borderRadius: 4,
    overflow: "hidden",
  },
  syncBarFill: {
    height: 8,
    backgroundColor: "#003366",
    borderRadius: 4,
  },
  syncCount: {
    fontSize: 13,
    color: "#999",
    marginTop: 6,
  },
});
