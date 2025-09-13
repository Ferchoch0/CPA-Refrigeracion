import React, { useState } from "react";
import {
  SafeAreaView, View, Text, TextInput, TouchableOpacity,
  StyleSheet, Image, StatusBar, Alert
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.0.184/MIAPP/api/controller/technicalController.php', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verifyUser",
          email,
          pass
        })
      });

      const result = await response.json();

      if (result.success) {
        await AsyncStorage.setItem('user', JSON.stringify(result.user));
        navigation.navigate("Main", { user: result.user });
      } else {
        Alert.alert("Error", result.error || "Credenciales inválidas");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#003366" />

      <View style={styles.header}>
        <Text style={styles.title}>HOLA!</Text>
        <Text style={styles.subtitle}>Bienvenido</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.form_title}> Ingresar {"\n"} usuario </Text>
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
        />
        
        <TextInput 
          placeholder="Contraseña" 
          style={styles.input} 
          secureTextEntry
          value={pass}
          onChangeText={setPass}
        />

        <TouchableOpacity>
          <Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#003366", alignItems: "center", justifyContent: "center" },
  header: { width: "100%", alignItems: "center", justifyContent: "center", marginTop: 40, flex: 1 },
  logoContainer: { alignItems: "center", borderTopWidth: 1, borderTopColor: "#b1b1b1ff", marginTop: 30, paddingTop: 20, width: "100%" },
  logo: { width: 220 },
  refrigerador: { position: "absolute", top: -50, right: -210, zIndex: 10, height: 200 },
  title: { fontSize: 50, fontWeight: "bold", color: "#fff", letterSpacing: 2, fontStyle: "italic" },
  subtitle: { fontSize: 16, color: "#fff", marginBottom: 30, fontStyle: "italic" },
  form: { padding: 40, width: "100%", borderTopLeftRadius: 40, borderTopRightRadius: 40, backgroundColor: "#EAF4FA" },
  form_title: { fontSize: 38, letterSpacing: 2, fontWeight: "bold", color: "#003366", marginBottom: 32 },
  input: { backgroundColor: "#fff", borderRadius: 25, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: "#ddd" },
  forgot: { color: "#033D94", textAlign: "right", marginBottom: 20 },
  loginBtn: { backgroundColor: "#003366", borderRadius: 25, padding: 15, alignItems: "center" },
  loginText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
