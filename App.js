import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";

import SplashScreen from "./src/pages/SplashScreen";
import LoginScreen from "./src/pages/Login";
import Navbar from "./src/components/Navbar";
import EquiposScreen from "./src/pages/Equipos";
import TipoEquipoScreen from "./src/components/TipoEquipo";
import FormGeneral from "./src/pages/FormGeneral";
import AnswersScreen from "./src/pages/Answers";
import ProfileScreen from "./src/pages/Profile";

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      // Cargar fuentes de Ionicons para todos los iconos de la app
      await Font.loadAsync(Ionicons.font);
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // podés reemplazar por un SplashScreen mientras carga
  }

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Main" component={Navbar} />
          <Stack.Screen name="Equipos" component={EquiposScreen} />
          <Stack.Screen
            name="TipoEquipo"
            component={TipoEquipoScreen}
            options={{ presentation: "modal", headerShown: false }}
          />
          <Stack.Screen name="FormGeneral" component={FormGeneral} />
          <Stack.Screen name="Preguntas" component={AnswersScreen} />
          <Stack.Screen
            name="Perfil"
            component={ProfileScreen}
            options={{ presentation: "modal", headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
}