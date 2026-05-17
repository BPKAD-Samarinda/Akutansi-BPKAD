# Troubleshooting Hostinger VPS

Panduan ini untuk kasus umum setelah deploy Akutansi-BPKAD di Hostinger VPS.

## 1. 502 Bad Gateway pada API

Periksa backend dan Nginx:

```bash
pm2 status
pm2 logs bpkad-api --lines 100
ss -tulpn | grep 3001
nginx -t
systemctl status nginx
```

Pastikan config API Nginx mengarah ke:

```nginx
proxy_pass http://127.0.0.1:3001;
```

## 2. API 500 Internal Server Error

Biasanya karena `.env` backend tidak valid.

```bash
cat /var/www/akuntansi-bpkad/backend/.env
pm2 logs bpkad-api --lines 200
```

Pastikan `DB_*`, `JWT_SECRET`, dan `PORT=3001` sudah benar.

## 3. Gagal konek MySQL

```bash
systemctl status mysql
mysql -u root -p
```

Pastikan user database punya akses ke database aplikasi.

## 4. Upload gagal atau 413 Request Entity Too Large

Pastikan Nginx API punya batas upload yang cukup:

```nginx
client_max_body_size 30M;
```

Lalu reload:

```bash
nginx -t && systemctl reload nginx
```

## 5. Frontend gagal akses API (CORS/Mixed Content)

Pastikan `.env.production` frontend:

```env
VITE_API_BASE_URL=https://api.domainkamu.com/api
```

Build ulang frontend:

```bash
cd /var/www/akuntansi-bpkad/frontend
npm run build
systemctl reload nginx
```

## 6. SSL gagal atau certbot error

Periksa:

1. DNS `app` dan `api` sudah mengarah ke IP VPS.
2. Port 80 bisa diakses publik.

Coba ulang:

```bash
certbot --nginx -d app.domainkamu.com -d api.domainkamu.com
```

## 7. Perubahan tidak terlihat setelah update

Jalankan urutan deploy:

```bash
cd /var/www/akuntansi-bpkad/backend
npm install
npm run build
pm2 restart bpkad-api

cd /var/www/akuntansi-bpkad/frontend
npm install
npm run build
systemctl reload nginx
```

## 8. PM2 tidak auto-start setelah reboot

```bash
pm2 save
pm2 startup
pm2 save
```

Jalankan command tambahan dari output `pm2 startup` jika diminta.

## 9. Health check cepat

```bash
curl -I https://app.domainkamu.com
curl -i https://api.domainkamu.com/api/documents
```

Ekspektasi:

- Frontend `200`
- Endpoint `/api/documents` tanpa token `401` (normal)
