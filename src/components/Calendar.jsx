import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";

const daysOfWeek = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];

export default function Calendar() {
  const today = new Date();
  const todayIndex = today.getDay();
  const todayDate = today.getDate();

  const week = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - today.getDay() + i);
    return {
      day: daysOfWeek[i],
      date: date.getDate(),
      isToday: i === todayIndex,
    };
  });

  return (
    <View style={styles.calendarContainer}>
      <View style={styles.weekRow}>
        {week.map((item, index) => (
          <View key={index} style={[styles.item, item.isToday && styles.selected]}>
            <Text style={[styles.date, item.isToday && styles.selectedText]}>
              {item.date}
            </Text>
            <Text style={[styles.day, item.isToday && styles.selectedText]}>
              {item.day}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: "#EAF4FA",
    marginBottom: 20,
    paddingBottom: 20,
    paddingEnd: 5,
    borderEndEndRadius: 40,
  },
  item: {
    alignItems: "center",
    padding: 10,
    borderRadius: 20,
    marginVertical: 10,
  },
  selected: {
    backgroundColor: "#003366",
  },
  weekRow: {
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "center",
    columnGap: 10,
    borderEndStartRadius: 60,
    borderEndEndRadius: 60,
  },
  date: {
    fontSize: 16,
    color: "#888",
  },
  day: {
    fontSize: 12,
    color: "#aaa",
  },
  selectedText: {
    color: "white",
    fontWeight: "bold",
  },
});

