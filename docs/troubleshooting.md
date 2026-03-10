# Troubleshooting

Dokumen ini berisi masalah umum dan langkah cepat penanganan.

## 1. Tidak Bisa Login / 401 Unauthorized

Gejala:
- Setelah login tetap kembali ke halaman login
- API membalas `401`

Cek:
1. Pastikan `JWT_SECRET` backend benar dan tidak kosong.
2. Pastikan waktu server sinkron (NTP aktif).
3. Cek token tersimpan di browser (`sessionStorage`/`localStorage`).
4. Cek response API login di browser network tab.

## 2. CORS Error di Browser

Gejala:
- Error CORS saat akses API dari frontend

Cek:
1. Pastikan frontend memanggil URL API yang benar di `.env.production`.
2. Pastikan Nginx API domain aktif dan mengarah ke backend.
3. Jika perlu, batasi/atur origin CORS di backend sesuai domain frontend.

## 3. Upload Gagal

Gejala:
- File tidak terunggah
- Muncul pesan gagal upload

Cek:
1. Ukuran file maksimum 10 MB.
2. Tipe file harus sesuai daftar yang diizinkan.
3. Pastikan folder `backend/uploads` ada dan writable.
4. Cek log backend/PM2 untuk detail error.

## 4. API Tidak Merespons

Cek:
1. Status PM2:
   ```bash
   pm2 status
   pm2 logs bpkad-api --lines 200
   ```
2. Status Nginx:
   ```bash
   sudo systemctl status nginx
   sudo nginx -t
   ```
3. Uji lokal server:
   ```bash
   curl -I http://127.0.0.1:3001/api/documents
   ```

## 5. Halaman Frontend Blank

Cek:
1. Build frontend berhasil (`npm run build`).
2. Nginx root mengarah ke `frontend/dist`.
3. Konfigurasi SPA fallback aktif:
   - `try_files $uri $uri/ /index.html;`

## 6. SSL Bermasalah

Cek:
1. Sertifikat valid dan belum expired.
2. Perbarui sertifikat:
   ```bash
   sudo certbot renew --dry-run
   ```
