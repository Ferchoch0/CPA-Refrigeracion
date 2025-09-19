-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-09-2025 a las 19:29:28
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `cpa_refrigeration`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `answers`
--

CREATE TABLE `answers` (
  `answers_id` int(11) NOT NULL,
  `equipments_id` int(11) DEFAULT NULL,
  `field_equip_id` int(11) DEFAULT NULL,
  `value` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `answers`
--

INSERT INTO `answers` (`answers_id`, `equipments_id`, `field_equip_id`, `value`) VALUES
(7, 7, 101, 'no'),
(8, 7, 102, 'no'),
(9, 1, 1, 'uno'),
(10, 1, 2, 'uno'),
(11, 1, 3, '1'),
(12, 1, 5, 'no'),
(13, 1, 6, ''),
(14, 1, 101, 'si'),
(15, 1, 102, 'si'),
(16, 21, 101, 'no'),
(17, 21, 102, 'si'),
(27, 23, 101, 'no'),
(28, 23, 102, 'si'),
(29, 23, 104, '23'),
(33, 25, 1, 'prueba');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `assignment`
--

CREATE TABLE `assignment` (
  `assignment_id` int(11) NOT NULL,
  `client_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `assignment`
--

INSERT INTO `assignment` (`assignment_id`, `client_id`, `user_id`) VALUES
(4, 1, 2),
(5, 2, 2),
(6, 3, 2),
(7, 4, 2),
(8, 5, 2),
(9, 6, 4),
(10, 7, 4),
(11, 8, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `audit`
--

CREATE TABLE `audit` (
  `audit_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` text NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `status_action` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `audit`
--

INSERT INTO `audit` (`audit_id`, `user_id`, `action`, `date`, `status_action`) VALUES
(2, 3, 'Alta de cliente: Metalúrgica Delta SA', '2025-09-19 16:32:05', 'success'),
(3, 3, 'Actualización de técnico ID: 2', '2025-09-19 17:12:58', 'success'),
(4, 3, 'Actualización de pregunta ID: 101', '2025-09-19 17:25:10', 'success');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clients`
--

CREATE TABLE `clients` (
  `client_id` int(11) NOT NULL,
  `company_name` varchar(150) DEFAULT NULL,
  `personal_name` varchar(150) DEFAULT NULL,
  `contact_person` varchar(150) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `date_visit` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clients`
--

INSERT INTO `clients` (`client_id`, `company_name`, `personal_name`, `contact_person`, `password`, `address`, `phone`, `email`, `date_visit`) VALUES
(1, 'Tech Solutions SRL', 'Carlos Gómez', 'Laura Martínez', '1234pass', 'Av. Corrientes 1234, CABA', '1134567890', 'info@techsolutions.com', '2025-09-20'),
(2, 'Logística Express', 'María López', 'Juan Pérez', 'pass5678', 'Ruta 9 Km 45, Buenos Aires', '1145678901', 'contacto@logisticaexpress.com', '2025-09-22'),
(3, 'Construcciones Delta', 'José Ramírez', 'Ana Torres', 'delta2025', 'Calle San Martín 450, Córdoba', '3511234567', 'delta@construcciones.com', '2025-09-25'),
(4, 'TecnoSoluciones S.A.', '', 'María López', NULL, 'Calle Falsa 123, Ciudad', '11-1234-5678', 'contacto@tecnosoluciones.com', '2025-09-17'),
(5, 'Innova Soluciones SRL', '', 'Ana Gómez', NULL, 'Av. Siempre Viva 742, Córdoba', '+54 351 987-6543', 'info@innovasrl.com', '2025-09-18'),
(6, 'Cliente de Luna', '', 'Marcela', NULL, 'Calle Falsa 123', '115354556', 'cliente@example.com', '2025-09-26'),
(7, 'Metalúrgica Delta SA', '', 'Carlos Ramirez', NULL, 'Av. Siempre Viva 742', '1145678910', 'contacto@delta.com', '2025-09-30'),
(8, 'Metalúrgica Delta SA', '', 'Carlos Ramirez', NULL, 'Av. Siempre Viva 742', '1145678910', 'contacto@delta.com', '2025-09-30');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `data_equipments`
--

CREATE TABLE `data_equipments` (
  `data_equip_id` int(11) NOT NULL,
  `type_equip_id` int(11) DEFAULT NULL,
  `type_fields` varchar(150) DEFAULT NULL,
  `mandatory` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `equipments`
--

CREATE TABLE `equipments` (
  `equipment_id` int(11) NOT NULL,
  `client_id` int(11) DEFAULT NULL,
  `type_equip_id` int(11) DEFAULT NULL,
  `code` varchar(100) DEFAULT NULL,
  `status` enum('Activo','Activo: Requiere revisión','Inactivo','Dado de baja') NOT NULL DEFAULT 'Activo',
  `placement` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `equipments`
--

INSERT INTO `equipments` (`equipment_id`, `client_id`, `type_equip_id`, `code`, `status`, `placement`) VALUES
(1, 1, 1, 'SP-001', 'Activo: Requiere revisión', NULL),
(2, 1, 5, 'CF-001', 'Inactivo', NULL),
(3, 2, 2, 'RT-001', 'Activo', NULL),
(4, 2, 7, 'FR-001', 'Activo', NULL),
(5, 3, 3, 'CT-001', 'Activo', NULL),
(6, 3, 8, 'EX-001', 'Activo', NULL),
(7, 1, 5, 'CF-002', 'Activo', ''),
(8, 1, 5, 'CF-003', 'Activo', ''),
(9, 1, 1, 'SP-002', 'Dado de baja', 'interior'),
(10, 1, 6, 'HR-001', 'Activo', ''),
(11, 1, 7, 'FR-002', 'Activo', ''),
(12, 1, 8, 'EX-002', 'Inactivo', ''),
(13, 3, 8, 'EX-003', 'Activo', ''),
(14, 2, 4, 'CS-001', 'Activo', 'interior'),
(15, 2, 6, 'HR-002', 'Activo', ''),
(16, 3, 2, 'RT-002', 'Activo', 'interior'),
(17, 3, 1, 'SP-003', 'Activo', 'exterior'),
(18, 3, 6, 'HR-003', 'Activo', ''),
(19, 1, 6, 'HR-004', 'Activo', ''),
(20, 1, 9, 'HC001', 'Activo', ''),
(21, 1, 9, 'HC002', 'Activo', ''),
(22, 2, 7, 'FR003', 'Activo', ''),
(23, 1, 4, 'CS002', 'Activo', 'interior'),
(24, 1, 2, 'RT003', 'Dado de baja', 'exterior'),
(25, 6, 4, 'CS003', 'Activo', 'exterior');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `equipments_history`
--

CREATE TABLE `equipments_history` (
  `history_equip_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `equipment_id` int(11) DEFAULT NULL,
  `action` text DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `equipments_history`
--

INSERT INTO `equipments_history` (`history_equip_id`, `user_id`, `equipment_id`, `action`, `date`) VALUES
(2, 2, 23, 'Llenado de formulario', '2025-09-19 05:47:28'),
(3, 2, 23, 'Llenado de formulario', '2025-09-19 05:47:53'),
(4, 2, 23, 'Llenado de formulario', '2025-09-19 05:48:21'),
(5, 2, 23, 'Llenado de formulario', '2025-09-19 06:01:53'),
(6, 4, 25, 'Llenado de formulario', '2025-09-19 06:09:14');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fields_category`
--

CREATE TABLE `fields_category` (
  `field_category_id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `ord` int(11) DEFAULT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `fields_category`
--

INSERT INTO `fields_category` (`field_category_id`, `name`, `ord`, `description`) VALUES
(1, '📦 Datos del equipo', 1, 'Información general del equipo y sus características principales.'),
(2, '⚡ Datos eléctricos completos', 2, 'Parámetros eléctricos, protecciones y mediciones del sistema.'),
(3, '🌀 Datos de ventiladores', 3, 'Características y condiciones de los ventiladores y motores asociados.'),
(4, '⚙️ Condiciones de operación', 4, 'Lecturas y consumos en condiciones reales de funcionamiento.'),
(5, '🌡️ Mediciones de refrigeración', 5, 'Temperaturas, presiones y parámetros de ciclo frigorífico.'),
(6, '🔧 Estado de componentes', 6, 'Condiciones de filtros, evaporador, condensador y tuberías.'),
(7, '🛡️ Seguridad y protección', 7, 'Protecciones activas y estado del tablero eléctrico.'),
(8, '🧹 Tareas realizadas', 8, 'Acciones de mantenimiento preventivo y correctivo ejecutadas.'),
(9, '📋 Observaciones', 9, 'Estado general del equipo y sugerencias de mejora.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fields_equipment`
--

CREATE TABLE `fields_equipment` (
  `field_equip_id` int(11) NOT NULL,
  `field_category_id` int(11) DEFAULT NULL,
  `name` varchar(150) DEFAULT NULL,
  `fields_type` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `fields_equipment`
--

INSERT INTO `fields_equipment` (`field_equip_id`, `field_category_id`, `name`, `fields_type`, `description`) VALUES
(1, 1, 'Marca', 'text', 'Marca del equipo'),
(2, 1, 'Modelo', 'text', 'Modelo del equipo'),
(3, 1, 'N° de serie', 'text', 'Número de serie del equipo'),
(4, 1, 'Foto del equipo', 'file', 'Subir foto del equipo'),
(5, 1, 'Código interno/activo de la empresa', 'text', 'Si aplica'),
(6, 1, 'Capacidad frigorífica nominal', 'text', 'BTU/h, kW o TR'),
(7, 1, 'Capacidad calorífica', 'text', 'Si es bomba de calor'),
(8, 1, 'Potencia eléctrica nominal', 'text', 'kW o HP'),
(9, 1, 'Consumo nominal', 'number', 'Amperios (A)'),
(10, 1, 'Tensión / Fases / Frecuencia', 'text', 'Ej: 220V – 1F – 50Hz'),
(11, 1, 'Tipo de compresor', 'select', 'Rotativo, Scroll, Alternativo, Inverter, Semihermético, Tornillo, Centrífugo'),
(12, 1, 'Cantidad de compresores', 'number', 'Cantidad total de compresores'),
(13, 1, 'Tipo de aceite de compresor', 'text', 'Marca / ISO / Viscosidad'),
(14, 1, 'Cantidad de aceite de compresor', 'text', 'ml o litros'),
(15, 1, 'Tipo de refrigerante y carga nominal', 'text', 'Ej: R410A, 5kg'),
(16, 1, 'Tipo de expansión', 'select', 'Válvula termostática, electrónica, capilar, flotador, etc.'),
(17, 1, 'Cantidad de circuitos de refrigerante', 'number', 'Número de circuitos'),
(18, 1, 'Año de fabricación', 'number', 'Año de fabricación del equipo'),
(19, 1, 'Año de instalación / puesta en marcha', 'number', 'Año de instalación o puesta en marcha'),
(20, 1, 'Ubicación física del equipo', 'text', 'Ej: sala de máquinas, techo, cocina, depósito, etc.'),
(21, 1, 'Tipo de condensación', 'select', 'Aire, agua, evaporativo'),
(22, 1, 'Dimensiones físicas del equipo', 'text', 'Largo x Ancho x Alto'),
(23, 1, 'Peso del equipo', 'number', 'Peso en kg (opcional)'),
(24, 2, 'Tensión nominal de alimentación (V)', 'text', 'Voltaje nominal de la red'),
(25, 2, 'Fases', 'select', 'Monofásico / Trifásico'),
(26, 2, 'Frecuencia (Hz)', 'number', 'Frecuencia de operación'),
(27, 2, 'Potencia eléctrica total (kW)', 'text', 'Potencia total en kW'),
(28, 2, 'Factor de potencia (cos φ)', 'text', 'Factor de potencia'),
(29, 2, 'Tipo de protección principal', 'select', 'Breaker / Fusible / Térmico'),
(30, 2, 'Calibre del breaker o fusibles (A)', 'number', 'Amperios'),
(31, 2, 'Tipo de relé térmico o electrónico', 'text', 'Descripción del relé'),
(32, 2, 'Dispositivo diferencial / disyuntor', 'text', 'Sí/No y sensibilidad en mA'),
(33, 2, 'Contactores', 'text', 'Marca y capacidad en A'),
(34, 2, 'Estado del cableado', 'select', 'Bueno / Desgaste / Recalentamiento'),
(35, 2, 'Sección de conductor (mm²)', 'number', 'Sección del conductor en mm²'),
(36, 2, 'Puesta a tierra', 'text', 'Sí/No, resistencia en ohmios si aplica'),
(37, 2, 'Corriente nominal (RLA)', 'number', 'Rated Load Amps'),
(38, 2, 'Corriente de arranque (LRA)', 'number', 'Locked Rotor Amps'),
(39, 2, 'Tensión medida en bornes (V)', 'number', 'Voltaje medido en bornes'),
(40, 2, 'Corriente medida en cada fase (A)', 'text', 'Valores por fase'),
(41, 2, 'Resistencia de bobinados (Ω)', 'text', 'Opcional'),
(42, 2, 'Aislamiento de bobinas (MΩ)', 'text', 'Con megóhmetro, opcional'),
(43, 2, 'Tipo de arranque', 'select', 'Directo, Estrella-Triángulo, Inverter, Soft Starter'),
(44, 2, 'Condensador de arranque (μF)', 'number', 'Microfaradios'),
(45, 2, 'Condensador de marcha (μF)', 'number', 'Microfaradios'),
(46, 2, 'Estado de los capacitores', 'select', 'OK / Fuera de rango'),
(47, 3, 'Cantidad de ventiladores en condensador', 'number', 'Cantidad total de ventiladores en condensador'),
(48, 3, 'Cantidad de ventiladores en evaporador', 'number', 'Cantidad total de ventiladores en evaporador'),
(49, 3, 'Tipo de ventilador', 'select', 'Axial, helicoidal, centrífugo simple/doble, tangencial'),
(50, 3, 'Diámetro de aspa (mm)', 'number', 'Diámetro del aspa en milímetros'),
(51, 3, 'Material del aspa', 'select', 'Plástico, aluminio, acero'),
(52, 3, 'Sentido de giro', 'select', 'Horario / Antihorario'),
(53, 3, 'Marca / Modelo', 'text', 'Marca y modelo del ventilador'),
(54, 3, 'Potencia nominal', 'text', 'Potencia nominal en W o HP'),
(55, 3, 'Tensión de alimentación (V)', 'text', 'Voltaje de alimentación'),
(56, 3, 'Fases', 'select', '1F / 3F'),
(57, 3, 'Corriente nominal (A)', 'number', 'Corriente nominal en amperios'),
(58, 3, 'Corriente medida (A)', 'number', 'Corriente real medida en amperios'),
(59, 3, 'Frecuencia (Hz)', 'number', 'Frecuencia de operación'),
(60, 3, 'RPM nominal', 'number', 'Revoluciones por minuto nominales'),
(61, 3, 'Tipo de motor', 'select', 'PSC, Shaded pole, BLDC, Inverter, Trifásico'),
(62, 3, 'Grado de protección IP', 'text', 'Ej: IP44, IP55'),
(63, 3, 'Clase de aislamiento', 'select', 'B, F, H'),
(64, 3, 'Estado de rodamientos', 'select', 'Bueno / Desgaste / Ruido'),
(65, 3, 'Vibraciones', 'select', 'Normal / Excesiva'),
(66, 3, 'Balanceo de aspas', 'select', 'OK / Desbalanceado'),
(67, 3, 'Estado del capacitor del ventilador', 'text', 'μF nominal vs real'),
(68, 4, 'Voltaje de alimentación medido (V)', 'number', 'Voltaje de alimentación medido en el equipo'),
(69, 4, 'Corriente medida en compresor (A)', 'number', 'Corriente eléctrica medida en el compresor'),
(70, 4, 'Corriente medida en ventiladores (A)', 'number', 'Corriente eléctrica medida en los ventiladores'),
(71, 4, 'Potencia total consumida (kW)', 'number', 'Potencia total consumida por el equipo'),
(72, 5, 'Temperatura de succión (°C)', 'number', 'Temperatura del gas en la línea de succión'),
(73, 5, 'Temperatura de descarga (°C)', 'number', 'Temperatura del gas en la línea de descarga'),
(74, 5, 'Presión de succión (psi o bar)', 'number', 'Presión medida en la línea de succión'),
(75, 5, 'Presión de descarga (psi o bar)', 'number', 'Presión medida en la línea de descarga'),
(76, 5, 'Subenfriamiento (°C)', 'number', 'Grados de subenfriamiento del refrigerante'),
(77, 5, 'Sobrecalentamiento (°C)', 'number', 'Grados de sobrecalentamiento del refrigerante'),
(78, 5, 'Temperatura ambiente (°C)', 'number', 'Temperatura del ambiente donde está el equipo'),
(79, 5, 'Temperatura en cámara/cuarto/frigorífico (°C)', 'number', 'Temperatura medida dentro de la cámara o cuarto'),
(80, 6, 'Filtros (limpios / sucios)', 'text', 'Estado de los filtros: limpio o sucio'),
(81, 6, 'Evaporador (limpio / sucio / con escarcha)', 'text', 'Estado del evaporador'),
(82, 6, 'Condensador (limpio / sucio)', 'text', 'Estado del condensador'),
(83, 6, 'Ventiladores (funcionando / ruido / desgaste)', 'text', 'Estado de los ventiladores'),
(84, 6, 'Válvula de expansión / capilar (normal / obstrucción / fuga)', 'text', 'Estado de la válvula de expansión o capilar'),
(85, 6, 'Nivel de aceite (correcto / bajo / contaminado)', 'text', 'Nivel y estado del aceite del compresor'),
(86, 6, 'Estado de aislamiento de tuberías (bueno / deteriorado)', 'text', 'Condición del aislamiento de las tuberías'),
(87, 6, 'Estado general de cañerías (golpes, corrosión, fugas)', 'text', 'Revisión del estado general de las cañerías'),
(88, 7, 'Funcionamiento de presostatos (alta / baja)', 'text', 'Revisión de funcionamiento de presostato'),
(89, 7, 'Termostato / control electrónico', 'text', 'Verificación de termostato o control electrónico'),
(90, 7, 'Protecciones eléctricas (disyuntores, contactores, relés)', 'text', 'Estado de protecciones eléctricas'),
(91, 7, 'Estado del tablero eléctrico (OK / defectos)', 'text', 'Revisión del tablero eléctrico'),
(92, 7, 'Puesta a tierra (verificación)', 'text', 'Verificación de la puesta a tierra del equipo'),
(93, 8, 'Limpieza de filtros', 'text', 'Registro de limpieza de filtros'),
(94, 8, 'Limpieza de evaporador', 'text', 'Registro de limpieza del evaporador'),
(95, 8, 'Limpieza de condensador', 'text', 'Registro de limpieza del condensador'),
(96, 8, 'Revisión de fugas (detector, agua jabonosa, etc.)', 'text', 'Detección y revisión de posibles fugas'),
(97, 8, 'Ajuste de conexiones eléctricas', 'text', 'Verificación y ajuste de conexiones eléctricas'),
(98, 8, 'Carga de gas (indicar cantidad)', 'text', 'Cantidad de gas refrigerante cargada'),
(99, 8, 'Recuperación de gas (indicar cantidad)', 'text', 'Cantidad de gas recuperada'),
(100, 8, 'Cambio de repuestos (filtros, contactores, relés, capacitores, etc.)', 'text', 'Registro de repuestos cambiados'),
(101, 9, 'Estado general del equipo elegido', 'text', 'Condición general del equipo tras la revisión'),
(102, 9, 'Repuestos recomendados', 'text', 'Repuestos sugeridos para mantenimiento o reemplazo'),
(103, 9, 'Próxima fecha de mantenimiento', 'date', 'Fecha sugerida para el próximo mantenimiento'),
(104, 9, 'Estados', 'text', 'estados');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `field_options`
--

CREATE TABLE `field_options` (
  `option_id` int(11) NOT NULL,
  `field_equip_id` int(11) NOT NULL,
  `value` varchar(100) NOT NULL,
  `label` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `field_options`
--

INSERT INTO `field_options` (`option_id`, `field_equip_id`, `value`, `label`) VALUES
(1, 11, 'rotativo', 'Rotativo'),
(2, 11, 'scroll', 'Scroll'),
(3, 11, 'alternativo', 'Alternativo'),
(4, 11, 'inverter', 'Inverter'),
(5, 11, 'semihermetico', 'Semihermético'),
(6, 11, 'tornillo', 'Tornillo'),
(7, 11, 'centrifugo', 'Centrífugo'),
(8, 16, 'termostatica', 'Válvula termostática'),
(9, 16, 'electronica', 'Electrónica'),
(10, 16, 'capilar', 'Capilar'),
(11, 16, 'flotador', 'Flotador'),
(12, 21, 'aire', 'Aire'),
(13, 21, 'agua', 'Agua'),
(14, 21, 'evaporativo', 'Evaporativo'),
(15, 25, 'monofasico', 'Monofásico'),
(16, 25, 'trifasico', 'Trifásico'),
(17, 29, 'breaker', 'Breaker'),
(18, 29, 'fusible', 'Fusible'),
(19, 29, 'termico', 'Térmico'),
(20, 34, 'bueno', 'Bueno'),
(21, 34, 'desgaste', 'Desgaste'),
(22, 34, 'recalentamiento', 'Recalentamiento'),
(23, 43, 'directo', 'Directo'),
(24, 43, 'estrella-triangulo', 'Estrella-Triángulo'),
(25, 43, 'inverter', 'Inverter'),
(26, 43, 'softstarter', 'Soft Starter'),
(27, 46, 'ok', 'OK'),
(28, 46, 'fuera_de_rango', 'Fuera de rango'),
(34, 51, 'plastico', 'Plástico'),
(35, 51, 'aluminio', 'Aluminio'),
(36, 51, 'acero', 'Acero'),
(37, 52, 'horario', 'Horario'),
(38, 52, 'antihorario', 'Antihorario'),
(39, 56, '1f', '1F'),
(40, 56, '3f', '3F'),
(41, 61, 'psc', 'PSC'),
(42, 61, 'shaded_pole', 'Shaded Pole'),
(43, 61, 'bldc', 'BLDC'),
(44, 61, 'inverter', 'Inverter'),
(45, 61, 'trifasico', 'Trifásico'),
(46, 63, 'b', 'B'),
(47, 63, 'f', 'F'),
(48, 63, 'h', 'H'),
(49, 64, 'bueno', 'Bueno'),
(50, 64, 'desgaste', 'Desgaste'),
(51, 64, 'ruido', 'Ruido'),
(52, 65, 'normal', 'Normal'),
(53, 65, 'excesiva', 'Excesiva'),
(54, 66, 'ok', 'OK'),
(55, 66, 'desbalanceado', 'Desbalanceado'),
(58, 49, 'axial', 'Axial'),
(59, 49, 'helicoidal', 'Helicoidal'),
(60, 49, 'centrífugo_simple', 'Centrífugo_simple'),
(61, 49, 'centrífugo_doble', 'Centrífugo_doble'),
(62, 49, 'tangencial', 'Tangencial');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `files`
--

CREATE TABLE `files` (
  `files_id` int(11) NOT NULL,
  `equipment_id` int(11) DEFAULT NULL,
  `name` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `images`
--

CREATE TABLE `images` (
  `image_id` int(11) NOT NULL,
  `equipment_id` int(11) DEFAULT NULL,
  `name` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permissions`
--

CREATE TABLE `permissions` (
  `permission_id` int(11) NOT NULL,
  `key` varchar(100) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `rol_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`rol_id`, `name`, `description`) VALUES
(1, 'admin', 'Administrador con todos los permisos'),
(2, 'tecnico', 'Técnico responsable de realizar visitas y registrar clientes');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol_permissions`
--

CREATE TABLE `rol_permissions` (
  `rol_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `type_equipments`
--

CREATE TABLE `type_equipments` (
  `type_equip_id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `initial` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `type_equipments`
--

INSERT INTO `type_equipments` (`type_equip_id`, `name`, `initial`) VALUES
(1, 'Split', 'SP'),
(2, 'Rooftop', 'RT'),
(3, 'Centrales', 'CT'),
(4, 'Cassette', 'CS'),
(5, 'Camara Frigorifica', 'CF'),
(6, 'Heladera Residencial', 'HR'),
(7, 'Freezer', 'FR'),
(8, 'Exhibidoras', 'EX'),
(9, 'Heladeras Comercial', 'HC');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `rol_id` int(11) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `dni` varchar(100) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT 'image-profile',
  `status` enum('disponible','en_servicio','desconectado') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`user_id`, `rol_id`, `name`, `dni`, `email`, `password`, `phone`, `profile_image`, `status`) VALUES
(2, 2, 'Juan Carlos', '44646567', 'tecnico@example.com', '$2y$10$lj9x4L/jlIkyOqIBu897Tem7aoccBnACBLh7Abrak/8kJBd2yA7b2', '3512345678', 'profile2_1758177176.jpg', 'disponible'),
(3, 1, 'Administrador', NULL, 'admin@example.com', '$2y$10$AqFyHATTtiqKYNXWhDYGWuiAQJAsQgBD95Uu38GkQH6fhWUCDLiWO', '1153434343', NULL, 'disponible'),
(4, 2, 'Luna', '12345678', 'luna@example.com', '$2y$10$fNUzyeZFRhX.smY2wG7WB.0.0APE911/tI4G1tno1VL1ZJAJ831EK', '1153444345', 'profile4_1758261916.jpg', 'disponible'),
(5, 2, 'Mati', '85397522', 'mati@example.com', '$2y$10$8cUUEtbzaYTomoD8I9V.a.ew1KFZjuG2iKlFYMKvbisJIahR4PfoG', '1154356645', 'image-profile', 'disponible');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `answers`
--
ALTER TABLE `answers`
  ADD PRIMARY KEY (`answers_id`),
  ADD UNIQUE KEY `unique_answer` (`equipments_id`,`field_equip_id`),
  ADD KEY `fk_answers_field` (`field_equip_id`);

--
-- Indices de la tabla `assignment`
--
ALTER TABLE `assignment`
  ADD PRIMARY KEY (`assignment_id`),
  ADD KEY `fk_assignment_clients` (`client_id`),
  ADD KEY `fk_assignment_users` (`user_id`);

--
-- Indices de la tabla `audit`
--
ALTER TABLE `audit`
  ADD PRIMARY KEY (`audit_id`),
  ADD KEY `fk_audit_users` (`user_id`);

--
-- Indices de la tabla `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`client_id`);

--
-- Indices de la tabla `data_equipments`
--
ALTER TABLE `data_equipments`
  ADD PRIMARY KEY (`data_equip_id`),
  ADD KEY `fk_dataequip_type` (`type_equip_id`);

--
-- Indices de la tabla `equipments`
--
ALTER TABLE `equipments`
  ADD PRIMARY KEY (`equipment_id`),
  ADD KEY `fk_equipments_clients` (`client_id`),
  ADD KEY `fk_equipments_type` (`type_equip_id`);

--
-- Indices de la tabla `equipments_history`
--
ALTER TABLE `equipments_history`
  ADD PRIMARY KEY (`history_equip_id`),
  ADD KEY `fk_history_users` (`user_id`),
  ADD KEY `fk_history_equipment` (`equipment_id`);

--
-- Indices de la tabla `fields_category`
--
ALTER TABLE `fields_category`
  ADD PRIMARY KEY (`field_category_id`);

--
-- Indices de la tabla `fields_equipment`
--
ALTER TABLE `fields_equipment`
  ADD PRIMARY KEY (`field_equip_id`),
  ADD KEY `fk_fieldequip_category` (`field_category_id`);

--
-- Indices de la tabla `field_options`
--
ALTER TABLE `field_options`
  ADD PRIMARY KEY (`option_id`),
  ADD KEY `fk_field_equipment` (`field_equip_id`);

--
-- Indices de la tabla `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`files_id`),
  ADD KEY `fk_files_equipment` (`equipment_id`);

--
-- Indices de la tabla `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`image_id`),
  ADD KEY `fk_images_equipment` (`equipment_id`);

--
-- Indices de la tabla `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`permission_id`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`rol_id`);

--
-- Indices de la tabla `rol_permissions`
--
ALTER TABLE `rol_permissions`
  ADD PRIMARY KEY (`rol_id`,`permission_id`),
  ADD KEY `fk_rolpermissions_permissions` (`permission_id`);

--
-- Indices de la tabla `type_equipments`
--
ALTER TABLE `type_equipments`
  ADD PRIMARY KEY (`type_equip_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_users_roles` (`rol_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `answers`
--
ALTER TABLE `answers`
  MODIFY `answers_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de la tabla `assignment`
--
ALTER TABLE `assignment`
  MODIFY `assignment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `audit`
--
ALTER TABLE `audit`
  MODIFY `audit_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `clients`
--
ALTER TABLE `clients`
  MODIFY `client_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `data_equipments`
--
ALTER TABLE `data_equipments`
  MODIFY `data_equip_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `equipments`
--
ALTER TABLE `equipments`
  MODIFY `equipment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `equipments_history`
--
ALTER TABLE `equipments_history`
  MODIFY `history_equip_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `fields_category`
--
ALTER TABLE `fields_category`
  MODIFY `field_category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `fields_equipment`
--
ALTER TABLE `fields_equipment`
  MODIFY `field_equip_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- AUTO_INCREMENT de la tabla `field_options`
--
ALTER TABLE `field_options`
  MODIFY `option_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT de la tabla `files`
--
ALTER TABLE `files`
  MODIFY `files_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `images`
--
ALTER TABLE `images`
  MODIFY `image_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `permissions`
--
ALTER TABLE `permissions`
  MODIFY `permission_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `rol_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `type_equipments`
--
ALTER TABLE `type_equipments`
  MODIFY `type_equip_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `answers`
--
ALTER TABLE `answers`
  ADD CONSTRAINT `fk_answers_equipment` FOREIGN KEY (`equipments_id`) REFERENCES `equipments` (`equipment_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_answers_field` FOREIGN KEY (`field_equip_id`) REFERENCES `fields_equipment` (`field_equip_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `assignment`
--
ALTER TABLE `assignment`
  ADD CONSTRAINT `fk_assignment_clients` FOREIGN KEY (`client_id`) REFERENCES `clients` (`client_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_assignment_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `audit`
--
ALTER TABLE `audit`
  ADD CONSTRAINT `fk_audit_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `data_equipments`
--
ALTER TABLE `data_equipments`
  ADD CONSTRAINT `fk_dataequip_type` FOREIGN KEY (`type_equip_id`) REFERENCES `type_equipments` (`type_equip_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `equipments`
--
ALTER TABLE `equipments`
  ADD CONSTRAINT `fk_equipments_clients` FOREIGN KEY (`client_id`) REFERENCES `clients` (`client_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_equipments_type` FOREIGN KEY (`type_equip_id`) REFERENCES `type_equipments` (`type_equip_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `equipments_history`
--
ALTER TABLE `equipments_history`
  ADD CONSTRAINT `fk_history_equipment` FOREIGN KEY (`equipment_id`) REFERENCES `equipments` (`equipment_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_history_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `fields_equipment`
--
ALTER TABLE `fields_equipment`
  ADD CONSTRAINT `fk_fieldequip_category` FOREIGN KEY (`field_category_id`) REFERENCES `fields_category` (`field_category_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `field_options`
--
ALTER TABLE `field_options`
  ADD CONSTRAINT `fk_field_equipment` FOREIGN KEY (`field_equip_id`) REFERENCES `fields_equipment` (`field_equip_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `files`
--
ALTER TABLE `files`
  ADD CONSTRAINT `fk_files_equipment` FOREIGN KEY (`equipment_id`) REFERENCES `equipments` (`equipment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `images`
--
ALTER TABLE `images`
  ADD CONSTRAINT `fk_images_equipment` FOREIGN KEY (`equipment_id`) REFERENCES `equipments` (`equipment_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `rol_permissions`
--
ALTER TABLE `rol_permissions`
  ADD CONSTRAINT `fk_rolpermissions_permissions` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`permission_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_rolpermissions_roles` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`rol_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_roles` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`rol_id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
