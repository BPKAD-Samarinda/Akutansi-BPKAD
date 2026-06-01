# Akuntansi BPKAD Samarinda

## Overview

Sistem Manajemen Dokumen Akuntansi BPKAD (Badan Pengelola Keuangan dan Aset Daerah) Kota Samarinda. Aplikasi ini dirancang untuk memudahkan penyimpanan, pencarian, dan pengelolaan dokumen keuangan seperti SPPD (Surat Perintah Perjalanan Dinas) dan SKP (Sasaran Kinerja Pegawai).

Aplikasi ini menggunakan arsitektur sebagai berikut:
- **Frontend**: React (v19), Vite, TypeScript, TailwindCSS
- **Backend**: PHP Native (PDO MySQL, JWT Authentication, Custom Rate Limiter)
- **Database**: MySQL / MariaDB

---

## Panduan Cepat Menjalankan Aplikasi

Detail panduan menjalankan aplikasi secara lengkap telah dipisahkan untuk dua tipe audiens di file utama:
👉 **[CARA_MENJALANKAN.md](./CARA_MENJALANKAN.md)**

### 1. Backend (PHP)
Jalankan server database & web lokal Anda (seperti Apache & MySQL di **XAMPP** atau **Laragon**), lalu letakkan folder proyek ini di bawah direktori web root (misal: `htdocs/Akutansi-BPKAD/`).

### 2. Frontend (React)
Masuk ke direktori frontend, instal dependensi, lalu jalankan server development:
```sh
cd frontend
npm install
npm run dev
```

---

## Struktur Folder Proyek

- **`backend/`**: File API PHP, manajemen dokumen, upload file, audit log history, dan otentikasi.
- **`frontend/`**: Kode antarmuka (UI) aplikasi berbasis React.
- **`docs/`**: Berisi dokumen operasional dan panduan pemeliharaan sistem.
- **`deploy/`**: Berisi petunjuk deployment aplikasi ke server hosting.
- **`akuntansi_bpkad.sql`**: Struktur tabel dan data dump awal database MySQL.

---

## Dokumentasi Pendukung

Untuk detail teknis, pemeliharaan, dan operasional lainnya, silakan baca dokumentasi berikut:
- 📖 [Panduan Pengguna / User Guide](./docs/user-guide.md)
- ⚙️ [Panduan Pemeliharaan Rutin / Maintenance](./docs/maintenance.md)
- 🛠️ [Penanganan Masalah / Troubleshooting](./docs/troubleshooting.md)
- 💾 [Backup & Restore Database](./docs/backup-restore.md)
- 🌐 [Panduan Deploy ke Shared Hosting](./deploy/shared-hosting-deploy.md)

