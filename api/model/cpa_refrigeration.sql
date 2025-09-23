-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 23-09-2025 a las 00:30:34
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
(33, 25, 1, 'prueba'),
(36, 7, 104, 'kapcan'),
(39, 7, 103, '2025-09-22'),
(41, 10, 1, 'Samsung'),
(42, 10, 2, 'RT38K5932SL'),
(43, 10, 3, 'SN-HELR-20250922-001'),
(44, 10, 5, 'HR-0458'),
(45, 10, 6, '320 W'),
(46, 10, 8, '0.15 kW'),
(47, 10, 9, '1.2'),
(48, 10, 10, '220v - 1F - 50Hz'),
(49, 10, 11, 'rotativo'),
(50, 10, 12, '1'),
(51, 10, 15, 'Suniso GS 32 (ISO VG 32, mineral)'),
(52, 10, 16, 'capilar'),
(53, 10, 18, '2022'),
(54, 10, 19, '2023'),
(55, 10, 20, 'Cocina Principal'),
(56, 10, 21, 'aire'),
(265, 10, 4, 'equip10.jpeg');

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
(4, 3, 'Actualización de pregunta ID: 101', '2025-09-19 17:25:10', 'success'),
(5, 3, 'Alta de pregunta: Tipo de Intervención', '2025-09-19 19:17:57', 'success'),
(6, 3, 'Actualización de pregunta ID: 1', '2025-09-22 03:16:45', 'success'),
(7, 3, 'Actualización de pregunta ID: 2', '2025-09-22 03:16:54', 'success'),
(8, 3, 'Actualización de pregunta ID: 3', '2025-09-22 03:17:51', 'success'),
(9, 3, 'Actualización de pregunta ID: 4', '2025-09-22 03:18:03', 'success'),
(10, 3, 'Actualización de pregunta ID: 5', '2025-09-22 03:18:14', 'success'),
(11, 3, 'Actualización de pregunta ID: 6', '2025-09-22 03:18:57', 'success'),
(12, 3, 'Actualización de pregunta ID: 7', '2025-09-22 03:19:12', 'success'),
(13, 3, 'Actualización de pregunta ID: 8', '2025-09-22 03:19:25', 'success'),
(14, 3, 'Actualización de pregunta ID: 9', '2025-09-22 03:19:40', 'success'),
(15, 3, 'Actualización de pregunta ID: 2', '2025-09-22 03:19:43', 'success'),
(16, 3, 'Actualización de pregunta ID: 7', '2025-09-22 03:20:20', 'success'),
(17, 3, 'Actualización de pregunta ID: 6', '2025-09-22 03:20:43', 'success'),
(18, 3, 'Actualización de pregunta ID: 6', '2025-09-22 03:21:03', 'success'),
(19, 3, 'Actualización de pregunta ID: 9', '2025-09-22 03:21:18', 'success'),
(20, 3, 'Actualización de pregunta ID: 10', '2025-09-22 03:21:30', 'success'),
(21, 3, 'Actualización de pregunta ID: 11', '2025-09-22 03:22:14', 'success'),
(22, 3, 'Actualización de pregunta ID: 12', '2025-09-22 03:22:27', 'success'),
(23, 3, 'Actualización de pregunta ID: 13', '2025-09-22 03:22:51', 'success'),
(24, 3, 'Actualización de pregunta ID: 14', '2025-09-22 03:23:23', 'success'),
(25, 3, 'Actualización de pregunta ID: 14', '2025-09-22 03:23:29', 'success'),
(26, 3, 'Actualización de pregunta ID: 15', '2025-09-22 03:24:27', 'success'),
(27, 3, 'Actualización de pregunta ID: 16', '2025-09-22 03:24:39', 'success'),
(28, 3, 'Actualización de pregunta ID: 17', '2025-09-22 03:25:12', 'success'),
(29, 3, 'Actualización de pregunta ID: 18', '2025-09-22 03:25:36', 'success'),
(30, 3, 'Actualización de pregunta ID: 19', '2025-09-22 03:25:45', 'success'),
(31, 3, 'Actualización de pregunta ID: 20', '2025-09-22 03:26:31', 'success'),
(32, 3, 'Actualización de pregunta ID: 21', '2025-09-22 03:26:54', 'success'),
(33, 3, 'Actualización de pregunta ID: 22', '2025-09-22 03:27:15', 'success'),
(34, 3, 'Actualización de pregunta ID: 23', '2025-09-22 03:27:23', 'success'),
(35, 3, 'Actualización de pregunta ID: 24', '2025-09-22 03:33:36', 'success'),
(36, 3, 'Actualización de pregunta ID: 25', '2025-09-22 03:33:43', 'success'),
(37, 3, 'Actualización de pregunta ID: 26', '2025-09-22 03:33:52', 'success'),
(38, 3, 'Actualización de pregunta ID: 27', '2025-09-22 03:34:23', 'success'),
(39, 3, 'Actualización de pregunta ID: 28', '2025-09-22 03:34:37', 'success'),
(40, 3, 'Actualización de pregunta ID: 29', '2025-09-22 03:34:50', 'success'),
(41, 3, 'Actualización de pregunta ID: 30', '2025-09-22 03:35:13', 'success'),
(42, 3, 'Actualización de pregunta ID: 32', '2025-09-22 03:36:47', 'success'),
(43, 3, 'Actualización de pregunta ID: 33', '2025-09-22 03:37:02', 'success'),
(44, 3, 'Actualización de pregunta ID: 34', '2025-09-22 03:37:13', 'success'),
(45, 3, 'Actualización de pregunta ID: 35', '2025-09-22 03:37:28', 'success'),
(46, 3, 'Actualización de pregunta ID: 93', '2025-09-22 03:38:54', 'success'),
(47, 3, 'Actualización de pregunta ID: 94', '2025-09-22 03:39:03', 'success'),
(48, 3, 'Actualización de pregunta ID: 95', '2025-09-22 03:39:11', 'success'),
(49, 3, 'Actualización de pregunta ID: 96', '2025-09-22 03:39:43', 'success'),
(50, 3, 'Actualización de pregunta ID: 97', '2025-09-22 03:40:00', 'success'),
(51, 3, 'Actualización de pregunta ID: 98', '2025-09-22 03:40:12', 'success'),
(52, 3, 'Actualización de pregunta ID: 99', '2025-09-22 03:40:18', 'success'),
(53, 3, 'Actualización de pregunta ID: 100', '2025-09-22 03:40:44', 'success'),
(54, 3, 'Actualización de pregunta ID: 101', '2025-09-22 03:40:56', 'success'),
(55, 3, 'Actualización de pregunta ID: 102', '2025-09-22 03:41:01', 'success'),
(56, 3, 'Actualización de pregunta ID: 103', '2025-09-22 03:41:06', 'success'),
(57, 3, 'Actualización de pregunta ID: 104', '2025-09-22 03:41:12', 'success'),
(58, 3, 'Actualización de pregunta ID: 88', '2025-09-22 03:41:38', 'success'),
(59, 3, 'Actualización de pregunta ID: 89', '2025-09-22 03:41:45', 'success'),
(60, 3, 'Actualización de pregunta ID: 90', '2025-09-22 03:41:58', 'success'),
(61, 3, 'Actualización de pregunta ID: 91', '2025-09-22 03:42:09', 'success'),
(62, 3, 'Actualización de pregunta ID: 90', '2025-09-22 03:42:11', 'success'),
(63, 3, 'Actualización de pregunta ID: 91', '2025-09-22 03:42:13', 'success'),
(64, 3, 'Actualización de pregunta ID: 92', '2025-09-22 03:43:33', 'success'),
(65, 3, 'Actualización de pregunta ID: 80', '2025-09-22 03:44:45', 'success'),
(66, 3, 'Actualización de pregunta ID: 81', '2025-09-22 03:44:56', 'success'),
(67, 3, 'Actualización de técnico ID: 5', '2025-09-22 04:58:23', 'success'),
(68, 3, 'Actualización de pregunta ID: 80', '2025-09-22 04:59:44', 'success'),
(69, 3, 'Actualización de técnico ID: 2', '2025-09-22 18:24:37', 'success'),
(70, 3, 'Actualización de técnico ID: 2', '2025-09-22 18:25:08', 'success');

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
  `type_fields` int(11) DEFAULT NULL,
  `mandatory` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `data_equipments`
