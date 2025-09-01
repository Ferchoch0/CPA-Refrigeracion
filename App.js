import React from "react";
import { 
  SafeAreaView, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>

      {/* Título */}
      <Text style={styles.title}>Hola!</Text>
      <Text style={styles.subtitle}>Bienvenido</Text>

      {/* Formulario */}
      <View style={styles.form}>
        <TextInput 
          placeholder="Email" 
          style={styles.input} 
          keyboardType="email-address"
        />
        <TextInput 
          placeholder="Contraseña" 
          style={styles.input} 
          secureTextEntry
        />

        <TouchableOpacity>
          <Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginBtn}>
          <Text style={styles.loginText}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>

      {/* Logo CPA */}
      <Image 
        source={require("./assets/logo.png")}
        style={styles.logo} 
        resizeMode="contain"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAF4FA",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  logo: {
    
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#003366",
  },
  subtitle: {
    fontSize: 16,
    color: "#003366",
    marginBottom: 30,
  },
  form: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  forgot: {
    color: "#003366",
    textAlign: "right",
    marginBottom: 20,
  },
  loginBtn: {
    backgroundColor: "#003366",
    borderRadius: 25,
    padding: 15,
    alignItems: "center",
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  orText: {
    marginTop: 25,
    marginBottom: 10,
    color: "#003366",
  },
});
