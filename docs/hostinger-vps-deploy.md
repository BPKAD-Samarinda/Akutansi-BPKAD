# Deploy Akutansi-BPKAD di Hostinger VPS

Panduan ini khusus untuk deployment di Hostinger VPS (Ubuntu) dengan arsitektur:

- Frontend: Vite React (static files via Nginx)
- Backend: Node.js Express (PM2, port 3001)
- Database: MySQL

Contoh domain:

- `app.domainkamu.com` untuk frontend
- `api.domainkamu.com` untuk backend

## 1. Persiapan Hostinger dan DNS

1. Gunakan paket Hostinger VPS (bukan shared hosting biasa).
2. Buat DNS record:
- `app` -> IP VPS
- `api` -> IP VPS
3. Tunggu propagasi DNS selesai.

## 2. Login ke VPS

```bash
ssh root@IP_VPS
```

## 3. Install dependency server

```bash
apt update
apt install -y nginx mysql-server
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm install -g pm2
```

## 4. Siapkan folder project

```bash
mkdir -p /var/www/akuntansi-bpkad
chown -R $USER:$USER /var/www/akuntansi-bpkad
```

Upload source project ke:

- `/var/www/akuntansi-bpkad/frontend`
- `/var/www/akuntansi-bpkad/backend`

## 5. Setup backend

```bash
cd /var/www/akuntansi-bpkad/backend
npm install
cp .env.example .env
nano .env
```

Isi `.env`:

- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_DATABASE`
- `JWT_SECRET`
- `PORT=3001`

Build dan jalankan backend:

```bash
npm run build
pm2 start /var/www/akuntansi-bpkad/deploy/vps/ecosystem.config.cjs
pm2 save
pm2 startup
```

## 6. Setup frontend

```bash
cd /var/www/akuntansi-bpkad/frontend
npm install
cp .env.production.example .env.production
nano .env.production
```

Set:

```env
VITE_API_BASE_URL=https://api.domainkamu.com/api
```

Build frontend:

```bash
npm run build
```

## 7. Setup Nginx

Copy template:

```bash
cp /var/www/akuntansi-bpkad/deploy/vps/nginx-app.conf /etc/nginx/sites-available/app.domainkamu.com
cp /var/www/akuntansi-bpkad/deploy/vps/nginx-api.conf /etc/nginx/sites-available/api.domainkamu.com
```

Edit file config:

```bash
nano /etc/nginx/sites-available/app.domainkamu.com
nano /etc/nginx/sites-available/api.domainkamu.com
```

Penyesuaian wajib:

1. Ganti `server_name` sesuai domain.
2. Di config API, samakan batas upload dengan backend:

```nginx
client_max_body_size 30M;
```

Aktifkan site:

```bash
ln -s /etc/nginx/sites-available/app.domainkamu.com /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/api.domainkamu.com /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

## 8. Setup SSL

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d app.domainkamu.com -d api.domainkamu.com
```

## 9. Verifikasi cepat

1. `https://app.domainkamu.com` terbuka.
2. Login berhasil.
3. Upload file berhasil.
4. Tombol lihat dokumen membuka file.
5. `https://api.domainkamu.com/api/documents` tanpa token merespon `401` (normal).

## 10. Update deployment berikutnya

```bash
cd /var/www/akuntansi-bpkad/backend
git pull
npm install
npm run build
pm2 restart bpkad-api

cd /var/www/akuntansi-bpkad/frontend
git pull
npm install
npm run build
systemctl reload nginx
```
