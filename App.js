import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync(Ionicons.font);
      setFontsLoaded(true);
    }
    loadFonts();
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
