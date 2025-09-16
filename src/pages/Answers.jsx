import React, { useState, useEffect } from "react";
import {
    ScrollView,
    Text,
    Button,
    StyleSheet,
    ActivityIndicator,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import { useRoute } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

function AnswersForm() {
    const [fields, setFields] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const route = useRoute();
    const { categoryId, equipmentId } = route.params;

    useEffect(() => {
        const fetchFields = async () => {
            try {
                const response = await fetch(
                    `http://192.168.0.184/MIAPP/api/controller/equipmentsController.php?action=getQuestions&category_id=${categoryId}`
                );
                const data = await response.json();

                if (data.error) {
                    console.error("Error del servidor:", data.error);
                    setFields([]);
                } else {
                    setFields(data);
                }
            } catch (error) {
                console.error("Error en fetch:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFields();
    }, [categoryId]);

    const handleChange = (id, value) => {
        setAnswers((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleFilePick = async (id) => {
        try {
            const result = await DocumentPicker.getDocumentAsync({});
            if (result.type === "success") {
                handleChange(id, result.uri);
            }
        } catch (err) {
            console.error("Error seleccionando archivo:", err);
        }
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("action", "saveAnswers");
            formData.append("equipment_id", equipmentId);

            for (const [fieldId, value] of Object.entries(answers)) {
                if (typeof value === "string" && value.startsWith("file://")) {
                    const fileName = value.split("/").pop();
                    formData.append(`file_${fieldId}`, {
                        uri: value,
                        name: fileName,
                        type: "image/jpeg",
                    });
                } else {
                    formData.append(`answer_${fieldId}`, value);
                }
            }

            const response = await fetch("http://192.168.0.184/MIAPP/api/controller/equipmentsController.php", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                alert("Respuestas guardadas con éxito");
            } else {
                alert("Error al guardar: " + (data.error || "Desconocido"));
            }
        } catch (error) {
            console.error("Error en handleSubmit:", error);
            alert("Error en la conexión con el servidor");
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
                        />
                    )}

                    {field.fields_type === "number" && (
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder={field.description || field.name}
                            value={answers[field.field_equip_id] || ""}
                            onChangeText={(val) => handleChange(field.field_equip_id, val)}
                        />
                    )}

                    {field.fields_type === "file" && (
                        <Button title="Seleccionar archivo" onPress={() => handleFilePick(field.field_equip_id)} />
                    )}

                    {field.fields_type === "select" && (
                        <Picker
                            selectedValue={answers[field.field_equip_id] || ""}
                            onValueChange={(val) => handleChange(field.field_equip_id, val)}
                        >
                            <Picker.Item label="Seleccione una opción..." value="" />
                            {field.options && field.options.map((opt) => (
                                <Picker.Item
                                    key={opt.option_id}
                                    label={opt.label}
                                    value={opt.value}
                                />
                            ))}
                        </Picker>
                    )}
                </React.Fragment>
            ))}

            <Button title="Guardar respuestas" onPress={handleSubmit} />
        </ScrollView>
    );
}

function AnswersHeader() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.header}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back" size={26} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerTextBox}>
                <Text style={styles.headerTitle}>Formulario:</Text>
                <Text style={styles.headerSubtitle}>
                    Preguntas
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
    picker: {
        borderWidth: 2,
        borderColor: "#003366",
        borderRadius: 10,
        marginBottom: 12,
        backgroundColor: "#fff",
        color: "#003366",
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
