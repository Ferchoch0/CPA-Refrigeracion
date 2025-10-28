import React, { useState, useEffect } from "react";
import {
    ScrollView, Text, StyleSheet, ActivityIndicator,
    TextInput, TouchableOpacity, View, Image
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import { useRoute } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Constants from 'expo-constants';
import DateTimePicker from "@react-native-community/datetimepicker";

import Toast from "react-native-toast-message";


const API_URL = Constants.expoConfig.extra.API_URL;
function AnswersForm() {
    const [fields, setFields] = useState([]);
    const [answers, setAnswers] = useState({});
    const [files, setFiles] = useState({});
    const [loading, setLoading] = useState(true);
    const route = useRoute();
    const { categoryId, equipmentId, typeEquipId } = route.params;
    const [showPicker, setShowPicker] = useState(null);

    useEffect(() => {
        const fetchFields = async () => {
            try {
                console.log("Buscando respuestas para equipmentId:", equipmentId);

                const response = await fetch(
                    `${API_URL}/equipmentsController.php?action=getQuestionsByType&category_id=${categoryId}&type_equip_id=${typeEquipId}&equipment_id=${equipmentId}`
                );
                const data = await response.json();
                console.log("Datos recibidos:", data);

                if (data.error) {
                    console.error("Error del servidor:", data.error);
                    setFields([]);
                    setAnswers({});
                } else {
                    setFields(data.questions || []);
                    setAnswers(data.answers || {});
                }
            } catch (error) {
                console.error("Error en fetch:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFields();
    }, [categoryId, equipmentId, typeEquipId]);

    const handleChange = (id, value) => {
        setAnswers((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleFilePick = async (id) => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "image/*",
                multiple: true,
                copyToCacheDirectory: true,
            });

            if (result.type === "cancel") return;

            const selectedFiles = result.assets || [result];
            const validFiles = selectedFiles.filter(f => f.uri);

            setFiles((prev) => ({
                ...prev,
                [id]: [
                    ...(prev[id] || []),
                    ...validFiles.map(file => ({
                        uri: file.uri,
                        name: file.name || `equip_${equipmentId}_${id}_${Date.now()}.jpg`,
                        type: file.mimeType || "image/jpeg",
                    })),
                ],
            }));
        } catch (err) {
            console.error("Error seleccionando archivo:", err);
        }
    };


const handleSubmit = async () => {
    try {
        const storedUser = await AsyncStorage.getItem("user");
        if (!storedUser) {
            alert("No se encontró el usuario en la sesión");
            return;
        }

        const user = JSON.parse(storedUser);
        const userId = user.id;

        const formData = new FormData();
        formData.append("action", "saveAnswers");
        formData.append("equipment_id", equipmentId);
        formData.append("user_id", userId);

        for (const [fieldId, value] of Object.entries(answers)) {
            formData.append(`answer_${fieldId}`, value ?? "");
        }

        for (const [fieldId, fileList] of Object.entries(files)) {
            fileList.forEach((file, index) => {
                formData.append(`file_${fieldId}_${index}`, {
                    uri: file.uri,
                    name: file.name,
                    type: file.type,
                });
            });
        }

        const response = await fetch(`${API_URL}/equipmentsController.php`, {
            method: "POST",
            body: formData,
        });

        // 🔎 Mostrar el texto exacto que devuelve el servidor
        const text = await response.text();
        console.log("=== RESPUESTA DEL SERVIDOR (TEXTO CRUDO) ===");
        console.log(text);
        alert("Respuesta del servidor:\n\n" + text);

    } catch (error) {
        console.error("Error en handleSubmit:", error);
        alert("Error en handleSubmit: " + error.message);
    }
};





    if (loading) {
        return (
            <ScrollView contentContainerStyle={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#003366" />
            </ScrollView>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {fields.map((field) => (
                <React.Fragment key={field.field_equip_id}>
                    <Text style={styles.label}>{field.name}</Text>

                    {field.fields_type === "text" && (
                        <TextInput
                            style={styles.input}
                            placeholder={field.description || field.name}
                            value={answers[field.field_equip_id] || ""}
                            onChangeText={(val) => handleChange(field.field_equip_id, val)}
                            placeholderTextColor="#808080"
                        />
                    )}

                    {field.fields_type === "number" && (
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder={field.description || field.name}
                            value={answers[field.field_equip_id] || ""}
                            onChangeText={(val) => handleChange(field.field_equip_id, val)}
                            placeholderTextColor="#808080"
                        />
                    )}

                    {field.fields_type === "file" && (
                        <View style={{ marginVertical: 10 }}>
                            <TouchableOpacity
                                style={styles.fileButton}
                                onPress={() => handleFilePick(field.field_equip_id)}
                            >
                                <Text style={styles.fileButtonText}>
                                    {files[field.field_equip_id]?.name
                                        ? "Cambiar archivo"
                                        : "Seleccionar archivo"}
                                </Text>
                            </TouchableOpacity>

                            {/* Previsualización */}
                            <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}>
                                {(files[field.field_equip_id] || []).map((file, index) => (
                                    <Image
                                        key={index}
                                        source={{ uri: file.uri }}
                                        style={{
                                            width: 100,
                                            height: 100,
                                            borderRadius: 8,
                                            marginRight: 8,
                                            marginBottom: 8,
                                        }}
                                        resizeMode="cover"
                                    />
                                ))}

                                {/* Si ya había imágenes guardadas en el servidor */}
                                {Array.isArray(answers[field.field_equip_id]) &&
                                    answers[field.field_equip_id].map((img, index) => (
                                        <Image
                                            key={`srv_${index}`}
                                            source={{ uri: `${API_URL}/upload/equip/${img}` }}
                                            style={{
                                                width: 100,
                                                height: 100,
                                                borderRadius: 8,
                                                marginRight: 8,
                                                marginBottom: 8,
                                            }}
                                            resizeMode="cover"
                                        />
                                    ))}
                            </View>
                        </View>
                    )}

                    {field.fields_type === "date" && (
                        <TouchableOpacity
                            style={styles.input}
                            onPress={() => setShowPicker(field.field_equip_id)}
                        >
                            <Text style={{ color: answers[field.field_equip_id] ? "#003366" : "#999" }}>
                                {answers[field.field_equip_id] || "Seleccionar fecha"}
                            </Text>
                        </TouchableOpacity>
                    )}

                    {field.fields_type === "select" && (
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={answers[field.field_equip_id] || ""}
                                onValueChange={(val) => handleChange(field.field_equip_id, val)}
                                style={styles.pickerCustom}
                                itemStyle={{ color: "#003366", fontSize: 16, fontWeight: "500" }} // iOS
                                dropdownIconColor="#003366"
                            >
                                <Picker.Item label="Seleccione una opción..." value="" color="#888" />
                                {field.options && field.options.map((opt) => (
                                    <Picker.Item
                                        key={opt.option_id}
                                        label={opt.label}
                                        value={opt.value}
                                        color="#222" // letras negras
                                    />
                                ))}
                            </Picker>
                        </View>
                    )}
                </React.Fragment>
            ))}

            {showPicker && (
                <DateTimePicker
                    value={
                        answers[showPicker]
                            ? new Date(answers[showPicker])
                            : new Date()
                    }
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowPicker(null);
                        if (selectedDate) {
                            const formatted = selectedDate.toISOString().split("T")[0];
                            handleChange(showPicker, formatted);
                        }
                    }}
                />
            )}

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Guardar respuestas</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

function AnswersHeader() {
    const navigation = useNavigation();
    const route = useRoute();
    const { categoryId, equipmentId, typeEquipId } = route.params;

    // Estado para el nombre de la categoría
    const [categoryName, setCategoryName] = useState("");
    useEffect(() => {
        // Traer el nombre de la categoría usando categoryId
        const fetchCategoryName = async () => {
            try {
                const response = await fetch(
                    `${API_URL}/equipmentsController.php?action=getQuestionsCategory&equipment_id=${equipmentId}`
                );
                const data = await response.json();
                if (Array.isArray(data)) {
                    const cat = data.find(c => c.field_category_id == categoryId);
                    setCategoryName(cat ? cat.name : "");
                }
            } catch (e) {
                setCategoryName("");
            }
        };
        fetchCategoryName();
    }, [categoryId, equipmentId]);

    return (
        <SafeAreaView style={styles.header}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back" size={26} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerTextBox}>
                <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
                    Formulario: {categoryName || "Cargando..."}
                </Text>
                <Text style={styles.headerSubtitle} numberOfLines={1} ellipsizeMode="tail">
                    Equipo:
                </Text>
            </View>
        </SafeAreaView>
    );
}

export default function AnswersScreen() {
    return (
        <View style={{ flex: 1 }}>
            <AnswersHeader />

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                <AnswersForm />
            </ScrollView>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
    flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 18,
        paddingBottom: 16,
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
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 6,
        marginTop: 12,
        color: "#003366",
    },
    input: {
        borderWidth: 2,
        borderColor: "#003366",
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        marginBottom: 12,
        backgroundColor: "#fff",
        color: "#003366",
    },
    pickerContainer: {
        borderWidth: 2,
        borderColor: "#003366",
        borderRadius: 10,
        marginBottom: 12,
        backgroundColor: "#fff",
        overflow: "hidden",
    },
    pickerCustom: {
        color: "#222", // letras negras
        fontWeight: "500",
        fontSize: 16,
        backgroundColor: "#fff",
        minHeight: 48,
        borderRadius: 10,
        paddingHorizontal: 8,
    },
    fileButton: {
        marginVertical: 10,
        backgroundColor: "#003366",
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: "center",
    },
    fileButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
    submitButton: {
        marginTop: 20,
        backgroundColor: "#003366",
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: "center",
    },
    submitButtonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 18,
    },
});
