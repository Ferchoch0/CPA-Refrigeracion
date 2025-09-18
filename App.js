import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "./src/pages/SplashScreen";
import LoginScreen from "./src/pages/Login";
import Navbar from "./src/components/Navbar";
import EquiposScreen from "./src/pages/Equipos";
import TipoEquipoScreen from "./src/components/TipoEquipo";
import FormGeneral from "./src/pages/FormGeneral";
import AnswersScreen from "./src/pages/Answers";
import ProfileScreen from "./src/pages/Profile"; // Importa tu pantalla de perfil

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Pantalla inicial: SplashScreen */}
        <Stack.Screen name="Splash" component={SplashScreen} />

        {/* Login no tiene navbar */}
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* Después del login, mostramos el Navbar */}
        <Stack.Screen name="Main" component={Navbar} />

        {/* Agrega Equipos como pantalla normal */}
        <Stack.Screen name="Equipos" component={EquiposScreen} />

        {/* Modal para TipoEquipo */}
        <Stack.Screen
          name="TipoEquipo"
          component={TipoEquipoScreen}
          options={{ presentation: "modal", headerShown: false }}
        />

        {/* Página normal para FormGeneral */}
        <Stack.Screen name="FormGeneral" component={FormGeneral} />

        {/* Agrega Equipos como pantalla normal */}
        <Stack.Screen name="Preguntas" component={AnswersScreen} />

        {/* Perfil como modal para animación de abajo hacia arriba */}
        <Stack.Screen
          name="Perfil"
          component={ProfileScreen}
          options={{ presentation: "modal", headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}