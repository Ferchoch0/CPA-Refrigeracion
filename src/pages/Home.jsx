import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, FlatList, ActivityIndicator } from "react-native";
import Calendar from "../components/Calendar";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import useAuth from "../hooks/useAuth";
import useClients from "../hooks/useClients";
import { getProfilePhotoUrl } from "../services/profileService";
import { getPendingCount, syncPendingAnswers } from "../services/syncService";

// ─── Sub-componentes locales ────────────────────────────────

const HomeNavbar = () => {
    return (
        <SafeAreaView style={{ backgroundColor: "#003366" }}>
            <View style={styles.navbar}>
                <View style={styles.logoWrapper}>
                    <Image
                        source={require("../../assets/logo2.png")}
                        style={styles.logoImage}
                    />
                </View>
                <Text style={styles.navTitle}>Inicio</Text>
            </View>
        </SafeAreaView>
    );
};

const Header = ({ user }) => {
    const [imageError, setImageError] = useState(false);

    return (
        <View style={styles.header}>
            <View style={{ flex: 1, marginRight: 12 }}>
                <Text
                    style={styles.greeting}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                >
                    Hola, {user?.name || "Usuario"}
                </Text>
                <Text style={styles.welcome}>Bienvenido de nuevo</Text>
            </View>

            <Image
                source={
                    user?.photo && !imageError
                        ? { uri: getProfilePhotoUrl(user.photo) }
                        : require("../../assets/icon-profile.png")
                }
                style={styles.avatar}
                onError={() => setImageError(true)}
            />
        </View>
    );
};

const SearchBar = ({ data, onFilter }) => {
    const [search, setSearch] = useState("");

    const handleSearch = (text) => {
        setSearch(text);
        if (text.trim() === "") {
            onFilter(data);
        } else {
            const filtered = data.filter((client) =>
                (client.company_name && client.company_name.toLowerCase().includes(text.toLowerCase())) ||
                (client.contact_person && client.contact_person.toLowerCase().includes(text.toLowerCase()))
            );
            onFilter(filtered);
        }
    };

    return (
        <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#666" />
            <TextInput
                style={styles.searchInput}
                placeholder="Buscar cliente..."
                value={search}
                onChangeText={handleSearch}
                placeholderTextColor="#808080"
            />
        </View>
    );
};

const ClientItem = ({ item, navigation }) => (
    <TouchableOpacity
        style={styles.clientItem}
        onPress={() => navigation.navigate("Equipos", {
            clientId: item.client_id,
            clientName: item.company_name
        })}
    >
        <View style={styles.iconContainer}>
            <Ionicons name="business-outline" size={28} color="#003366" />
        </View>
        <View>
            <Text style={styles.clientName}>{item.company_name}</Text>
            <Text style={styles.clientCode}>{item.client_code}</Text>
            <Text style={styles.clientLocation} numberOfLines={1} ellipsizeMode="tail">
                {item.location || item.address || ""}
            </Text>
            <Text style={styles.clientStatus}>{item.contact_person}</Text>
        </View>
    </TouchableOpacity>
);

