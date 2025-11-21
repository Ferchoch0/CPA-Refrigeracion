import React from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { TimelineScreen } from "../components/TimeLine";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GeneralScreen() {
    const route = useRoute();

    const navigation = useNavigation();
    // Añadido clientName y se mantiene el resto de params
    const { equipo, tipoEquipo, unidad, code, equipmentId, typeEquipId, placement, clientName, companyName} = route.params || {};

    // Nuevo: determinar el nombre de cliente buscando en varios lugares de los params/objeto
    const clientDisplayName =
        clientName ||
        companyName ||
        route.params?.clientName ||
        route.params?.client?.company_name ||
        equipo?.client_name ||
        equipo?.nombreCliente ||
        "Cliente desconocido";

    console.log('Route Params:', {
        clientName,
        companyName
    });

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

                {/* Mostrar exactamente 2 líneas:
                    1) Equipo: <codigo> (unidad)  -- si existe la unidad se muestra entre paréntesis
                    2) Cliente: <nombre del cliente> -- siempre visible
                */}
                <View style={styles.headerTextBox}>
                    <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
                        Equipo: {equipo?.code || code}
                        {(equipo?.placement || placement) ? ` (${equipo?.placement || placement})` : ""}
                    </Text>
                    <Text style={styles.headerSubtitle} numberOfLines={1} ellipsizeMode="tail">
                        Cliente: {clientDisplayName}
                    </Text>
                </View>
            </SafeAreaView>

            <View style={styles.divider} />
            <View style={styles.content}>

                <TimelineScreen
                    equipmentId={idFinal}
                    typeEquipId={typeEquipId}
                    equipmentCode={equipo?.code || code}
                />
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
        paddingTop: 16,
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
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 2,
    },
    headerSubtitle: {
        color: "#e0e6ed",
        fontSize: 14,
        fontWeight: "600",
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
