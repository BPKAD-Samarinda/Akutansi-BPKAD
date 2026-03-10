# Maintenance Rutin

Dokumen ini untuk memastikan aplikasi tetap stabil di production.

## Checklist Harian

- Cek service utama:
  ```bash
  pm2 status
  sudo systemctl status nginx
  ```
- Cek error log backend:
  ```bash
  pm2 logs bpkad-api --lines 100
  ```
- Cek kapasitas disk:
  ```bash
  df -h
  ```

## Checklist Mingguan

- Verifikasi backup database dan uploads tersedia.
- Uji login dan upload dokumen.
- Cek ukuran folder uploads (antisipasi disk penuh).

Contoh:
```bash
du -sh /var/www/akuntansi-bpkad/backend/uploads
```

## Checklist Bulanan

- Update patch OS:
  ```bash
  sudo apt update && sudo apt upgrade -y
  ```
- Review dependency backend/frontend (rencanakan update terkontrol).
- Uji restore backup di staging.
- Cek masa aktif SSL:
  ```bash
  sudo certbot certificates
  ```

## Setelah Deploy Update

1. Restart backend:
   ```bash
   pm2 restart bpkad-api
   ```
2. Reload Nginx:
   ```bash
   sudo systemctl reload nginx
   ```
3. Smoke test:
   - Login
   - Upload dokumen
   - Lihat dokumen
   - Restore/hapus permanen di File History

## Catatan Operasional

- Jangan menjalankan aplikasi production dengan mode development.
- Simpan `.env` production secara aman (jangan di-commit ke git).
- Gunakan akun dengan hak minimum untuk operasi harian.
