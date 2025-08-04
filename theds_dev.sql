-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 03, 2025 at 12:00 PM
-- Server version: 10.3.39-MariaDB
-- PHP Version: 7.2.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `theds_dev`
--

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `id` varchar(36) NOT NULL DEFAULT uuid(),
  `user_id` varchar(36) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `zip_code` varchar(10) DEFAULT NULL,
  `tax_id` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` varchar(36) NOT NULL DEFAULT uuid(),
  `number` varchar(50) NOT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `project_id` varchar(36) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` varchar(15) NOT NULL DEFAULT 'draft',
  `issue_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `due_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `paid_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` varchar(36) NOT NULL DEFAULT uuid(),
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `client_id` varchar(36) DEFAULT NULL,
  `status` varchar(15) NOT NULL DEFAULT 'planning',
  `start_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `end_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `budget` decimal(10,2) DEFAULT NULL,
  `progress` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `project_assignments`
--

CREATE TABLE `project_assignments` (
  `id` varchar(36) NOT NULL DEFAULT uuid(),
  `project_id` varchar(36) DEFAULT NULL,
  `team_member_id` varchar(36) DEFAULT NULL,
  `role` varchar(100) DEFAULT NULL,
  `assigned_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `sid` varchar(128) NOT NULL,
  `sess` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expire` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `system_settings`
--

CREATE TABLE `system_settings` (
  `id` varchar(36) NOT NULL DEFAULT uuid(),
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `setting_type` varchar(20) NOT NULL DEFAULT 'string',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `system_settings`
--

INSERT INTO `system_settings` (`id`, `setting_key`, `setting_value`, `setting_type`, `created_at`, `updated_at`) VALUES
('1b943946-700d-11f0-8aab-2ae8d4b3399a', 'logo', '/uploads/logo_1754186470230.png', 'string', '2025-08-03 01:56:43', '2025-08-03 02:01:10'),
('1b9cbb2c-700d-11f0-8aab-2ae8d4b3399a', 'favicon', '/uploads/favicon_1754186470291.png', 'string', '2025-08-03 01:56:43', '2025-08-03 02:01:10'),
('1ba4c27e-700d-11f0-8aab-2ae8d4b3399a', 'systemName', 'Theds', 'string', '2025-08-03 01:56:43', '2025-08-03 02:01:10'),
('1bacbff0-700d-11f0-8aab-2ae8d4b3399a', 'systemSubtitle', 'Theds', 'string', '2025-08-03 01:56:43', '2025-08-03 02:01:10'),
('1bb4bc0f-700d-11f0-8aab-2ae8d4b3399a', 'systemColor', '#ffc200', 'string', '2025-08-03 01:56:43', '2025-08-03 02:01:10'),
('354b1477-6fae-11f0-8aab-2ae8d4b3399a', 'system_name', 'Theds', 'text', '2025-08-02 14:37:24', '2025-08-02 16:27:44'),
('354dec6f-6fae-11f0-8aab-2ae8d4b3399a', 'system_title', 'Sistema de Gerenciamento', 'text', '2025-08-02 14:37:24', '2025-08-02 14:37:24'),
('3550aaca-6fae-11f0-8aab-2ae8d4b3399a', 'footer_text', 'Sistema de Gerenciamento © 2025', 'text', '2025-08-02 14:37:24', '2025-08-02 14:37:24'),
('35535001-6fae-11f0-8aab-2ae8d4b3399a', 'logo_url', NULL, 'file', '2025-08-02 14:37:24', '2025-08-02 14:37:24'),
('35560405-6fae-11f0-8aab-2ae8d4b3399a', 'favicon_url', NULL, 'file', '2025-08-02 14:37:24', '2025-08-02 14:37:24'),
('84e3b9f5-6fb5-11f0-8aab-2ae8d4b3399a', 'system_logo', '/uploads/file-1754150071464-427251451.png', 'file', '2025-08-02 15:29:44', '2025-08-02 15:54:31'),
('84e69e1e-6fb5-11f0-8aab-2ae8d4b3399a', 'system_favicon', '/uploads/file-1754150071525-895688516.png', 'file', '2025-08-02 15:29:44', '2025-08-02 15:54:31'),
('84e98a22-6fb5-11f0-8aab-2ae8d4b3399a', 'footer_name', 'Theds', 'text', '2025-08-02 15:29:44', '2025-08-02 16:27:44'),
('ee0176ee-6fba-11f0-8aab-2ae8d4b3399a', 'primary_color', '#ffc200', 'color', '2025-08-02 16:08:28', '2025-08-02 16:27:44');

-- --------------------------------------------------------

--
-- Table structure for table `team_members`
--

CREATE TABLE `team_members` (
  `id` varchar(36) NOT NULL DEFAULT uuid(),
  `user_id` varchar(36) DEFAULT NULL,
  `position` varchar(100) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `salary` decimal(10,2) DEFAULT NULL,
  `hire_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(36) NOT NULL DEFAULT uuid(),
  `email` varchar(255) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `profile_image_url` varchar(500) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(10) NOT NULL DEFAULT 'client',
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `first_name`, `last_name`, `phone`, `profile_image_url`, `password`, `role`, `active`, `created_at`, `updated_at`) VALUES
('admin-001', 'admin@sistema.com', 'Administrador', 'Sistema', NULL, NULL, '$2b$10$eIuFOzcbX5gCUK6POLHEu.Deb2xDi.1iAu9Y0V9Zm5Qm1qzZyBVb2', 'admin', 1, '2025-08-02 14:19:59', '2025-08-02 14:25:54');

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

CREATE TABLE `user_roles` (
  `id` varchar(36) NOT NULL DEFAULT uuid(),
  `name` varchar(50) NOT NULL,
  `display_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `permissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[]',
  `is_system` tinyint(1) NOT NULL DEFAULT 0,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`id`, `name`, `display_name`, `description`, `permissions`, `is_system`, `active`, `created_at`, `updated_at`) VALUES
('cf5e8701-7014-11f0-8aab-2ae8d4b3399a', 'admin', 'Administrador', 'Acesso total ao sistema com todas as permissões', '[\"dashboard.view\",\"users.view\",\"users.create\",\"users.edit\",\"users.delete\",\"clients.view\",\"clients.create\",\"clients.edit\",\"clients.delete\",\"team.view\",\"team.create\",\"team.edit\",\"team.delete\",\"projects.view\",\"projects.create\",\"projects.edit\",\"projects.delete\",\"invoices.view\",\"invoices.create\",\"invoices.edit\",\"invoices.delete\",\"settings.view\",\"settings.edit\",\"reports.view\"]', 1, 1, '2025-08-03 02:51:51', '2025-08-03 02:51:51'),
('cf63df0c-7014-11f0-8aab-2ae8d4b3399a', 'team', 'Equipe', 'Acesso às funcionalidades de equipe e projetos', '[\"dashboard.view\",\"projects.view\",\"projects.edit\",\"invoices.view\",\"team.view\"]', 1, 1, '2025-08-03 02:51:51', '2025-08-03 02:51:51'),
('cf691fb2-7014-11f0-8aab-2ae8d4b3399a', 'client', 'Cliente', 'Acesso limitado para visualizar projetos e faturas', '[\"dashboard.view\",\"invoices.view\",\"projects.view\"]', 1, 1, '2025-08-03 02:51:51', '2025-08-03 02:51:51');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `project_assignments`
--
ALTER TABLE `project_assignments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`sid`),
  ADD KEY `IDX_session_expire` (`expire`);

--
-- Indexes for table `system_settings`
--
ALTER TABLE `system_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `team_members`
--
ALTER TABLE `team_members`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
