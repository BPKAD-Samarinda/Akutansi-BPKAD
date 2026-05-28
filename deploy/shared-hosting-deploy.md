# Panduan Deploy ke Hosting Panel (cPanel / Hostinger hPanel)

Panduan ini digunakan jika Anda ingin melakukan *hosting* aplikasi menggunakan **Shared Hosting biasa** (yang memiliki dukungan PHP dan MySQL bawaan seperti Hostinger Web Hosting atau cPanel), bukan VPS.

Aplikasi ini menggunakan arsitektur:
- **Frontend**: Vite React (Aplikasi SPA statis)
- **Backend**: PHP murni
- **Database**: MySQL / MariaDB

---

## Tahap 1: Persiapan Database
1. Buka **phpMyAdmin** di panel hosting (cPanel/hPanel) Anda.
2. Buat database baru (misal: `u123456_bpkad`).
3. Buat user database dan sambungkan ke database tersebut dengan hak akses penuh (All Privileges).
4. Di komputer lokal Anda, *Export* database `bpkad_db` menjadi file `.sql`.
5. Di phpMyAdmin hosting, *Import* file `.sql` tersebut ke database baru Anda.

---

## Tahap 2: Persiapan Backend (API)
1. Buka file `backend/config.php` di project Anda menggunakan kode editor.
2. Ubah konfigurasi database agar sesuai dengan database di hosting:
   ```php
   $host = '127.0.0.1'; // Biasanya tetap 127.0.0.1 atau localhost
   $db   = 'u123456_bpkad'; // Ganti dengan nama DB di hosting
   $user = 'u123456_userdb'; // Ganti dengan user DB
   $pass = 'password_db_kamu'; // Ganti dengan password DB
   ```
3. Kompres folder `backend` menjadi `backend.zip`.

---

## Tahap 3: Build Frontend (React)
1. Buka file `frontend/.env.production` (atau buat file-nya jika belum ada).
2. Pastikan `VITE_API_BASE_URL` mengarah ke folder backend:
   ```env
   VITE_API_BASE_URL=/backend
   ```
3. Buka terminal di komputer Anda, masuk ke folder `frontend`, lalu jalankan:
   ```bash
   npm run build
   ```
4. Proses ini akan membuat folder baru bernama `dist` (berisi file-file yang sudah di-compile).
5. Buka folder `frontend/dist/`, lalu pilih semua isinya (termasuk file `.htaccess` jika ada) dan kompres menjadi file `frontend.zip`.

---

## Tahap 4: Upload ke File Manager Hosting
1. Buka **File Manager** di panel hosting (hPanel/cPanel).
2. Masuk ke dalam folder **`public_html`** (folder utama domain Anda).
3. **Upload `frontend.zip`** ke dalam `public_html`, lalu ekstrak (Extract).
   - Pastikan file `index.html` dan `assets` berada persis di dalam `public_html`.
   - Pastikan file `.htaccess` (bawaan React) juga terekstrak di sana.
4. Di dalam `public_html`, buat folder baru bernama **`backend`**.
5. Masuk ke folder `backend` yang baru dibuat, lalu **Upload `backend.zip`** dan ekstrak di sana.
   - Pastikan file `index.php` dan `config.php` berada di dalam folder `public_html/backend/`.
6. Hapus file `.zip` agar menghemat ruang hosting.

---

## Tahap 5: Verifikasi Pengecekan

1. Buka domain website Anda (misal: `https://domainkamu.com`).
2. Pastikan halaman Login React muncul tanpa error.
3. Coba login menggunakan akun Anda. Jika berhasil, berarti koneksi React -> PHP -> Database berjalan sempurna!
4. Coba tes unggah dokumen. File harus tersimpan di `/backend/uploads/` dan tercatat di riwayat aktivitas.

**Selesai! Aplikasi Anda sudah berhasil di-*hosting*.**
