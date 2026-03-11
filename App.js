import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import AppNavigator from "./src/navigation/AppNavigator";
import { initDatabase } from "./src/services/database";
import { syncPendingAnswers } from "./src/services/syncService";

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadResources() {
      await Promise.all([
        Font.loadAsync(Ionicons.font),
        initDatabase(),
      ]);
      setFontsLoaded(true);

      // Intentar sincronizar respuestas pendientes en background
      syncPendingAnswers().catch(err =>
        console.log('Auto-sync pendientes omitido:', err.message)
      );
    }
    loadResources();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
      <Toast />
    </GestureHandlerRootView>
  );
}
