# Backup dan Restore

Dokumen ini menjelaskan strategi backup dan restore untuk:
- Database MySQL
- File dokumen yang diunggah (`backend/uploads`)

## Prasyarat

- Akses shell ke server VPS
- User database dengan izin baca/tulis
- Ruang disk cukup untuk file backup

## 1. Backup Database

Contoh command:

```bash
mysqldump -u your_db_user -p akuntansi_bpkad > /var/backups/akuntansi_bpkad_$(date +%F).sql
```

Jika database di host lain:

```bash
mysqldump -h your_db_host -u your_db_user -p akuntansi_bpkad > /var/backups/akuntansi_bpkad_$(date +%F).sql
```

## 2. Backup File Upload

Contoh command:

```bash
tar -czf /var/backups/uploads_$(date +%F).tar.gz -C /var/www/akuntansi-bpkad/backend uploads
```

## 3. Restore Database

1. Siapkan database kosong/target restore.
2. Jalankan:

```bash
mysql -u your_db_user -p akuntansi_bpkad < /var/backups/akuntansi_bpkad_YYYY-MM-DD.sql
```

## 4. Restore File Upload

```bash
tar -xzf /var/backups/uploads_YYYY-MM-DD.tar.gz -C /var/www/akuntansi-bpkad/backend
```

Pastikan permission folder benar:

```bash
sudo chown -R www-data:www-data /var/www/akuntansi-bpkad/backend/uploads
sudo chmod -R 755 /var/www/akuntansi-bpkad/backend/uploads
```

## 5. Jadwal Backup Rekomendasi

- Database: harian (minimal 1x/hari)
- Upload files: harian
- Retensi: 7 harian + 4 mingguan + 3 bulanan

## 6. Verifikasi Backup

- Cek ukuran file backup tidak 0 KB.
- Uji restore di environment staging minimal 1x per bulan.
