import React, { useState, useEffect, useRef } from "react";
import {
    ScrollView, Text, StyleSheet, ActivityIndicator,
    TextInput, TouchableOpacity, View, Image, Modal, Animated, Easing
} from "react-native";
import * as ImagePicker from "expo-image-picker";
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
    // preview: null | { uri, isNew: boolean, fieldId, index }
    const [preview, setPreview] = useState(null);
    const route = useRoute();
    const { categoryId, equipmentId, typeEquipId } = route.params;
    const [showPicker, setShowPicker] = useState(null);
    const [selectModalId, setSelectModalId] = useState(null);

    // selección múltiple por mantener presionado
    const [selectionMode, setSelectionMode] = useState(false);
    // estructura: { [fieldId]: Set(indices) }
    const [selected, setSelected] = useState({});

    // flag para evitar que onPress se ejecute justo después de onLongPress
    const [justLongPressed, setJustLongPressed] = useState(false);
    const justLongPressedTimer = useRef(null);

    // animaciones FAB
    const fabAnim = useRef(new Animated.Value(0)).current; // 0 oculto, 1 visible
    const previewRemoveScale = useRef(new Animated.Value(1)).current;
    const fabRemoveScale = useRef(new Animated.Value(1)).current;

    const [serverImages, setServerImages] = useState({}); // NUEVO: imágenes del servidor por campo

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

        const fetchServerImages = async () => {
            try {
                // Traer imágenes del servidor por equipmentId
                const res = await fetch(
                    `${API_URL}/equipmentsController.php?action=getImagesByEquipmentId&equipment_id=${equipmentId}`
                );
                const data = await res.json();
                // Agrupar por field_equip_id si tu backend lo permite, si no, todo en uno
                // Suponiendo que cada imagen tiene un campo 'field_equip_id' y 'name'
                if (Array.isArray(data)) {
                    const grouped = {};
                    data.forEach(img => {
                        const fieldId = img.field_equip_id || "default";
                        if (!grouped[fieldId]) grouped[fieldId] = [];
                        grouped[fieldId].push(img.name);
                    });
                    setServerImages(grouped);
                }
            } catch (err) {
                setServerImages({});
            }
        };

        fetchFields();
        fetchServerImages();

        return () => {
            if (justLongPressedTimer.current) {
                clearTimeout(justLongPressedTimer.current);
            }
        };
    }, [categoryId, equipmentId, typeEquipId]);

    // animar FAB al entrar/salir selectionMode
    useEffect(() => {
        Animated.timing(fabAnim, {
            toValue: selectionMode ? 1 : 0,
            duration: 260,
            easing: Easing.out(Easing.poly(4)),
            useNativeDriver: true,
        }).start();
    }, [selectionMode]);

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

    const handleTakePhoto = async (fieldId) => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== "granted") {
                alert("Permiso de cámara denegado");
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.8,
                allowsEditing: false,
            });

            if (result.cancelled) return;

            const uri = result.uri || result.assets?.[0]?.uri;
            if (!uri) return;

            const photoObj = {
                uri,
                name: `camera_${equipmentId}_${fieldId}_${Date.now()}.jpg`,
                type: "image/jpeg",
            };

            setFiles(prev => ({
                ...prev,
                [fieldId]: [
                    ...(prev[fieldId] || []),
                    photoObj,
                ],
            }));
        } catch (err) {
            console.error("Error al tomar foto:", err);
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

    // animación pequeña antes de eliminar (preview)
    const animatePreviewRemoveThen = async (cb) => {
        await new Promise(res => {
            Animated.sequence([
                Animated.timing(previewRemoveScale, { toValue: 0.88, duration: 120, useNativeDriver: true }),
                Animated.timing(previewRemoveScale, { toValue: 1, duration: 120, useNativeDriver: true }),
            ]).start(() => res());
        });
        cb && cb();
    };

    const handleRemoveImage = (fieldId, index) => {
        // animar botón, luego eliminar
        animatePreviewRemoveThen(() => {
            setFiles(prev => {
                const arr = [...(prev[fieldId] || [])];
                if (index >= 0 && index < arr.length) arr.splice(index, 1);
                return { ...prev, [fieldId]: arr };
            });
            setPreview(null);
        });
    };

    // selección: iniciar con long press
    const handleLongPressThumb = (fieldId, index) => {
        // indicar que hubo long press para bloquear el onPress que pueda venir después
        setJustLongPressed(true);
        if (justLongPressedTimer.current) clearTimeout(justLongPressedTimer.current);
        justLongPressedTimer.current = setTimeout(() => setJustLongPressed(false), 350);

        setSelectionMode(true);
        setSelected(prev => {
            const next = { ...prev };
            if (!next[fieldId]) next[fieldId] = new Set();
            next[fieldId].add(index);
            return next;
        });
        setPreview(null);
    };

    const toggleSelectThumb = (fieldId, index) => {
        setSelected(prev => {
            const next = { ...prev };
            if (!next[fieldId]) next[fieldId] = new Set();
            if (next[fieldId].has(index)) {
                next[fieldId].delete(index);
                if (next[fieldId].size === 0) delete next[fieldId];
            } else {
                next[fieldId].add(index);
            }
            // si quedó vacío, salir del modo selección
            const hasAny = Object.keys(next).length > 0;
            setSelectionMode(hasAny);
            return next;
        });
    };

    const isThumbSelected = (fieldId, index) => {
        return !!(selected[fieldId] && selected[fieldId].has(index));
    };

    // animación para FAB remove then bulk remove
    const animateFabRemoveThen = async (cb) => {
        await new Promise(res => {
            Animated.sequence([
                Animated.timing(fabRemoveScale, { toValue: 0.86, duration: 110, useNativeDriver: true }),
                Animated.timing(fabRemoveScale, { toValue: 1, duration: 150, useNativeDriver: true }),
            ]).start(() => res());
        });
        cb && cb();
    };

    // borrar todas las seleccionadas (bulk)
    const handleBulkRemove = () => {
        animateFabRemoveThen(() => {
            setFiles(prev => {
                const next = { ...prev };
                Object.keys(selected).forEach(fieldId => {
                    const toRemove = Array.from(selected[fieldId]).sort((a,b)=>b-a); // eliminar índices de mayor a menor
                    const arr = [...(next[fieldId] || [])];
                    toRemove.forEach(idx => {
                        if (idx >=0 && idx < arr.length) arr.splice(idx,1);
                    });
                    next[fieldId] = arr;
                });
                return next;
            });
            setSelected({});
            setSelectionMode(false);
            setPreview(null);
        });
    };

    const cancelSelectionMode = () => {
        setSelected({});
        setSelectionMode(false);
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#003366" />
            </View>
        );
    }

    return (
        <View style={styles.formWrapper}>
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 160 }}>
                {fields.map((field) => {
                    const newCount = (files[field.field_equip_id] || []).length;
                    const fileButtonLabel = newCount > 0
                        ? `Fotos nuevas (${newCount})`
                        : "Seleccionar foto";

                     return (
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
                                     <View style={styles.fileRow}>
                                         <TouchableOpacity
                                             style={styles.fileButton}
                                             onPress={() => handleFilePick(field.field_equip_id)}
                                         >
                                            <Ionicons name="images" size={16} color="#fff" style={{ marginRight: 8 }} />
                                             <Text style={styles.fileButtonText}>
                                                 {fileButtonLabel}
                                             </Text>
                                         </TouchableOpacity>
 
                                         <TouchableOpacity
                                             style={styles.cameraButton}
                                             onPress={() => handleTakePhoto(field.field_equip_id)}
                                             activeOpacity={0.8}
                                         >
                                             <Ionicons name="camera" size={18} color="#003366" style={{ marginRight: 8 }} />
                                             <Text style={styles.cameraButtonText}>Tomar foto</Text>
                                         </TouchableOpacity>
                                     </View>
 
                                    {/* Previsualización */}
                                    <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}>
                                        {/* Imágenes NUEVAS (aún no subidas) */}
                                        {(files[field.field_equip_id] || []).map((file, index) => (
                                            <TouchableOpacity
                                                key={index}
                                                onPress={() => {
                                                    if (justLongPressed) return;
                                                    if (selectionMode) {
                                                        toggleSelectThumb(field.field_equip_id, index);
                                                    } else {
                                                        setPreview({ uri: file.uri, isNew: true, fieldId: field.field_equip_id, index });
                                                    }
                                                }}
                                                onLongPress={() => handleLongPressThumb(field.field_equip_id, index)}
                                                style={{ marginRight: 8, marginBottom: 8 }}
                                            >
                                                <View style={{ position: "relative" }}>
                                                    <Image
                                                        source={{ uri: file.uri }}
                                                        style={{
                                                            width: 100,
                                                            height: 100,
                                                            borderRadius: 8,
                                                        }}
                                                        resizeMode="cover"
                                                    />
                                                    <View style={styles.newBadge}>
                                                        <Text style={styles.newBadgeText}>Nuevo</Text>
                                                    </View>

                                                    {/* overlay de selección */}
                                                    {isThumbSelected(field.field_equip_id, index) && (
                                                        <View style={styles.selectionOverlay}>
                                                            <View style={styles.selectionCheck}>
                                                                <Ionicons name="checkmark" size={18} color="#fff" />
                                                            </View>
                                                        </View>
                                                    )}
                                                </View>
                                            </TouchableOpacity>
                                        ))}

                                        {/* Imágenes del SERVIDOR */}
                                        {(
                                            (serverImages[field.field_equip_id] || [])
                                            .concat(field.field_equip_id === fields.find(f=>f.fields_type==="file")?.field_equip_id ? (serverImages["default"] || []) : [])
                                        ).map((imgName, idx) => {
                                            const uri = `${API_URL}/equipmentsController.php?action=getImage&name=${encodeURIComponent(imgName)}`;
                                            return (
                                                <TouchableOpacity
                                                    key={`srv_${idx}`}
                                                    onPress={() => {
                                                        if (justLongPressed) return;
                                                        if (selectionMode) {
                                                            // Si quieres selección múltiple de servidor, implementa aquí
                                                        } else {
                                                            setPreview({ uri, isNew: false, fieldId: field.field_equip_id, index: idx });
                                                        }
                                                    }}
                                                >
                                                    <Image
                                                        source={{ uri }}
                                                        style={{
                                                            width: 100,
                                                            height: 100,
                                                            borderRadius: 8,
                                                            marginRight: 8,
                                                            marginBottom: 8,
                                                        }}
                                                        resizeMode="cover"
                                                    />
                                                </TouchableOpacity>
                                            );
                                        })}
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
                                <>
                                    <TouchableOpacity
                                        style={styles.pickerContainer}
                                        onPress={() => setSelectModalId(field.field_equip_id)}
                                    >
                                        <Text style={{
                                            padding: 12,
                                            color: answers[field.field_equip_id] ? "#000" : "#888",
                                            fontSize: 16,
                                        }}>
                                            { (() => {
                                                const val = answers[field.field_equip_id];
                                                if (!val) return "Seleccione una opción...";
                                                const opt = field.options?.find(o => o.value === val);
                                                return opt ? opt.label : val;
                                            })() }
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </React.Fragment>
                    );
                })}

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

            {/* Modal de vista previa */}
            <Modal
                visible={!!preview}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setPreview(null)}
            >
                <View style={styles.previewOverlay}>
                    <View style={styles.previewTopRow}>
                        {preview?.isNew ? (
                            <View style={styles.previewBadge}>
                                <Text style={styles.previewBadgeText}>Nuevo</Text>
                            </View>
                        ) : (
                            <View style={{ width: 64 }} /> // espacio cuando no es nuevo
                        )}
                        <View style={{ flex: 1 }} />
                        {preview?.isNew && (
                            <Animated.View style={{ transform: [{ scale: previewRemoveScale }] }}>
                                <TouchableOpacity
                                    style={styles.previewRemoveButton}
                                    onPress={() => handleRemoveImage(preview.fieldId, preview.index)}
                                >
                                    <Ionicons name="trash" size={18} color="#fff" />
                                    <Text style={styles.previewRemoveText}>Quitar</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        )}
                        <TouchableOpacity
                            style={styles.previewCloseButton}
                            onPress={() => setPreview(null)}
                        >
                            <Ionicons name="close" size={18} color="#003366" />
                            <Text style={styles.previewCloseText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>

                    <Image
                        source={{ uri: preview?.uri }}
                        style={styles.previewImage}
                        resizeMode="contain"
                    />
                </View>
            </Modal>

            {/* Botones flotantes para eliminar selección múltiple (fijos en pantalla) — animados */}
            <Animated.View
                pointerEvents={selectionMode ? "auto" : "none"}
                style={[
                    styles.fabContainer,
                    {
                        opacity: fabAnim,
                        transform: [
                            {
                                translateY: fabAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] })
                            },
                            {
                                scale: fabAnim.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] })
                            }
                        ]
                    }
                ]}
            >
                <TouchableOpacity style={styles.fabCancel} onPress={cancelSelectionMode}>
                    <Ionicons name="close" size={20} color="#003366" />
                </TouchableOpacity>

                <Animated.View style={{ transform: [{ scale: fabRemoveScale }] }}>
                    <TouchableOpacity style={styles.fabRemove} onPress={handleBulkRemove}>
                        <Ionicons name="trash" size={20} color="#fff" />
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>

            {/* Modal personalizado para selects (fondo blanco, texto negro) */}
            {selectModalId && (
                <Modal
                    visible={true}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setSelectModalId(null)}
                >
                    <View style={styles.selectModalOverlay}>
                        <View style={styles.selectModalContent}>
                            <ScrollView>
                                {fields.find(f => f.field_equip_id === selectModalId)?.options?.map((opt) => {
                                    const isSelected = answers[selectModalId] === opt.value;
                                    return (
                                        <TouchableOpacity
                                            key={opt.option_id}
                                            style={[styles.selectOption, isSelected && styles.selectOptionSelected]}
                                            onPress={() => {
                                                handleChange(selectModalId, opt.value);
                                                setSelectModalId(null);
                                            }}
                                        >
                                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                                <Text style={[styles.selectOptionText, isSelected && styles.selectOptionTextSelected]}>
                                                    {opt.label}
                                                </Text>
                                                {isSelected && <Ionicons name="checkmark" size={20} color="#003366" />}
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                            <TouchableOpacity
                                style={styles.selectModalClose}
                                onPress={() => setSelectModalId(null)}
                            >
                                <Text style={styles.selectModalCloseText}>Cerrar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
}

function AnswersHeader() {
    const navigation = useNavigation();
    const route = useRoute();
    const { categoryId, equipmentId, typeEquipId, equipmentCode } = route.params;

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
                    Equipo: {equipmentCode || "Sin código"}
                </Text>
            </View>
        </SafeAreaView>
    );
}

export default function AnswersScreen() {
    return (
        <View style={{ flex: 1 }}>
            <AnswersHeader />
            <AnswersForm />
        </View>
    );
}


const styles = StyleSheet.create({
    formWrapper: {
        flex: 1,
        position: "relative",
    },
    container: {
        flex: 1,
        padding: 16,
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
        color: "#222",
        fontWeight: "500",
        fontSize: 16,
        backgroundColor: "#fff",
        minHeight: 48,
        borderRadius: 10,
        paddingHorizontal: 8,
    },
    fileRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    fileButton: {
        marginVertical: 10,
        backgroundColor: "#003366",
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 14,
        alignItems: "center",
        flexDirection: "row",
        minWidth: 140,
        justifyContent: "center",
        elevation: 2,
    },
    fileButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
    cameraButton: {
        marginLeft: 10,
        marginVertical: 10,
        backgroundColor: "#eef6ff",
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 12,
        alignItems: "center",
        flexDirection: "row",
        borderWidth: 2,
        borderColor: "#d0e9ff",
        flex: 1,
        justifyContent: "center",
        elevation: 1,
    },
    cameraButtonText: {
        color: "#003366",
        fontWeight: "700",
        fontSize: 15,
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
    previewOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.9)",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    previewImage: {
        width: "100%",
        height: "80%",
        borderRadius: 8,
    },
    previewTopRow: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    previewBadge: {
        backgroundColor: "#2e81ffff",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
    },
    previewBadgeText: {
        color: "#fff",
        fontWeight: "700",
    },
    previewRemoveButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#e53935",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.18,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    previewRemoveText: {
        color: "#fff",
        fontWeight: "700",
        marginLeft: 6,
    },
    previewCloseButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.95)",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#e6e6e6",
        marginLeft: 8,
        elevation: 2,
    },
    previewCloseText: {
        color: "#003366",
        fontWeight: "700",
        marginLeft: 6,
    },
    selectModalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    selectModalContent: {
        width: "90%",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
    },
    selectOption: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    selectOptionSelected: {
        backgroundColor: "#e6f3ff",
    },
    selectOptionTextSelected: {
        color: "#003366",
        fontWeight: "700",
    },
    selectOptionText: {
        fontSize: 16,
        color: "#333",
    },
    selectModalClose: {
        marginTop: 12,
        backgroundColor: "#003366",
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: "center",
    },
    selectModalCloseText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
    newBadge: {
        position: "absolute",
        top: 6,
        left: 6,
        backgroundColor: "#2e81ffff",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        elevation: 3,
    },
    newBadgeText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 12,
    },

    /* estilos selección múltiple */
    selectionOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.45)",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
    selectionCheck: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#4caf50",
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
    },

    /* FABes para bulk remove (ABSOLUTOS y fijos en pantalla) */
    fabContainer: {
        position: "absolute",
        right: 16,
        bottom: 47,
        flexDirection: "row",
        alignItems: "center",
        zIndex: 999,
    },
    fabRemove: {
        backgroundColor: "#e53935",
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        elevation: 6,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        marginLeft: 12,
    },
    fabCancel: {
        backgroundColor: "rgba(255,255,255,0.98)",
        width: 46,
        height: 46,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.12,
    },
});
