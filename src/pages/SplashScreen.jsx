import React, { useEffect, useRef } from "react";
import { View, Image, StyleSheet, Animated, StatusBar } from "react-native";

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current; // valor inicial 0 = invisible

  useEffect(() => {
    // Animación de fade-in
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000, // 1 segundo
        useNativeDriver: true,
      }),
      Animated.delay(1000), // mostrar el logo 1 segundo
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000, // 1 segundo fade-out
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Después de animación, ir a Login
      navigation.replace("Login");
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Animated.Image
        source={require("../../assets/logo2.png")}
        style={[styles.logo, { opacity: fadeAnim }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAF4FA", // color de fondo
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
  },
});
