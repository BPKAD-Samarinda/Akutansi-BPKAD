# Deploy to VPS

Panduan ini untuk stack:
- Frontend: Vite React (static files)
- Backend: Node.js Express (port 3001)
- Database: MySQL

Contoh domain:
- `app.your-domain.com` untuk frontend
- `api.your-domain.com` untuk backend

## 1. Persiapan DNS

Di DNS manager provider kamu:
- A record `app` -> IP VPS
- A record `api` -> IP VPS

Tunggu propagasi DNS selesai.

## 2. Install dependency server

Jalankan di VPS (Ubuntu):

```bash
sudo apt update
sudo apt install -y nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

## 3. Upload project ke VPS

Contoh folder target:

```bash
sudo mkdir -p /var/www/akuntansi-bpkad
sudo chown -R $USER:$USER /var/www/akuntansi-bpkad
```

Salin source project ke:
- `/var/www/akuntansi-bpkad/frontend`
- `/var/www/akuntansi-bpkad/backend`

## 4. Setup backend

```bash
cd /var/www/akuntansi-bpkad/backend
npm install
cp .env.production.example .env
nano .env
```

Isi `.env` sesuai server production:
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE`
- `JWT_SECRET` (random panjang)
- `PORT=3001`

Build dan run backend:

```bash
npm run build
pm2 start /var/www/akuntansi-bpkad/deploy/vps/ecosystem.config.cjs
pm2 save
pm2 startup
```

## 5. Setup frontend

```bash
cd /var/www/akuntansi-bpkad/frontend
cp .env.production.example .env.production
nano .env.production
```

Set:

```env
VITE_API_BASE_URL=https://api.your-domain.com/api
```

Build frontend:

```bash
npm install
npm run build
```

## 6. Setup Nginx

Copy template config:

```bash
sudo cp /var/www/akuntansi-bpkad/deploy/vps/nginx-app.conf /etc/nginx/sites-available/app.your-domain.com
sudo cp /var/www/akuntansi-bpkad/deploy/vps/nginx-api.conf /etc/nginx/sites-available/api.your-domain.com
```

Edit `server_name` jika perlu:

```bash
sudo nano /etc/nginx/sites-available/app.your-domain.com
sudo nano /etc/nginx/sites-available/api.your-domain.com
```

Aktifkan site:

```bash
sudo ln -s /etc/nginx/sites-available/app.your-domain.com /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/api.your-domain.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 7. SSL (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d app.your-domain.com -d api.your-domain.com
```

## 8. Update deployment berikutnya

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
sudo systemctl reload nginx
```

## 9. Checklist verifikasi

- `https://app.your-domain.com` terbuka
- Login berhasil
- Upload file berhasil
- Tombol Lihat Dokumen membuka file
- `https://api.your-domain.com/api/documents` merespon 401 jika tanpa token (normal)
