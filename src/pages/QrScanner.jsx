import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const SCAN_SIZE = width * 0.7;

export default function QRScanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation();

  // ─── Pantalla de carga de permisos ──────────────────────────
  if (!permission) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="camera-outline" size={48} color="#003366" />
        <Text style={styles.loadingText}>Cargando cámara...</Text>
      </View>
    );
  }

  // ─── Solicitar permisos ─────────────────────────────────────
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <View style={styles.permissionCard}>
          <View style={styles.permissionIconCircle}>
            <Ionicons name="camera-outline" size={48} color="#003366" />
          </View>
          <Text style={styles.permissionTitle}>Acceso a la cámara</Text>
          <Text style={styles.permissionDesc}>
            Para escanear códigos QR necesitamos acceso a tu cámara.
          </Text>
          <TouchableOpacity
            style={styles.permissionBtn}
            onPress={requestPermission}
            activeOpacity={0.8}
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.permissionBtnText}>Dar permiso</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Escaneo de QR ──────────────────────────────────────────
  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    try {
      const equipo = JSON.parse(data);

      navigation.navigate("FormGeneral", {
        equipmentId: equipo.equipmentId,
        typeEquipId: equipo.typeEquipId,
        code: equipo.code,
        name: equipo.name,
        companyName: equipo.companyName,
      });
    } catch (error) {
      alert("QR inválido");
      setScanned(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Cámara de fondo */}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />

      {/* Overlay oscuro con recorte central */}
      <View style={styles.overlay}>
        {/* Header seguro */}
        <SafeAreaView edges={["top"]} style={styles.headerSafeArea}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Escáner QR</Text>
            <View style={{ width: 40 }} />
          </View>
        </SafeAreaView>

        {/* Zona superior oscura */}
        <View style={styles.overlayTop} />

        {/* Fila central: oscuro | recuadro | oscuro */}
        <View style={styles.scanRow}>
          <View style={styles.overlaySide} />
          <View style={styles.scanArea}>
            {/* Esquinas decorativas */}
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>
          <View style={styles.overlaySide} />
        </View>

        {/* Zona inferior oscura con instrucción y botón */}
        <View style={styles.overlayBottom}>
          <Text style={styles.instruction}>
            {scanned
              ? "Código escaneado"
              : "Alineá el código QR dentro del recuadro"}
          </Text>

          {scanned && (
            <TouchableOpacity
              style={styles.scanAgainBtn}
              onPress={() => setScanned(false)}
              activeOpacity={0.8}
            >
              <Ionicons
                name="scan-outline"
                size={20}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.scanAgainText}>Escanear de nuevo</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  // Loading
  loadingContainer: {
    flex: 1,
    backgroundColor: "#EAF4FA",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#003366",
    fontWeight: "600",
  },

  // Permission
  permissionContainer: {
    flex: 1,
    backgroundColor: "#003366",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  permissionCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 36,
    alignItems: "center",
    width: "100%",
    maxWidth: 340,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    elevation: 10,
  },
  permissionIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#EAF4FA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 10,
  },
  permissionDesc: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },
  permissionBtn: {
    flexDirection: "row",
    backgroundColor: "#003366",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: "center",
  },
  permissionBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Overlay
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  headerSafeArea: {
    backgroundColor: "rgba(0,0,0,0.55)",
    zIndex: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 56,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 0.5,
  },
  overlayTop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  scanRow: {
    flexDirection: "row",
    height: SCAN_SIZE,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  scanArea: {
    width: SCAN_SIZE,
    height: SCAN_SIZE,
    borderRadius: 20,
    overflow: "hidden",
  },
  overlayBottom: {
    flex: 1.3,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    paddingTop: 32,
  },

  // Corner accents
  corner: {
    position: "absolute",
    width: 28,
    height: 28,
    borderColor: "#0366c9",
    borderWidth: 4,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderTopLeftRadius: 14,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopRightRadius: 14,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: 14,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomRightRadius: 14,
  },

  // Instruction + button
  instruction: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  scanAgainBtn: {
    flexDirection: "row",
    backgroundColor: "#0366c9",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: "center",
    shadowColor: "#0366c9",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
  },
  scanAgainText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
