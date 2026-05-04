-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 04 Bulan Mei 2026 pada 02.30
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `akuntansi_bpkad`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `documents`
--

CREATE TABLE `documents` (
  `id` int(11) NOT NULL,
  `nama_sppd` varchar(255) NOT NULL,
  `tanggal_sppd` date NOT NULL,
  `kategori` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `deleted_at` datetime DEFAULT NULL,
  `uploaded_by` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `documents`
--

INSERT INTO `documents` (`id`, `nama_sppd`, `tanggal_sppd`, `kategori`, `file_path`, `created_at`, `updated_at`, `is_deleted`, `deleted_at`, `uploaded_by`) VALUES
(433, 'Surat Rekomendasi Penyetaraan KKN', '2026-05-04', 'BKU', 'uploads/file-1777854166645-602145130.pdf', '2026-05-04 00:22:46', '2026-05-04 00:22:46', 0, NULL, 'admin');

-- --------------------------------------------------------

--
-- Struktur dari tabel `document_history`
--

CREATE TABLE `document_history` (
  `id` bigint(20) NOT NULL,
  `document_id` bigint(20) DEFAULT NULL,
  `document_name` varchar(255) NOT NULL,
  `uploaded_by` varchar(255) DEFAULT NULL,
  `status` varchar(20) NOT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `file_size` varchar(50) DEFAULT NULL,
  `edit_before` text DEFAULT NULL,
  `edit_after` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `document_history`
--

INSERT INTO `document_history` (`id`, `document_id`, `document_name`, `uploaded_by`, `status`, `file_path`, `file_size`, `edit_before`, `edit_after`, `created_at`) VALUES
(1, 433, 'Surat Rekomendasi Penyetaraan KKN', 'admin', 'diunggah', 'uploads/file-1777854166645-602145130.pdf', '475.1 KB', NULL, NULL, '2026-05-04 08:22:46');

-- --------------------------------------------------------

--
-- Struktur dari tabel `login_activities`
--

CREATE TABLE `login_activities` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL,
  `login_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `login_activities`
--

INSERT INTO `login_activities` (`id`, `user_id`, `username`, `role`, `login_at`) VALUES
(49, 3, 'staff', '', '2026-05-04 05:59:21'),
(50, 3, 'staff', '', '2026-05-04 06:03:42'),
(51, 2, 'admin', '', '2026-05-04 06:03:49'),
(52, 2, 'admin', '', '2026-05-04 06:04:33'),
(53, 2, 'admin', '', '2026-05-04 06:08:15'),
(54, 2, 'admin', '', '2026-05-04 06:08:19'),
(55, 2, 'admin', '', '2026-05-04 06:08:22'),
(56, 2, 'admin', '', '2026-05-04 06:08:25'),
(57, 2, 'admin', '', '2026-05-04 06:08:30'),
(58, 2, 'admin', '', '2026-05-04 06:09:09'),
(59, 2, 'admin', 'Staff', '2026-05-04 06:09:32'),
(60, 2, 'admin', 'Staff', '2026-05-04 06:10:43'),
(61, 3, 'staff', 'Staff', '2026-05-04 06:11:04'),
(62, 2, 'admin', 'Admin', '2026-05-04 06:12:38'),
(63, 3, 'staff', 'Staff', '2026-05-04 06:13:18'),
(64, 8, 'admin', 'Admin', '2026-05-04 06:14:38'),
(65, 3, 'staff', 'Staff', '2026-05-04 06:26:41'),
(66, 8, 'admin', 'Admin', '2026-05-04 06:26:51'),
(67, 3, 'staff', 'Staff', '2026-05-04 06:28:10'),
(68, 8, 'admin', 'Admin', '2026-05-04 06:28:58'),
(69, 3, 'staff', 'Staff', '2026-05-04 06:38:41'),
(70, 8, 'admin', 'Admin', '2026-05-04 06:39:00'),
(71, 3, 'staff', 'Staff', '2026-05-04 06:39:22'),
(72, 8, 'admin', 'Admin', '2026-05-04 06:39:32'),
(73, 3, 'staff', 'Staff', '2026-05-04 07:01:51'),
(74, 8, 'admin', 'Admin', '2026-05-04 07:02:16');

-- --------------------------------------------------------

--
-- Struktur dari tabel `skp_documents`
--

CREATE TABLE `skp_documents` (
  `id` bigint(20) NOT NULL,
  `nama_skp` varchar(255) NOT NULL,
  `triwulan` tinyint(4) NOT NULL,
  `tahun` int(11) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `uploaded_by` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `skp_documents`
--

INSERT INTO `skp_documents` (`id`, `nama_skp`, `triwulan`, `tahun`, `file_path`, `uploaded_by`, `created_at`) VALUES
(2, 'nuno', 1, 2026, 'uploads/file-1777848903785-490575446.pdf', 'admin', '2026-05-04 06:55:03'),
(3, 'nuna', 2, 2026, 'uploads/file-1777849329498-300038719.pdf', 'staff', '2026-05-04 07:02:09');

-- --------------------------------------------------------

--
-- Struktur dari tabel `skp_history`
--

CREATE TABLE `skp_history` (
  `id` bigint(20) NOT NULL,
  `skp_document_id` bigint(20) DEFAULT NULL,
  `action_type` varchar(20) NOT NULL,
  `actor_username` varchar(255) DEFAULT NULL,
  `actor_role` varchar(50) DEFAULT NULL,
  `target_uploaded_by` varchar(255) DEFAULT NULL,
  `before_data` text DEFAULT NULL,
  `after_data` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `skp_history`
--

INSERT INTO `skp_history` (`id`, `skp_document_id`, `action_type`, `actor_username`, `actor_role`, `target_uploaded_by`, `before_data`, `after_data`, `created_at`) VALUES
(1, 3, 'upload', 'staff', 'Staff', 'staff', NULL, '{\"nama_skp\":\"nuna\",\"triwulan\":2,\"tahun\":2026,\"file_path\":\"uploads/file-1777849329498-300038719.pdf\"}', '2026-05-04 07:02:09');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `role` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `created_at`, `role`) VALUES
(3, 'staff', '$2b$10$0QP.FgUgwewhVnI.5I7ci.YFhjVcGa0IwE9UB1iJkHaE1Sh.3RoDG', '2026-02-11 07:43:08', 'Staff'),
(8, 'admin', '$2b$10$iNmi2iiQeiyOm/j7cSh/z.P0BAb//12gv3DRtqHCj6pgoQ1fWUUZi', '2026-02-11 07:43:08', 'Admin');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `document_history`
--
ALTER TABLE `document_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_document_history_created_at` (`created_at`),
  ADD KEY `idx_document_history_status` (`status`);

--
-- Indeks untuk tabel `login_activities`
--
ALTER TABLE `login_activities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_login_activities_login_at` (`login_at`),
  ADD KEY `idx_login_activities_user_id` (`user_id`);

--
-- Indeks untuk tabel `skp_documents`
--
ALTER TABLE `skp_documents`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_skp_uploader_period_name` (`uploaded_by`,`tahun`,`triwulan`,`nama_skp`),
  ADD KEY `idx_skp_triwulan` (`triwulan`),
  ADD KEY `idx_skp_tahun` (`tahun`),
  ADD KEY `idx_skp_uploaded_by` (`uploaded_by`),
  ADD KEY `idx_skp_created_at` (`created_at`);

--
-- Indeks untuk tabel `skp_history`
--
ALTER TABLE `skp_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_skp_history_action_type` (`action_type`),
  ADD KEY `idx_skp_history_actor_username` (`actor_username`),
  ADD KEY `idx_skp_history_target_uploaded_by` (`target_uploaded_by`),
  ADD KEY `idx_skp_history_created_at` (`created_at`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `documents`
--
ALTER TABLE `documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=434;

--
-- AUTO_INCREMENT untuk tabel `document_history`
--
ALTER TABLE `document_history`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `login_activities`
--
ALTER TABLE `login_activities`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;

--
-- AUTO_INCREMENT untuk tabel `skp_documents`
--
ALTER TABLE `skp_documents`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `skp_history`
--
ALTER TABLE `skp_history`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
