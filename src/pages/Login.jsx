import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Image
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-toast-message";

import { login } from "../services/authService";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = async () => {
    try {
      const result = await login(email, pass);

      if (result.success) {
        await AsyncStorage.setItem("user", JSON.stringify(result.user));
        Toast.show({
          type: "success",
          text1: "¡Logueado correctamente!",
          text2: `Bienvenido, ${result.user.name || "usuario"}`,
          position: "bottom"
        });
        navigation.navigate("Main", { user: result.user });
      } else {
        Toast.show({
          type: "error",
          text1: "Error de autenticación",
          text2: "Email o contraseña incorrectos",
          position: "bottom"
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error de red",
        text2: "No se pudo conectar al servidor",
        position: "bottom"
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
            <Text style={styles.title}>HOLA!</Text>
            <Text style={styles.subtitle}>Bienvenido</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.form_title}>Ingresar {"\n"} usuario</Text>
            <Image
              source={require("../../assets/refrigerador.png")}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: "center", justifyContent: "center", marginTop: 40 },
  logoContainer: {
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#EAF4FA",
    width: "100%",
    marginTop: 30,
  },
  logo: { width: 220 },
  refrigerador: { position: "absolute", top: -50, right: -210, zIndex: 10, height: 200 },
  title: { fontSize: 50, fontWeight: "bold", color: "#fff", letterSpacing: 2, fontStyle: "italic" },
  subtitle: { fontSize: 16, color: "#fff", marginBottom: 30, fontStyle: "italic" },
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
  loginText: { color: "#EAF4FA", fontSize: 16, fontWeight: "bold" }
});