--

INSERT INTO `data_equipments` (`data_equip_id`, `type_equip_id`, `type_fields`, `mandatory`) VALUES
(1, 5, 105, 1),
(2, 9, 105, 1),
(3, 2, 105, 1),
(4, 4, 105, 1),
(5, 3, 105, 1),
(6, 1, 105, 1),
(7, 8, 105, 1),
(8, 7, 105, 1),
(9, 6, 105, 1),
(10, 5, 1, 1),
(11, 4, 1, 1),
(12, 9, 1, 1),
(13, 2, 1, 1),
(14, 1, 1, 1),
(15, 3, 1, 1),
(16, 8, 1, 1),
(17, 6, 1, 1),
(18, 7, 1, 1),
(28, 5, 3, 1),
(29, 9, 3, 1),
(30, 2, 3, 1),
(31, 4, 3, 1),
(32, 3, 3, 1),
(33, 1, 3, 1),
(34, 8, 3, 1),
(35, 7, 3, 1),
(36, 6, 3, 1),
(37, 5, 4, 1),
(38, 9, 4, 1),
(39, 2, 4, 1),
(40, 4, 4, 1),
(41, 3, 4, 1),
(42, 1, 4, 1),
(43, 8, 4, 1),
(44, 7, 4, 1),
(45, 6, 4, 1),
(46, 5, 5, 1),
(47, 9, 5, 1),
(48, 2, 5, 1),
(49, 4, 5, 1),
(50, 3, 5, 1),
(51, 1, 5, 1),
(52, 7, 5, 1),
(53, 6, 5, 1),
(54, 8, 5, 1),
(68, 5, 8, 1),
(69, 9, 8, 1),
(70, 4, 8, 1),
(71, 3, 8, 1),
(72, 1, 8, 1),
(73, 2, 8, 1),
(74, 8, 8, 1),
(75, 7, 8, 1),
(76, 6, 8, 1),
(86, 5, 2, 1),
(87, 9, 2, 1),
(88, 2, 2, 1),
(89, 4, 2, 1),
(90, 3, 2, 1),
(91, 1, 2, 1),
(92, 8, 2, 1),
(93, 7, 2, 1),
(94, 6, 2, 1),
(95, 2, 7, 1),
(96, 4, 7, 1),
(97, 1, 7, 1),
(98, 3, 7, 1),
(106, 2, 6, 1),
(107, 1, 6, 1),
(108, 4, 6, 1),
(109, 3, 6, 1),
(110, 9, 6, 1),
(111, 5, 6, 1),
(112, 8, 6, 1),
(113, 7, 6, 1),
(114, 6, 6, 1),
(115, 5, 9, 1),
(116, 9, 9, 1),
(117, 2, 9, 1),
(118, 4, 9, 1),
(119, 3, 9, 1),
(120, 1, 9, 1),
(121, 8, 9, 1),
(122, 7, 9, 1),
(123, 6, 9, 1),
(124, 5, 10, 1),
(125, 9, 10, 1),
(126, 2, 10, 1),
(127, 4, 10, 1),
(128, 3, 10, 1),
(129, 1, 10, 1),
(130, 8, 10, 1),
(131, 7, 10, 1),
(132, 6, 10, 1),
(133, 5, 11, 1),
(134, 9, 11, 1),
(135, 2, 11, 1),
(136, 4, 11, 1),
(137, 3, 11, 1),
(138, 1, 11, 1),
(139, 8, 11, 1),
(140, 7, 11, 1),
(141, 6, 11, 1),
(142, 5, 12, 1),
(143, 9, 12, 1),
(144, 2, 12, 1),
(145, 4, 12, 1),
(146, 3, 12, 1),
(147, 1, 12, 1),
(148, 8, 12, 1),
(149, 7, 12, 1),
(150, 6, 12, 1),
(151, 5, 13, 1),
(152, 9, 13, 1),
(153, 4, 13, 1),
(154, 3, 13, 1),
(155, 1, 13, 1),
(156, 2, 13, 1),
(157, 8, 13, 1),
(164, 5, 14, 1),
(165, 4, 14, 1),
(166, 3, 14, 1),
(167, 8, 14, 1),
(168, 1, 14, 1),
(169, 9, 14, 1),
(170, 2, 14, 1),
(171, 5, 15, 1),
(172, 9, 15, 1),
(173, 2, 15, 1),
(174, 4, 15, 1),
(175, 3, 15, 1),
(176, 1, 15, 1),
(177, 8, 15, 1),
(178, 7, 15, 1),
(179, 6, 15, 1),
(180, 5, 16, 1),
(181, 4, 16, 1),
(182, 2, 16, 1),
(183, 9, 16, 1),
(184, 1, 16, 1),
(185, 3, 16, 1),
(186, 8, 16, 1),
(187, 7, 16, 1),
(188, 6, 16, 1),
(189, 5, 17, 1),
(190, 4, 17, 1),
(191, 3, 17, 1),
(192, 8, 17, 1),
(193, 1, 17, 1),
(194, 2, 17, 1),
(195, 9, 17, 1),
(196, 5, 18, 1),
(197, 9, 18, 1),
(198, 2, 18, 1),
(199, 4, 18, 1),
(200, 3, 18, 1),
(201, 1, 18, 1),
(202, 8, 18, 1),
(203, 7, 18, 1),
(204, 6, 18, 1),
(205, 5, 19, 1),
(206, 9, 19, 1),
(207, 2, 19, 1),
(208, 4, 19, 1),
(209, 3, 19, 1),
(210, 1, 19, 1),
(211, 8, 19, 1),
(212, 7, 19, 1),
(213, 6, 19, 1),
(214, 5, 20, 1),
(215, 9, 20, 1),
(216, 2, 20, 1),
(217, 4, 20, 1),
(218, 3, 20, 1),
(219, 1, 20, 1),
(220, 8, 20, 1),
(221, 7, 20, 1),
(222, 6, 20, 1),
(223, 5, 21, 1),
(224, 9, 21, 1),
(225, 2, 21, 1),
(226, 4, 21, 1),
(227, 3, 21, 1),
(228, 1, 21, 1),
(229, 8, 21, 1),
(230, 7, 21, 1),
(231, 6, 21, 1),
(232, 5, 22, 1),
(233, 9, 22, 1),
(234, 2, 22, 1),
(235, 4, 22, 1),
(236, 3, 22, 1),
(237, 1, 22, 1),
(238, 8, 22, 1),
(239, 5, 23, 1),
(240, 4, 23, 1),
(241, 3, 23, 1),
(242, 8, 23, 1),
(243, 1, 23, 1),
(244, 2, 23, 1),
(245, 9, 23, 1),
(246, 5, 24, 1),
(247, 4, 24, 1),
(248, 9, 24, 1),
(249, 2, 24, 1),
(250, 1, 24, 1),
(251, 3, 24, 1),
(252, 8, 24, 1),
(253, 7, 24, 1),
(254, 6, 24, 1),
(255, 5, 25, 1),
(256, 9, 25, 1),
(257, 2, 25, 1),
(258, 4, 25, 1),
(259, 3, 25, 1),
(260, 1, 25, 1),
(261, 8, 25, 1),
(262, 7, 25, 1),
(263, 6, 25, 1),
(264, 5, 26, 1),
(265, 4, 26, 1),
(266, 9, 26, 1),
(267, 2, 26, 1),
(268, 1, 26, 1),
(269, 3, 26, 1),
(270, 8, 26, 1),
(271, 7, 26, 1),
(272, 6, 26, 1),
(273, 5, 27, 1),
(274, 9, 27, 1),
(275, 2, 27, 1),
(276, 4, 27, 1),
(277, 3, 27, 1),
(278, 1, 27, 1),
(279, 8, 27, 1),
(280, 7, 27, 1),
(281, 6, 27, 1),
(282, 5, 28, 1),
(283, 9, 28, 1),
(284, 2, 28, 1),
(285, 4, 28, 1),
(286, 3, 28, 1),
(287, 1, 28, 1),
(288, 8, 28, 1),
(289, 5, 29, 1),
(290, 9, 29, 1),
(291, 2, 29, 1),
(292, 4, 29, 1),
(293, 3, 29, 1),
(294, 1, 29, 1),
(295, 8, 29, 1),
(296, 7, 29, 1),
(297, 6, 29, 1),
(298, 5, 30, 1),
(299, 9, 30, 1),
(300, 2, 30, 1),
(301, 4, 30, 1),
(302, 3, 30, 1),
(303, 1, 30, 1),
(304, 8, 30, 1),
(305, 5, 32, 1),
(306, 4, 32, 1),
(307, 9, 32, 1),
(308, 2, 32, 1),
(309, 1, 32, 1),
(310, 3, 32, 1),
(311, 8, 32, 1),
(312, 5, 33, 1),
(313, 9, 33, 1),
(314, 2, 33, 1),
(315, 1, 33, 1),
(316, 3, 33, 1),
(317, 4, 33, 1),
(318, 8, 33, 1),
(319, 5, 34, 1),
(320, 9, 34, 1),
(321, 2, 34, 1),
(322, 1, 34, 1),
(323, 3, 34, 1),
(324, 4, 34, 1),
(325, 8, 34, 1),
(326, 7, 34, 1),
(327, 6, 34, 1),
(328, 5, 35, 1),
(329, 9, 35, 1),
(330, 2, 35, 1),
(331, 4, 35, 1),
(332, 3, 35, 1),
(333, 1, 35, 1),
(334, 8, 35, 1),
(335, 7, 35, 1),
(336, 6, 35, 1),
(337, 4, 93, 1),
(338, 3, 93, 1),
(339, 8, 93, 1),
(340, 1, 93, 1),
(341, 2, 93, 1),
(342, 9, 93, 1),
(343, 5, 94, 1),
(344, 9, 94, 1),
(345, 2, 94, 1),
(346, 4, 94, 1),
(347, 3, 94, 1),
(348, 1, 94, 1),
(349, 8, 94, 1),
(350, 7, 94, 1),
(351, 6, 94, 1),
(352, 5, 95, 1),
(353, 9, 95, 1),
(354, 2, 95, 1),
(355, 4, 95, 1),
(356, 3, 95, 1),
(357, 1, 95, 1),
(358, 8, 95, 1),
(359, 7, 95, 1),
(360, 6, 95, 1),
(361, 5, 96, 1),
(362, 9, 96, 1),
(363, 2, 96, 1),
(364, 4, 96, 1),
(365, 3, 96, 1),
(366, 1, 96, 1),
(367, 8, 96, 1),
(368, 7, 96, 1),
(369, 6, 96, 1),
(370, 5, 97, 1),
(371, 9, 97, 1),
(372, 2, 97, 1),
(373, 4, 97, 1),
(374, 3, 97, 1),
(375, 1, 97, 1),
(376, 8, 97, 1),
(377, 7, 97, 1),
(378, 6, 97, 1),
(379, 5, 98, 1),
(380, 9, 98, 1),
(381, 2, 98, 1),
(382, 4, 98, 1),
(383, 3, 98, 1),
(384, 1, 98, 1),
(385, 8, 98, 1),
(386, 7, 98, 1),
(387, 6, 98, 1),
(388, 5, 99, 1),
(389, 9, 99, 1),
(390, 2, 99, 1),
(391, 4, 99, 1),
(392, 3, 99, 1),
(393, 1, 99, 1),
(394, 8, 99, 1),
(395, 7, 99, 1),
(396, 6, 99, 1),
(397, 5, 100, 1),
(398, 4, 100, 1),
(399, 3, 100, 1),
(400, 8, 100, 1),
(401, 7, 100, 1),
(402, 6, 100, 1),
(403, 1, 100, 1),
(404, 2, 100, 1),
(405, 9, 100, 1),
(406, 1, 101, 1),
(407, 2, 101, 1),
(408, 5, 101, 1),
(409, 4, 101, 1),
(410, 9, 101, 1),
(411, 3, 101, 1),
(412, 8, 101, 1),
(413, 7, 101, 1),
(414, 6, 101, 1),
(415, 9, 102, 1),
(416, 5, 102, 1),
(417, 4, 102, 1),
(418, 2, 102, 1),
(419, 1, 102, 1),
(420, 3, 102, 1),
(421, 8, 102, 1),
(422, 7, 102, 1),
(423, 6, 102, 1),
(424, 1, 103, 1),
(425, 2, 103, 1),
(426, 9, 103, 1),
(427, 5, 103, 1),
(428, 4, 103, 1),
(429, 3, 103, 1),
(430, 8, 103, 1),
(431, 7, 103, 1),
(432, 6, 103, 1),
(433, 1, 104, 1),
(434, 2, 104, 1),
(435, 9, 104, 1),
(436, 4, 104, 1),
(437, 3, 104, 1),
(438, 5, 104, 1),
(439, 8, 104, 1),
(440, 7, 104, 1),
(441, 6, 104, 1),
(442, 5, 88, 1),
(443, 9, 88, 1),
(444, 2, 88, 1),
(445, 4, 88, 1),
(446, 3, 88, 1),
(447, 1, 88, 1),
(448, 8, 88, 1),
(449, 5, 89, 1),
(450, 9, 89, 1),
(451, 2, 89, 1),
(452, 4, 89, 1),
(453, 3, 89, 1),
(454, 1, 89, 1),
(455, 8, 89, 1),
(456, 7, 89, 1),
(457, 6, 89, 1),
(471, 8, 90, 1),
(472, 1, 90, 1),
(473, 3, 90, 1),
(474, 2, 90, 1),
(475, 4, 90, 1),
(476, 5, 90, 1),
(477, 9, 90, 1),
(478, 8, 91, 1),
(479, 1, 91, 1),
(480, 3, 91, 1),
(481, 4, 91, 1),
(482, 2, 91, 1),
(483, 5, 91, 1),
(484, 9, 91, 1),
(485, 5, 92, 1),
(486, 9, 92, 1),
(487, 2, 92, 1),
(488, 4, 92, 1),
(489, 3, 92, 1),
(490, 1, 92, 1),
(491, 8, 92, 1),
(492, 7, 92, 1),
(493, 6, 92, 1),
(500, 5, 81, 1),
(501, 9, 81, 1),
(502, 2, 81, 1),
(503, 4, 81, 1),
(504, 3, 81, 1),
(505, 1, 81, 1),
(506, 8, 81, 1),
(507, 7, 81, 1),
(508, 6, 81, 1),
(509, 9, 80, 1),
(510, 2, 80, 1),
(511, 4, 80, 1),
(512, 3, 80, 1),
(513, 1, 80, 1),
(514, 8, 80, 1);

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
(25, 6, 4, 'CS003', 'Activo', 'exterior'),
(26, 5, 1, 'SP004', 'Activo', 'interior'),
(27, 5, 1, 'SP004', 'Activo', 'exterior'),
(28, 5, 2, 'RT004', 'Activo', 'interior'),
(29, 5, 2, 'RT004', 'Activo', 'exterior'),
(30, 5, 1, 'SP005', 'Activo', 'interior'),
(31, 5, 1, 'SP005', 'Activo', 'exterior'),
(32, 5, 4, 'CS004', 'Activo', 'interior'),
(33, 5, 4, 'CS004', 'Activo', 'exterior'),
(34, 5, 6, 'HR005', 'Activo', NULL);

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
(6, 4, 25, 'Llenado de formulario', '2025-09-19 06:09:14'),
(7, 2, 7, 'Llenado de formulario', '2025-09-22 19:17:08'),
(8, 2, 7, 'Llenado de formulario', '2025-09-22 19:38:54'),
(9, 2, 10, 'Llenado de formulario', '2025-09-22 19:52:08'),
(10, 2, 10, 'Llenado de formulario', '2025-09-22 20:08:47'),
(11, 2, 10, 'Llenado de formulario', '2025-09-22 20:10:49'),
(12, 2, 10, 'Llenado de formulario', '2025-09-22 20:21:24'),
(13, 2, 10, 'Llenado de formulario', '2025-09-22 20:22:26'),
(14, 2, 10, 'Llenado de formulario', '2025-09-22 20:33:37'),
(15, 2, 10, 'Llenado de formulario', '2025-09-22 21:03:23'),
(16, 2, 10, 'Se actualizó la foto del equipo', '2025-09-22 21:23:44'),
(17, 2, 10, 'Llenado de formulario', '2025-09-22 21:23:44'),
(18, 2, 10, 'Se actualizó la foto del equipo', '2025-09-22 21:26:41'),
(19, 2, 10, 'Llenado de formulario', '2025-09-22 21:26:41'),
(20, 2, 10, 'Se actualizó la foto del equipo', '2025-09-22 21:27:01'),
(21, 2, 10, 'Llenado de formulario', '2025-09-22 21:27:01'),
(22, 2, 10, 'Se actualizó la foto del equipo', '2025-09-22 21:29:32'),
(23, 2, 10, 'Llenado de formulario', '2025-09-22 21:29:32'),
(24, 2, 10, 'Se actualizó la foto del equipo', '2025-09-22 21:29:43'),
(25, 2, 10, 'Llenado de formulario', '2025-09-22 21:29:43'),
(26, 2, 10, 'Se actualizó la foto del equipo', '2025-09-22 21:29:54'),
(27, 2, 10, 'Llenado de formulario', '2025-09-22 21:29:54'),
(28, 2, 10, 'Llenado de formulario', '2025-09-22 21:36:10'),
(29, 2, 10, 'Llenado de formulario', '2025-09-22 21:39:45'),
(30, 2, 10, 'Llenado de formulario', '2025-09-22 21:48:27');

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
(104, 9, 'Estados', 'text', 'estados'),
(105, 8, 'Tipo de Intervención', 'select', 'La intervención realizada');

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
(62, 49, 'tangencial', 'Tangencial'),
(63, 105, 'mantenimiento', 'Mantenimiento'),
(64, 105, 'reparación', 'Reparación'),
(65, 105, 'instalación', 'Instalación'),
(66, 105, 'desinstalación', 'Desinstalación'),
(67, 11, 'rotativo', 'Rotativo'),
(68, 11, 'scroll', 'Scroll'),
(69, 11, 'alternativo', 'Alternativo'),
(70, 11, 'inverter', 'Inverter'),
(71, 11, 'semihermetico', 'Semihermetico'),
(72, 11, 'tornillo', 'Tornillo'),
(73, 11, 'centrifugo', 'Centrifugo'),
(74, 16, 'termostatica', 'Termostatica'),
(75, 16, 'electronica', 'Electronica'),
(76, 16, 'capilar', 'Capilar'),
(77, 16, 'flotador', 'Flotador'),
(78, 21, 'aire', 'Aire'),
(79, 21, 'agua', 'Agua'),
(80, 21, 'evaporativo', 'Evaporativo'),
(81, 25, 'monofasico', 'Monofasico'),
(82, 25, 'trifasico', 'Trifasico'),
(83, 29, 'breaker', 'Breaker'),
(84, 29, 'fusible', 'Fusible'),
(85, 29, 'termico', 'Termico'),
(86, 34, 'bueno', 'Bueno'),
(87, 34, 'desgaste', 'Desgaste'),
(88, 34, 'recalentamiento', 'Recalentamiento');

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
  `name` varchar(150) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `images`
