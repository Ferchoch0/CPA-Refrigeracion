import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.API_URL;

const TimelineItem = ({ item, isSelected, onPress, equipmentId, typeEquipId }) => {
  const navigation = useNavigation();

  // Calcula si está completo
  const isComplete =
    item.questions_total && item.questions_total > 0 &&
    item.questions_answered === item.questions_total;

  // El item está "activo" si está seleccionado o si está completo
  const isActive = isSelected || isComplete;

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Preguntas", {
          categoryId: item.field_category_id,
          equipmentId,
          typeEquipId,
        })
      }
      activeOpacity={0.8}
    >
      <View style={styles.timelineRow}>
        {/* Línea y punto */}
        <View style={styles.timelineTrack}>
          <View
            style={[
              styles.timelineCircle,
              isActive && styles.timelineCircleActive,
            ]}
          />
          <View style={styles.timelineLine} />
        </View>

        {/* Contenido */}
        <View style={styles.timelineContent}>
          <View style={isActive ? styles.taskCardHighlighted : styles.taskCardNormal}>
            <View style={styles.taskHeaderRow}>
              <Text style={isActive ? styles.taskTitleHighlighted : styles.taskTitleNormal}>
                {item.name}
              </Text>
              <Text style={isActive ? styles.taskTimeHighlighted : styles.taskTimeNormal}>
                Paso {item.ord}
              </Text>
            </View>
            <Text style={isActive ? styles.taskDescriptionHighlighted : styles.taskDescriptionNormal}>
              {item.description}
            </Text>

            {/* Barra de porcentaje */}
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${
                      item.questions_total && item.questions_total > 0
                        ? (item.questions_answered / item.questions_total) * 100
                        : 0
                    }%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {item.questions_total && item.questions_total > 0
                ? `${Math.round((item.questions_answered / item.questions_total) * 100)}% respondido`
                : "0% respondido"}
            </Text>

            {/* Check al final */}
            {isActive && (
              <View style={styles.taskCheckRow}>
                <Icon
                  name="checkmark-circle"
                  size={22}
                  color="#fff"
                  style={styles.taskCheckIcon}
                />
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export function TimelineScreen({ equipmentId, typeEquipId }) {
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
           `${API_URL}/equipmentsController.php?action=getQuestionsCategory&equipment_id=${equipmentId}`
        );
        const data = await response.json();
        if (!data.error) {
          setTasks(data);
        } else {
          console.log("Error al traer tareas:", data.error);
          setTasks([]);
        }
      } catch (error) {
        console.error("Error fetchTasks:", error);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    if (equipmentId) {
      fetchTasks();
    }
  }, [equipmentId]);

  if (loading) {
    return (
      <View style={[styles.timelineContainer, { justifyContent: "center", alignItems: "center" }]}>
        <Text>Cargando tareas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.timelineContainer}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.field_category_id.toString()}
        renderItem={({ item }) => (
          <TimelineItem
            item={item}
            isSelected={selectedTaskId === item.field_category_id}
            onPress={setSelectedTaskId}
            equipmentId={equipmentId}
            typeEquipId={typeEquipId}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  timelineContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  timelineRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  timelineTrack: {
    alignItems: "center",
    width: 30,
  },
  timelineCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#999",
    backgroundColor: "#fff",
    zIndex: 1,
  },
  timelineCircleActive: {
    backgroundColor: "#003366",
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: "#ddd",
    marginTop: -2,
  },
  timelineContent: {
    flex: 1,
  },
  taskCardHighlighted: {
    backgroundColor: "#003366",
    borderRadius: 16,
    padding: 16,
  },
  taskCardNormal: {
    paddingVertical: 6,
  },
  taskHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  taskTitleHighlighted: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  taskTimeHighlighted: {
    fontSize: 14,
    color: "#aaa",
  },
  taskDescriptionHighlighted: {
    color: "#ccc",
    marginTop: 4,
  },
  taskCheckRow: {
    marginTop: 12,
    alignItems: "flex-end",
  },
  taskCheckIcon: {
    marginLeft: "auto",
  },
  taskTitleNormal: {
    fontSize: 16,
    fontWeight: "bold",
  },
  taskTimeNormal: {
    fontSize: 14,
    color: "#888",
  },
  taskDescriptionNormal: {
    fontSize: 13,
    color: "#aaa",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#eee",
    borderRadius: 4,
    marginTop: 10,
    marginBottom: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#4FC3F7",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#aaa",
    marginBottom: 4,
    marginTop: 2,
    alignSelf: "flex-end",
  },
});
