import React from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { TimelineScreen } from "../components/TimeLine";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GeneralScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { equipo, tipoEquipo, unidad, code, equipmentId } = route.params || {};

    const idFinal = equipo?.equipment_id || equipmentId;

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={26} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerTextBox}>
                    <Text style={styles.headerTitle}>Equipo:</Text>
                    <Text style={styles.headerSubtitle}>
                        {equipo?.code || code}
                    </Text>
                </View>
            </SafeAreaView>
            <View style={styles.divider} />
            <View style={styles.content}>
                
                <TimelineScreen equipmentId={idFinal} />
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
        paddingBottom: 10,
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
