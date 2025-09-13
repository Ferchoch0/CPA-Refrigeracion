import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "./src/pages/SplashScreen";
import LoginScreen from "./src/pages/Login";
import Navbar from "./src/components/Navbar";
import EquiposScreen from "./src/pages/Equipos";
import TipoEquipoScreen from "./src/components/TipoEquipo";
import FormGeneral from "./src/pages/FormGeneral";

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}