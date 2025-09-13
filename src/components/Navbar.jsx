import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";

import HomeScreen from "../pages/Home"; // Tu pantalla real de Home
import EquiposScreen from "../pages/Equipos"; // Tu pantalla real de Equipos
import GeneralScreen from "../pages/FormGeneral";

const Tab = createBottomTabNavigator();

export default function Navbar() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.navbar,
        tabBarActiveTintColor: "#0366c9ff",      // Color activo
        tabBarInactiveTintColor: "#aaa",         // Color inactivo
      }}
    >
      {/* Home */}
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" size={26} color={color} />
          ),
        }}
      />

      {/* QR Code */}
      <Tab.Screen
        name="QR"
        component={HomeScreen} // Cambiar después a pantalla QR
        options={{
          tabBarIcon: () => (
            <View style={styles.centerButton}>
              <Icon name="qr-code" size={28} color="#fff" />
            </View>
          ),
          tabBarLabel: "", // Oculta el texto debajo del botón QR
        }}
      />

      {/* Profile */}
      <Tab.Screen
        name="Perfil"
        component={GeneralScreen} // Cambiar después a pantalla a algo que no sea Home
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="person" size={26} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: "#fff",
    height: 70,
  },
  centerButton: {
    width: 60,
    height: 60,
    backgroundColor: "#0366c9ff",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
});
