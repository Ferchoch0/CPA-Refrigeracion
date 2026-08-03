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
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";

import {
    getQuestionsByType,
    getImagesByEquipmentId,
    getQuestionsCategory,
    getImageUrl,
    saveAnswers,
} from "../services/equipmentService";
import {
    getLocalQuestions,
    getLocalAnswers,
    savePendingAnswer,
    getQuestionCategoriesByEquipmentId,

} from "../services/database";


function AnswersForm() {
    const [fields, setFields] = useState([]);
    const [answers, setAnswers] = useState({});
    const [files, setFiles] = useState({});
    const [loading, setLoading] = useState(true);
    const [preview, setPreview] = useState(null);
    const route = useRoute();
    const { categoryId, equipmentId, typeEquipId } = route.params;
    const [showPicker, setShowPicker] = useState(null);
    const [selectModalId, setSelectModalId] = useState(null);

    const [selectionMode, setSelectionMode] = useState(false);
    const [selected, setSelected] = useState({});
    const [justLongPressed, setJustLongPressed] = useState(false);
    const justLongPressedTimer = useRef(null);

    const fabAnim = useRef(new Animated.Value(0)).current;
    const previewRemoveScale = useRef(new Animated.Value(1)).current;
    const fabRemoveScale = useRef(new Animated.Value(1)).current;

    const [serverImages, setServerImages] = useState({});
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        const applyPendingAnswers = async (baseAnswers, baseFiles) => {
            try {
                const { getPendingAnswers } = require('../services/database');
                const pending = await getPendingAnswers();
                const myPending = pending.filter(p => p.equipment_id == equipmentId);
                
                let mergedAnswers = { ...baseAnswers };
                let mergedFiles = { ...baseFiles };
                
                myPending.forEach(p => {
                    if (p.answers_json) {
                        try {
                            const pAns = JSON.parse(p.answers_json);
                            mergedAnswers = { ...mergedAnswers, ...pAns };
                        } catch (e) {}
                    }
                    if (p.files_json) {
                        try {
                            const pFiles = JSON.parse(p.files_json);
                            for (const [fieldId, fileList] of Object.entries(pFiles)) {
                                if (!mergedFiles[fieldId]) mergedFiles[fieldId] = [];
                                mergedFiles[fieldId] = [...mergedFiles[fieldId], ...fileList];
                            }
                        } catch(e) {}
                    }
                });
                return { mergedAnswers, mergedFiles };
            } catch(e) {
                console.log("Error aplicando respuestas pendientes:", e);
                return { mergedAnswers: baseAnswers, mergedFiles: baseFiles };
            }
        };

        const fetchFields = async () => {
            try {
                console.log("Buscando respuestas para equipmentId:", equipmentId);
                const data = await getQuestionsByType(categoryId, typeEquipId, equipmentId);
                console.log("Datos recibidos:", data);

                if (data.error) {
                    console.error("Error del servidor:", data.error);
                    // Fallback a SQLite
                    await loadFromSQLite();
                } else {
                    setFields(data.questions || []);
                    
                    const { mergedAnswers, mergedFiles } = await applyPendingAnswers(data.answers || {}, {});
                    setAnswers(mergedAnswers);
                    if (Object.keys(mergedFiles).length > 0) {
                        setFiles(mergedFiles);
                    }
                }
            } catch (error) {
                console.log("Sin conexión, cargando preguntas desde SQLite...");
                await loadFromSQLite();
            } finally {
                setLoading(false);
            }
        };

        const loadFromSQLite = async () => {
            try {
                console.log("📂 Cargando desde SQLite - categoryId:", categoryId, "typeEquipId:", typeEquipId, "equipmentId:", equipmentId);
                const localQuestions = await getLocalQuestions(categoryId, typeEquipId, equipmentId);
                const localAnswers = await getLocalAnswers(equipmentId);
                console.log("📂 Preguntas locales encontradas:", localQuestions.length);
                console.log("📂 Respuestas locales encontradas:", Object.keys(localAnswers).length);

                // --- DIAGNÓSTICO TEMPORAL: ver TODO lo que hay en la tabla questions ---
                const { getDatabase } = require('../services/database');
                const _db = getDatabase();
                const allForEquip = await _db.getAllAsync(
                    'SELECT field_equip_id, category_id, type_equip_id, name FROM questions WHERE category_id = ?',
                    [categoryId]
                );
                console.log("🔍 questions para category_id=" + categoryId + ":", JSON.stringify(allForEquip));
                const totalCount = await _db.getFirstAsync('SELECT COUNT(*) as cnt FROM questions');
                console.log("🔍 Total de filas en tabla questions:", totalCount?.cnt);
                // --- FIN DIAGNÓSTICO ---

                const { mergedAnswers, mergedFiles } = await applyPendingAnswers(localAnswers, {});

                setFields(localQuestions);
                setAnswers(mergedAnswers);
                if (Object.keys(mergedFiles).length > 0) {
                    setFiles(mergedFiles);
                }
            } catch (dbErr) {
                console.error("Error cargando datos locales:", dbErr);
                setFields([]);
                setAnswers({});
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'No se pudieron cargar los datos locales',
                    position: 'bottom',
                    visibilityTime: 3000,
                });
            }
        };

        const fetchServerImages = async () => {
            try {
                const data = await getImagesByEquipmentId(equipmentId);
                if (Array.isArray(data)) {
                    const grouped = {};
                    data.forEach(img => {
                        const fieldId = img.field_equip_id || "default";
                        if (!grouped[fieldId]) grouped[fieldId] = [];
                        grouped[fieldId].push(img.name);
                    });
                    setServerImages(grouped);
                    setIsOffline(false);
                }
            } catch (err) {
                setServerImages({});
                setIsOffline(true);
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
                Toast.show({
                    type: 'error',
                    text1: 'Permiso denegado',
                    text2: 'No se otorgó permiso para usar la cámara',
                    position: 'bottom',
                    visibilityTime: 3000,
                });
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
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Usuario no encontrado en almacenamiento local',
                    position: 'bottom',
                    visibilityTime: 3000,
                });
                return;
            }

            const user = JSON.parse(storedUser);
            const userId = user.id;

            const filteredAnswers = {};
            const filteredFiles = {};

            fields.forEach(field => {
                const fieldId = String(field.field_equip_id);
                if (answers[fieldId] !== undefined) {
                    filteredAnswers[fieldId] = answers[fieldId];
                }
                if (files[fieldId] !== undefined) {
                    filteredFiles[fieldId] = files[fieldId];
                }
            });

            const formData = new FormData();
            formData.append("action", "saveAnswers");
            formData.append("equipment_id", equipmentId);
            formData.append("user_id", userId);

            for (const [fieldId, value] of Object.entries(filteredAnswers)) {
                formData.append(`answer_${fieldId}`, value ?? "");
            }

            for (const [fieldId, fileList] of Object.entries(filteredFiles)) {
                fileList.forEach((file, index) => {
                    formData.append(`file_${fieldId}_${index}`, {
                        uri: file.uri,
                        name: file.name,
                        type: file.type,
                    });
                });
            }

            try {
                const response = await saveAnswers(formData);
                const text = await response.text();
                console.log("=== RESPUESTA DEL SERVIDOR (TEXTO CRUDO) ===");
                console.log(text);
                Toast.show({
                    type: 'success',
                    text1: 'Éxito',
                    text2: 'Respuestas guardadas correctamente',
                    position: 'bottom',
                    visibilityTime: 3000,
                });
            } catch (networkError) {
                // Sin conexión → guardar en cola local
                console.log("Sin conexión, guardando respuestas localmente...");
                await savePendingAnswer({
                    equipment_id: equipmentId,
                    user_id: userId,
                    answers: filteredAnswers,
                    files: filteredFiles,
                });
                Toast.show({
                    type: 'info',
                    text1: 'Guardado localmente',
                    text2: 'Se sincronizará automáticamente al volver a tener internet',
                    position: 'bottom',
                    visibilityTime: 4000,
                });
            }

        } catch (error) {
            console.error("Error en handleSubmit:", error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'No se pudieron guardar las respuestas',
                position: 'bottom',
                visibilityTime: 3000,
            });
        }
    };

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
        animatePreviewRemoveThen(() => {
            setFiles(prev => {
                const arr = [...(prev[fieldId] || [])];
                if (index >= 0 && index < arr.length) arr.splice(index, 1);
                return { ...prev, [fieldId]: arr };
            });
            setPreview(null);
        });
    };

    const handleLongPressThumb = (fieldId, index) => {
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
            const hasAny = Object.keys(next).length > 0;
            setSelectionMode(hasAny);
            return next;
        });
    };

    const isThumbSelected = (fieldId, index) => {
        return !!(selected[fieldId] && selected[fieldId].has(index));
    };

    const animateFabRemoveThen = async (cb) => {
        await new Promise(res => {
            Animated.sequence([
                Animated.timing(fabRemoveScale, { toValue: 0.86, duration: 110, useNativeDriver: true }),
                Animated.timing(fabRemoveScale, { toValue: 1, duration: 150, useNativeDriver: true }),
            ]).start(() => res());
        });
        cb && cb();
    };

    const handleBulkRemove = () => {
        animateFabRemoveThen(() => {
            setFiles(prev => {
                const next = { ...prev };
                Object.keys(selected).forEach(fieldId => {
                    const toRemove = Array.from(selected[fieldId]).sort((a, b) => b - a);
                    const arr = [...(next[fieldId] || [])];
                    toRemove.forEach(idx => {
                        if (idx >= 0 && idx < arr.length) arr.splice(idx, 1);
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

                                        {/* Imágenes del SERVIDOR o mensaje offline */}
                                        {isOffline ? (
                                            (files[field.field_equip_id] || []).length === 0 && (
                                                <View style={styles.offlineBanner}>
                                                    <Ionicons name="cloud-offline-outline" size={18} color="#e67e22" style={{ marginRight: 8 }} />
                                                    <Text style={styles.offlineBannerText}>
                                                        La galería no está disponible sin acceso a internet
                                                    </Text>
                                                </View>
                                            )
                                        ) : (
                                            (serverImages[field.field_equip_id] || [])
                                                .concat(field.field_equip_id === fields.find(f => f.fields_type === "file")?.field_equip_id ? (serverImages["default"] || []) : [])
                                        ).map((imgName, idx) => {
                                            const uri = getImageUrl(imgName);
                                            return (
                                                <TouchableOpacity
                                                    key={`srv_${idx}`}
                                                    onPress={() => {
                                                        if (justLongPressed) return;
                                                        if (selectionMode) {
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
                                            {(() => {
                                                const val = answers[field.field_equip_id];
                                                if (!val) return "Seleccione una opción...";
                                                const opt = field.options?.find(o => o.value === val);
                                                return opt ? opt.label : val;
                                            })()}
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
                            <View style={{ width: 64 }} />
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

            {/* Botones flotantes para eliminar selección múltiple */}
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

            {/* Modal personalizado para selects */}
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

    const [categoryName, setCategoryName] = useState("");

    useEffect(() => {
        const fetchCategoryName = async () => {
            try {
                const data = await getQuestionsCategory(equipmentId);
                if (Array.isArray(data)) {
                    const cat = data.find(c => c.field_category_id == categoryId);
                    setCategoryName(cat ? cat.name : "");
                }
            } catch (e) {
                // Fallback a SQLite para nombre de categoría
                try {
                    const localCats = await getQuestionCategoriesByEquipmentId(equipmentId);
                    const cat = localCats.find(c => c.field_category_id == categoryId);
                    setCategoryName(cat ? cat.name : "");
                } catch (dbErr) {
                    setCategoryName("");
                }
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

    /* FABes para bulk remove */
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
    offlineBanner: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff8f0",
        borderRadius: 10,
        padding: 12,
        borderLeftWidth: 3,
        borderLeftColor: "#e67e22",
        width: "100%",
    },
    offlineBannerText: {
        fontSize: 13,
        color: "#666",
        flex: 1,
    },
});
