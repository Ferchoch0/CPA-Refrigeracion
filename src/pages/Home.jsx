import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, FlatList } from "react-native";
import Calendar from "../components/Calendar";
import { Ionicons } from "@expo/vector-icons";

const Navbar = () => {
    return (
        <View style={styles.headerContainer}>
            <Image source={require("../../assets/logo-short.png")} style={styles.logoImage} />
            <Text style={styles.headerTitle}>Home</Text>
        </View>
    );
};

const Header = () => (
    <View style={styles.header}>
        <View>
            <Text style={styles.greeting}>Hola, Diego!</Text>
            <Text style={styles.welcome}>Bienvenido de nuevo</Text>
        </View>
        <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/3.jpg" }}
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
                client.name.toLowerCase().includes(text.toLowerCase())
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

const projects = [
    {
        id: "1",
        title: "Agregar +",
        category: "Nuevo cliente",
        icon: "person-add-outline",
        window: "NewClient"
    },
    {
        id: "2",
        title: "Lista Completa",
        category: "Ver todos los clientes",
        icon: "people-outline",
        window: "ClientsList"
    },
];

const clients = [
    { id: "1", name: "Juan Pérez", status: "Activo", icon: "person-circle-outline" },
    { id: "2", name: "María López", status: "Activo", icon: "person-circle-outline" },
    { id: "3", name: "Carlos Díaz", status: "Completado", icon: "person-circle-outline" },
    { id: "4", name: "Ana Gómez", status: "Activo", icon: "person-circle-outline" },
    { id: "5", name: "Luis Fernández", status: "Completado", icon: "person-circle-outline" },
    { id: "6", name: "Sofía Martínez", status: "Activo", icon: "person-circle-outline" },
    { id: "7", name: "Sofía Martínez", status: "Activo", icon: "person-circle-outline" },
    { id: "8", name: "Sofía Martínez", status: "Activo", icon: "person-circle-outline" },
    { id: "9", name: "Sofía Martínez", status: "Activo", icon: "person-circle-outline" },

];

// const WorkItem = ({ item }) => (
//     <TouchableOpacity style={styles.workItem} onPress={() => navigation.navigate(item.window)}>
//         <View style={{ flexDirection: "row", alignItems: "center" }}>
//             <Ionicons name={item.icon} size={26} color="#1C3F6E" style={styles.icon} />
//             <View>
//                 <Text style={styles.title}>{item.title}</Text>
//                 <Text style={styles.category}>{item.category}</Text>
//             </View>
//         </View>
//     </TouchableOpacity>
// );

// const WorkList = () => (
//     <FlatList
//         key={"two-columns"}
//         data={projects}
//         keyExtractor={(item) => item.id}
//         numColumns={2}
//         columnWrapperStyle={styles.row}
//         renderItem={({ item }) => <WorkItem item={item} />}
//         style={{ flexGrow: 0, marginBottom: 16 }}
//     />
// );

const ClientItem = ({ item }) => (
    <View style={styles.clientItem}>
        <View style={styles.iconContainer}>
            <Ionicons name={item.icon} size={28} color="#003366" />
        </View>
        <View>
            <Text style={styles.clientName}>{item.name}</Text>
            <Text style={styles.clientStatus}>{item.status}</Text>
        </View>
    </View>
);

export default function HomeScreen() {
    const [filteredClients, setFilteredClients] = useState(clients);

    return (
        <View style={styles.container}>
            <Navbar />
            <FlatList
                data={[]}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={
                    <>
                        <Header />
                        <View style={styles.mainContent}>
                            <Calendar />
                            <SearchBar data={clients} onFilter={setFilteredClients} />

                            <View style={styles.containerClientTitle}>
                                <Text style={styles.sectionTitle}>Últimos clientes</Text>
                                <TouchableOpacity>
                                    <Text style={{ color: "#b3b8d3ff" }}>Ver todos</Text>
                                </TouchableOpacity>
                            </View>



                            <FlatList
                                data={filteredClients}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => <ClientItem item={item} />}
                                style={{ flexGrow: 0 }}
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
    headerContainer: {
        flexDirection: "row",
        alignItems: "start",
        justifyContent: "center",
        height: 75,
        paddingHorizontal: 10,
        paddingTop: 35,
    },
    logoImage: {
        position: "absolute",
        left: 10,
        top: 35,
    },

    headerTitle: {
        fontSize: 20,
        textAlign: "center",
        color: "#003366",
    },

    container: { flex: 1, backgroundColor: "#fff" },

    header: {
        borderBottomLeftRadius: 28,
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 200,
    },

    mainContent: { flex: 1, padding: 16 },

    greeting: { color: "#003366", fontSize: 24, fontWeight: "bold" },
    welcome: { color: "#b3b8d3ff", fontSize: 14 },
    avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#ccc" },

    row: { justifyContent: "space-between" },

    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f1f1f1",
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 12,
    },
    searchInput: {
        flex: 1,
        height: 55,
        marginLeft: 8,
        fontSize: 14,
        color: "#333",
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