const PendingBanner = ({ count, onUpload, uploading }) => {
    if (count === 0) return null;

    return (
        <View style={styles.pendingCard}>
            <View style={styles.pendingIconRow}>
                <Ionicons name="cloud-upload-outline" size={24} color="#e67e22" />
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.pendingTitle}>Datos pendientes</Text>
                    <Text style={styles.pendingText}>
                        Tenés {count} {count === 1 ? "formulario" : "formularios"} sin sincronizar
                    </Text>
                </View>
            </View>
            <TouchableOpacity
                style={[styles.pendingBtn, uploading && { opacity: 0.6 }]}
                onPress={onUpload}
                disabled={uploading}
            >
                {uploading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={styles.pendingBtnText}>Subir ahora</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

// ─── Pantalla principal ─────────────────────────────────────

export default function HomeScreen() {
    const { user } = useAuth();
    const { allClients, filteredClients, setFilteredClients } = useClients(user?.id);
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [pendingCount, setPendingCount] = useState(0);
    const [uploading, setUploading] = useState(false);

    // Verificar pendientes cada vez que la pantalla recibe foco
    useEffect(() => {
        if (isFocused) {
            getPendingCount()
                .then(setPendingCount)
                .catch(() => setPendingCount(0));
        }
    }, [isFocused]);

    const handleUploadPending = async () => {
        setUploading(true);
        try {
            const result = await syncPendingAnswers((current, total) => {
                // Progreso opcional — se podría mostrar en el banner
            });
            setPendingCount(0);
            Toast.show({
                type: "success",
                text1: "Sincronización completa",
                text2: `Se subieron ${result.uploaded} de ${result.total} formularios`,
                position: "bottom",
            });
        } catch (err) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "No se pudieron subir los datos. Verificá tu conexión",
                position: "bottom",
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <View style={styles.container}>
            <HomeNavbar />
            <FlatList
                data={[]}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={
                    <>
                        <Header user={user} />
                        <Calendar />
                        <View style={styles.mainContent}>
                            <PendingBanner
                                count={pendingCount}
                                onUpload={handleUploadPending}
                                uploading={uploading}
                            />
                            <SearchBar data={allClients} onFilter={setFilteredClients} />

                            <View style={styles.containerClientTitle}>
                                <Text style={styles.sectionTitle}>Clientes Asignados</Text>
                            </View>

                            <FlatList
                                data={filteredClients}
                                keyExtractor={(item) => item.client_id.toString()}
                                renderItem={({ item }) => <ClientItem item={item} navigation={navigation} />}
                            />
                        </View>
                    </>
                }
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
}

// ─── Estilos ────────────────────────────────────────────────

const styles = StyleSheet.create({
    navbar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 60,
        paddingHorizontal: 16,
        backgroundColor: "#003366",
        borderBottomWidth: 1,
        borderBottomColor: "#002244",
    },

    logoImage: {
        width: 55,
        height: 55,
        resizeMode: "contain",
    },

    navTitle: {
        position: "absolute",
        left: 0,
        right: 0,
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
    },

    container: { flex: 1, backgroundColor: "#fff" },

    header: {
        backgroundColor: "#003366",
        height: 200,
        padding: 22,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomLeftRadius: 60,
    },

    headerWrapper: {
        backgroundColor: "#fff",
    },

    mainContent: { flex: 1, padding: 10, paddingHorizontal: 16 },

    greeting: {
        color: "#eee",
        fontSize: 24,
        fontWeight: "bold",
        flexWrap: "wrap",
        flexShrink: 1
    },
    welcome: { color: "#b3b8d3ff", fontSize: 14 },
    avatar: { width: 55, height: 55, borderRadius: 30, backgroundColor: "#ccc" },

    row: { justifyContent: "space-between" },

    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#eaf4fa9a",
        borderRadius: 16,
        paddingHorizontal: 14,
        marginBottom: 16,
        height: 50,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
    },

    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 15,
        color: "#303030",
    },

    workItem: {
        flex: 1,
        margin: 6,
        borderRadius: 10,
        backgroundColor: "#ebf2fd",
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
        padding: 16,
    },

    title: { fontSize: 16, fontWeight: "bold", color: "#1C3F6E" },
    category: { fontSize: 12, color: "#666" },
    icon: { marginRight: 12 },

    containerClientTitle: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8, marginTop: 16 },
    sectionTitle: { fontSize: 20, marginBottom: 12, color: "#003366" },

    clientItem: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
    },
    clientName: { fontSize: 16, fontWeight: "bold", color: "#1e5db1ff" },
    clientCode: { fontSize: 12, color: "#999", marginTop: 2, marginBottom: 3 },
    clientLocation: {
        fontSize: 13,
        fontWeight: "bold",
        color: "#4e4e4eff",
        marginTop: 1,
        marginBottom: 3,
    },
    clientStatus: { fontSize: 12, color: "#666" },
    iconContainer: {
        width: 35,
        height: 35,
        borderRadius: 20,
        backgroundColor: "#d0e1fd",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },

    // Pending banner
    pendingCard: {
        backgroundColor: "#fff8f0",
        borderRadius: 14,
        padding: 16,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: "#e67e22",
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    pendingIconRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    pendingTitle: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#333",
    },
    pendingText: {
        fontSize: 13,
        color: "#888",
        marginTop: 2,
    },
    pendingBtn: {
        backgroundColor: "#003366",
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: "center",
    },
    pendingBtnText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
    },
});
