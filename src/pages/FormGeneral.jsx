import React from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { TimelineScreen } from "../components/TimeLine";

export default function GeneralScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { tipoEquipo, unidad } = route.params || {};

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={26} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerTextBox}>
                    <Text style={styles.headerTitle}>Equipo:</Text>
                    <Text style={styles.headerSubtitle}>
                        {tipoEquipo ? tipoEquipo : "Tipo de producto"}
                        {unidad ? ` • Unidad: ${unidad}` : ""}
                    </Text>
                </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.content}>
                <TimelineScreen />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 18,
        paddingVertical: 16,
        backgroundColor: "#003366",
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
    },
    backButton: {
        marginRight: 12,
        padding: 6,
    },
    headerTextBox: {
        flex: 1,
        justifyContent: "center",
    },
    headerTitle: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 2,
    },
    headerSubtitle: {
        color: "#e0e6ed",
        fontSize: 15,
        fontWeight: "500",
    },
    divider: {
        height: 1,
        backgroundColor: "#e0e6ed",
        marginHorizontal: 18,
        marginBottom: 2,
        opacity: 0.5,
    },
    content: {
        flex: 1,
    },
});
