import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, FlatList } from "react-native";
import Calendar from "../components/Calendar";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.API_URL;
const Navbar = () => {
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
                <Ionicons name="notifications-outline" size={24} color="#fff" />
            </View>
        </SafeAreaView>
    );
};

const Header = ({ user }) => (
  <View style={styles.header}>
    <View>
      <Text style={styles.greeting}>Hola, {user?.name || "Usuario"}</Text>
      <Text style={styles.welcome}>Bienvenido de nuevo</Text>
    </View>
    <Image
      source={
        user?.photo
          ? { uri: `${API_URL}/upload/profile/${user.photo}` }
          : require("../../assets/image-profile.jpg")
      }
      style={styles.avatar}
    />
  </View>
);


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
            />
        </View>
    );
};

const ClientItem = ({ item, navigation }) => (
    <TouchableOpacity
        style={styles.clientItem}
        onPress={() => navigation.navigate("Equipos", { clientId: item.client_id })}
    >
        <View style={styles.iconContainer}>
            <Ionicons name="business-outline" size={28} color="#003366" />
        </View>
        <View>
            <Text style={styles.clientName}>{item.company_name}</Text>
            <Text style={styles.clientStatus}>{item.contact_person}</Text>
        </View>
    </TouchableOpacity>
);

export default function HomeScreen() {
    const [user, setUser] = useState(null);
    const [filteredClients, setFilteredClients] = useState([]);
    const [userName, setUserName] = useState("Usuario");
    const [userId, setUserId] = useState(null);
    const [allClients, setAllClients] = useState([]);
    const navigation = useNavigation();

    const fetchClients = async (id) => {
        try {
            const response = await fetch(`${API_URL}/clientController.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "getClients",
                    userId: id
                })
            });

            const result = await response.json();

            if (result.success) {
                console.log("Clientes recibidos:", result.clients);
                setAllClients(result.clients);
                setFilteredClients(result.clients);
            } else {
                console.log("Error al traer clientes:", result.error);
                setAllClients([]);
                setFilteredClients([]);
            }
        } catch (error) {
            console.log("Error fetchClients:", error);
        }
    };

    useEffect(() => {
        const loadUser = async () => {
            const storedUser = await AsyncStorage.getItem('user');
            if (storedUser) {
                const u = JSON.parse(storedUser);
                setUser(u);              // ← guardo el objeto completo
                setUserName(u.name);
                setUserId(u.id);

                fetchClients(u.id);
            }
        };
        loadUser();
    }, []);
    return (
        <View style={styles.container}>
            <Navbar />
            <FlatList
                data={[]}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={
                    <>
                        <Header user={user} />
                        <Calendar />
                        <View style={styles.mainContent}>
                            <SearchBar data={allClients} onFilter={setFilteredClients} />

                            <View style={styles.containerClientTitle}>
                                <Text style={styles.sectionTitle}>Últimos clientes</Text>
                                <TouchableOpacity>
                                    <Text style={{ color: "#b3b8d3ff" }}>Ver todos</Text>
                                </TouchableOpacity>
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

    logoWrapper: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
    },

    logoImage: {
        width: 45,
        height: 45,
        resizeMode: "contain",
    },

    navTitle: {
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

    greeting: { color: "#eee", fontSize: 24, fontWeight: "bold" },
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
    clientName: { fontSize: 16, fontWeight: "bold", color: "#1C3F6E" },
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
});
