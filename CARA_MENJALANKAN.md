# Panduan Menjalankan Aplikasi Manajemen Dokumen Akuntansi BPKAD

Dokumen ini berisi panduan lengkap untuk menjalankan dan mengakses aplikasi, baik untuk **Pengguna Non-Teknis (Operator/Staf)** maupun **Pengguna Teknis (Developer/Administrator)**.

---

## 1. PANDUAN PENGGUNA NON-TEKNIS (OPERATOR / STAF)

Bagian ini ditujukan bagi pengguna yang hanya bertugas menggunakan sistem untuk mengelola dokumen sehari-hari.

### Skenario A: Aplikasi Sudah di-Online-kan (Hosting / VPS)
Jika aplikasi sudah dipublikasikan ke server server kantor atau internet oleh admin IT:
1. Buka browser internet Anda (disarankan **Google Chrome** atau **Microsoft Edge**).
2. Ketik alamat URL aplikasi yang diberikan oleh admin IT Anda pada kolom alamat di atas browser, contohnya:
   * `https://akuntansi-bpkad.samarindakota.go.id/` (jika menggunakan domain internet)
   * Atau `http://192.168.1.xxx/Akutansi-BPKAD/` (jika menggunakan IP server lokal)
3. Masukkan **Nama Pengguna** dan **Kata Sandi** Anda, lalu tekan tombol login.

---

### Skenario B: Aplikasi Dijalankan Lokal di Satu Komputer (Menggunakan XAMPP)
Jika aplikasi ini diletakkan langsung di komputer kerja Anda:

#### Langkah 1: Menyalakan Server (XAMPP)
1. Buka menu Start Windows Anda, cari dan klik **XAMPP Control Panel**.
2. Pada baris **Apache**, klik tombol **Start**.
3. Pada baris **MySQL**, klik tombol **Start**.
4. Pastikan tulisan Apache dan MySQL berubah warna menjadi **hijau** (artinya server lokal sudah aktif).

#### Langkah 2: Mengakses Aplikasi di Browser
1. Buka browser **Google Chrome**.
2. Ketik alamat berikut di bagian atas browser Anda:
   ```text
   http://localhost/Akutansi-BPKAD/
   ```
3. Tekan **Enter** pada keyboard. Halaman login aplikasi akan muncul.

---

### 💡 Tips Memudahkan Pengguna Non-Teknis:

#### A. Membuat Pintasan di Desktop (Shortcut)
Agar Anda tidak perlu mengetik alamat URL setiap hari di browser:
1. Klik kanan pada area kosong di Desktop komputer Anda, pilih **New** -> **Shortcut**.
2. Pada kolom lokasi, ketik/paste alamat: `http://localhost/Akutansi-BPKAD/`
3. Klik **Next**, lalu beri nama pintasan ini (misal: **"Aplikasi Akuntansi BPKAD"**).
4. Klik **Finish**. Pintasan baru akan muncul di desktop Anda. Anda tinggal melakukan *double-click* untuk langsung membuka aplikasi.

#### B. Menyalakan Server Otomatis (Autostart XAMPP)
Agar server aktif otomatis setiap kali komputer dinyalakan:
1. Buka **XAMPP Control Panel** (klik kanan, pilih **Run as administrator**).
2. Klik tombol **Config** di sudut kanan atas panel.
3. Centang kotak di samping **Apache** dan **MySQL** di bawah kolom *Autostart of modules*.
4. Klik **Save**. 

---
---

## 2. PANDUAN PENGGUNA TEKNIS (DEVELOPER / ADMINISTRATOR)

Bagian ini ditujukan bagi programmer atau admin IT untuk keperluan pengembangan, perbaikan bug, atau deployment ke server production.

### Kebutuhan Sistem (Prerequisites)
- **Node.js** (versi LTS terbaru)
- **PHP** (minimal versi 7.4 atau versi 8.0+)
- **MySQL / MariaDB** (bisa menggunakan bawaan XAMPP)

---

### Skenario A: Lingkungan Pengembangan (Development Environment)

#### 1. Persiapan Database
1. Buat database baru bernama `akuntansi_bpkad` melalui phpMyAdmin lokal.
2. Impor file struktur dan data awal dari file `akuntansi_bpkad.sql` yang ada di folder root proyek ini.

#### 2. Menyiapkan Backend (PHP API)
1. Letakkan seluruh folder proyek `Akutansi-BPKAD` di dalam folder root Apache (misal `C:\xampp\htdocs\Akutansi-BPKAD`).
2. Buat file `.env` di dalam folder `/backend/` untuk mengamankan JWT Secret:
   ```env
   JWT_SECRET=buat_kunci_jwt_acak_dan_panjang_disini
   ```
3. File konfigurasi database berada di `/backend/config.php`. Secara default, backend menggunakan fallback localhost (`root`, tanpa password, database `akuntansi_bpkad`).

#### 3. Menyiapkan Frontend (React + Vite)
1. Buka terminal atau command prompt, masuk ke folder frontend:
   ```bash
   cd frontend
   ```
2. Instal semua dependensi Node.js:
   ```bash
   npm install
   ```
3. Jalankan server development Vite:
   ```bash
   npm run dev
   ```
4. Frontend akan berjalan di `http://localhost:5173`. Semua request API dari frontend ke `/api` akan diteruskan oleh proxy server development Vite ke backend PHP di `http://localhost/Akutansi-BPKAD/backend/`.

---

### Skenario B: Membangun Aplikasi untuk Produksi (Production Build & Deploy)

Untuk men-deploy aplikasi secara nyata ke web server (Shared Hosting / VPS):

#### 1. Build Aset Frontend
1. Buka file `/frontend/.env.production` dan sesuaikan path endpoint API:
   ```env
   VITE_API_BASE_URL=/backend
   ```
2. Masuk ke folder `/frontend/` di terminal, lalu jalankan perintah compile:
   ```bash
   npm run build
   ```
3. Perintah ini akan menghasilkan folder baru **`/frontend/dist/`** yang berisi file HTML, JS, dan CSS statis.

#### 2. Upload ke Web Server
1. Salin seluruh isi di dalam folder `/frontend/dist/` ke direktori root hosting Anda (biasanya folder `public_html`).
   * *Penting:* Pastikan file `.htaccess` bawaan di dalam folder `dist/` ikut disalin agar URL React Router tidak menghasilkan error 404 ketika di-refresh.
2. Salin folder `/backend/` ke dalam direktori root server hosting Anda sehingga menjadi subfolder (misal `public_html/backend/`).
3. Sesuaikan detail login database asli Anda pada file `/backend/config.php` (atau buat file `.env` di folder backend web server).
4. Pastikan folder `/backend/uploads/` memiliki izin tulis (permissions **CHMOD 755** atau **777** pada Linux) agar berkas PDF yang diunggah pengguna dapat tersimpan di server.