--

INSERT INTO `images` (`image_id`, `equipment_id`, `name`, `date`) VALUES
(9, 10, 'equip10.jpg', '2025-09-22 20:59:18');

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
  `initial` varchar(50) DEFAULT NULL,
  `requires_unit` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `type_equipments`
--

INSERT INTO `type_equipments` (`type_equip_id`, `name`, `initial`, `requires_unit`) VALUES
(1, 'Split', 'SP', 1),
(2, 'Rooftop', 'RT', 1),
(3, 'Centrales', 'CT', 1),
(4, 'Cassette', 'CS', 1),
(5, 'Camara Frigorifica', 'CF', 0),
(6, 'Heladera Residencial', 'HR', 0),
(7, 'Freezer', 'FR', 0),
(8, 'Exhibidoras', 'EX', 0),
(9, 'Heladeras Comercial', 'HC', 0);

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
(5, 2, 'Matias', '85397522', 'mati@example.com', '$2y$10$8cUUEtbzaYTomoD8I9V.a.ew1KFZjuG2iKlFYMKvbisJIahR4PfoG', '1154356645', 'image-profile', 'disponible');

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
  ADD KEY `fk_dataequip_type` (`type_equip_id`),
  ADD KEY `fk_data_fields` (`type_fields`);

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
  ADD UNIQUE KEY `equipment_id` (`equipment_id`),
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
  MODIFY `answers_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=300;

--
-- AUTO_INCREMENT de la tabla `assignment`
--
ALTER TABLE `assignment`
  MODIFY `assignment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `audit`
--
ALTER TABLE `audit`
  MODIFY `audit_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT de la tabla `clients`
--
ALTER TABLE `clients`
  MODIFY `client_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `data_equipments`
--
ALTER TABLE `data_equipments`
  MODIFY `data_equip_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=515;

--
-- AUTO_INCREMENT de la tabla `equipments`
--
ALTER TABLE `equipments`
  MODIFY `equipment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT de la tabla `equipments_history`
--
ALTER TABLE `equipments_history`
  MODIFY `history_equip_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT de la tabla `fields_category`
--
ALTER TABLE `fields_category`
  MODIFY `field_category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `fields_equipment`
--
ALTER TABLE `fields_equipment`
  MODIFY `field_equip_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=106;

--
-- AUTO_INCREMENT de la tabla `field_options`
--
ALTER TABLE `field_options`
  MODIFY `option_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;

--
-- AUTO_INCREMENT de la tabla `files`
--
ALTER TABLE `files`
  MODIFY `files_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `images`
--
ALTER TABLE `images`
  MODIFY `image_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

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
  ADD CONSTRAINT `fk_data_fields` FOREIGN KEY (`type_fields`) REFERENCES `fields_equipment` (`field_equip_id`) ON DELETE CASCADE ON UPDATE CASCADE,
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
