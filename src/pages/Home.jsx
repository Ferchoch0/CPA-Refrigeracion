import React from "react";
import { View, Text, StyleSheet } from "react-native";

function HomeItem() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bienvenido al Home</Text>
    </View>
  );

}

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <HomeItem />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  text: { fontSize: 24, fontWeight: "bold", color: "#003366" },
});
