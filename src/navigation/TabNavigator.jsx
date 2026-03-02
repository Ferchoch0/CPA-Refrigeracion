import React from "react";
import { View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import HomeScreen from "../pages/Home";
import ProfileScreen from "../pages/Profile";
import QRScanner from "../pages/QrScanner";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
    return (
        <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: styles.navbar,
                    tabBarActiveTintColor: "#0366c9ff",
                    tabBarInactiveTintColor: "#aaa",
                }}
            >
                {/* Home */}
                <Tab.Screen
                    name="Inicio"
                    component={HomeScreen}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <Ionicons name="home" size={26} color={color} />
                        ),
                    }}
                />

                {/* QR Code */}
                <Tab.Screen
                    name="QR"
                    component={QRScanner}
                    options={{
                        tabBarIcon: () => (
                            <View style={styles.centerButton}>
                                <Ionicons name="qr-code" size={28} color="#fff" />
                            </View>
                        ),
                        tabBarLabel: "",
                    }}
                />

                {/* Profile */}
                <Tab.Screen
                    name="Perfil"
                    component={ProfileScreen}
                    options={{
                        tabBarIcon: ({ color }) => (
                            <Ionicons name="person" size={26} color={color} />
                        ),
                    }}
                />
            </Tab.Navigator>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
    navbar: {
        backgroundColor: "#fff",
        height: 70,
        elevation: 0,
        shadowOpacity: 0,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 0,
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
