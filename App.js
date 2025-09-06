import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./src/pages/Login";
import Navbar from "./src/components/Navbar";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {/* Login no tiene navbar */}
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* Después del login, mostramos el Navbar */}
        <Stack.Screen name="Main" component={Navbar} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

