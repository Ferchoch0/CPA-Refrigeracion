import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const tasks = [
{
    id: "1",
    title: "📦 Datos del equipo",
    description: "Información general del equipo y sus características principales.",
    time: "09:00 AM",
    avatars: [
      "https://randomuser.me/api/portraits/men/10.jpg",
      "https://randomuser.me/api/portraits/women/11.jpg",
      "https://randomuser.me/api/portraits/men/12.jpg",
    ],
  },
  {
    id: "2",
    title: "⚡ Datos eléctricos completos",
    description: "Parámetros eléctricos, protecciones y mediciones del sistema.",
    time: "09:30 AM",
    avatars: [
      "https://randomuser.me/api/portraits/men/20.jpg",
      "https://randomuser.me/api/portraits/women/21.jpg",
      "https://randomuser.me/api/portraits/men/22.jpg",
    ],
  },
  {
    id: "3",
    title: "🌀 Datos de ventiladores",
    description: "Características y condiciones de los ventiladores y motores asociados.",
    time: "10:00 AM",
    avatars: [
      "https://randomuser.me/api/portraits/men/30.jpg",
      "https://randomuser.me/api/portraits/women/31.jpg",
      "https://randomuser.me/api/portraits/men/32.jpg",
    ],
  },
  {
    id: "4",
    title: "🔩 Condiciones físicas",
    description: "Estado mecánico, vibraciones, balanceo y rodamientos.",
    time: "10:30 AM",
    avatars: [
      "https://randomuser.me/api/portraits/men/40.jpg",
      "https://randomuser.me/api/portraits/women/41.jpg",
      "https://randomuser.me/api/portraits/men/42.jpg",
    ],
  },
  {
    id: "5",
    title: "⚙️ Condiciones de operación",
    description: "Lecturas y consumos en condiciones reales de funcionamiento.",
    time: "11:00 AM",
    avatars: [
      "https://randomuser.me/api/portraits/men/50.jpg",
      "https://randomuser.me/api/portraits/women/51.jpg",
      "https://randomuser.me/api/portraits/men/52.jpg",
    ],
  },
  {
    id: "6",
    title: "🌡️ Mediciones de refrigeración",
    description: "Temperaturas, presiones y parámetros de ciclo frigorífico.",
    time: "11:30 AM",
    avatars: [
      "https://randomuser.me/api/portraits/men/60.jpg",
      "https://randomuser.me/api/portraits/women/61.jpg",
      "https://randomuser.me/api/portraits/men/62.jpg",
    ],
  },
  {
    id: "7",
    title: "🔧 Estado de componentes",
    description: "Condiciones de filtros, evaporador, condensador y tuberías.",
    time: "12:00 PM",
    avatars: [
      "https://randomuser.me/api/portraits/men/70.jpg",
      "https://randomuser.me/api/portraits/women/71.jpg",
      "https://randomuser.me/api/portraits/men/72.jpg",
    ],
  },
  {
    id: "8",
    title: "🛡️ Seguridad y protección",
    description: "Protecciones activas y estado del tablero eléctrico.",
    time: "12:30 PM",
    avatars: [
      "https://randomuser.me/api/portraits/men/80.jpg",
      "https://randomuser.me/api/portraits/women/81.jpg",
      "https://randomuser.me/api/portraits/men/82.jpg",
    ],
  },
  {
    id: "9",
    title: "🧹 Tareas realizadas",
    description: "Acciones de mantenimiento preventivo y correctivo ejecutadas.",
    time: "01:00 PM",
    avatars: [
      "https://randomuser.me/api/portraits/men/90.jpg",
      "https://randomuser.me/api/portraits/women/91.jpg",
      "https://randomuser.me/api/portraits/men/92.jpg",
    ],
  },
  {
    id: "10",
    title: "📋 Observaciones y recomendaciones",
    description: "Estado general del equipo y sugerencias de mejora.",
    time: "01:30 PM",
    avatars: [
      "https://randomuser.me/api/portraits/men/93.jpg",
      "https://randomuser.me/api/portraits/women/94.jpg",
      "https://randomuser.me/api/portraits/men/95.jpg",
    ],
  },
];

const TimelineItem = ({ item, isSelected, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(item.id)} activeOpacity={0.8}>
      <View style={styles.timelineRow}>
        {/* Línea y punto */}
        <View style={styles.timelineTrack}>
          <View
            style={[
              styles.timelineCircle,
              isSelected && styles.timelineCircleActive,
            ]}
          />
          <View style={styles.timelineLine} />
        </View>

        {/* Contenido */}
        <View style={styles.timelineContent}>
          {isSelected ? (
            <View style={styles.taskCardHighlighted}>
              <View style={styles.taskHeaderRow}>
                <Text style={styles.taskTitleHighlighted}>{item.title}</Text>
                <Text style={styles.taskTimeHighlighted}>{item.time}</Text>
              </View>
              <Text style={styles.taskDescriptionHighlighted}>
                {item.description}
              </Text>
              {item.avatars && (
                <View style={styles.taskAvatarRow}>
                  {item.avatars?.map((avatar, i) => (
                    <Image key={i} source={{ uri: avatar }} style={styles.taskAvatar} />
                  ))}
                  <Icon
                    name="checkmark-circle"
                    size={22}
                    color="#fff"
                    style={styles.taskCheckIcon}
                  />
                </View>
              )}
            </View>
          ) : (
            <View style={styles.taskCardNormal}>
              <View style={styles.taskHeaderRow}>
                <Text style={styles.taskTitleNormal}>{item.title}</Text>
                <Text style={styles.taskTimeNormal}>{item.time}</Text>
              </View>
              <Text style={styles.taskDescriptionNormal}>{item.description}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export function TimelineScreen() {
  const [selectedTaskId, setSelectedTaskId] = useState("1"); // por defecto la primera

  return (
    <View style={styles.timelineContainer}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TimelineItem
            item={item}
            isSelected={selectedTaskId === item.id}
            onPress={setSelectedTaskId}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  /* ===== Container ===== */
  timelineContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  timelineRow: {
    flexDirection: "row",
    marginBottom: 20,
  },

  /* ===== Track ===== */
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

  /* ===== Content ===== */
  timelineContent: {
    flex: 1,
  },

  /* ===== Highlighted Card ===== */
  taskCardHighlighted: {
    backgroundColor: "#003366",
    borderRadius: 16,
    padding: 16,
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
  taskAvatarRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  taskAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: -8,
    borderWidth: 2,
    borderColor: "#111",
  },
  taskCheckIcon: {
    marginLeft: "auto",
  },

  /* ===== Normal Card ===== */
  taskCardNormal: {
    paddingVertical: 6,
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
});
