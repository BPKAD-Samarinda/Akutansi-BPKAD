# Akutansi-BPKAD

## Overview

Sistem manajemen dokumen akuntansi BPKAD divisi akuntansi, terdiri dari dua bagian utama:

- **Frontend**: React, Vite, TypeScript, TailwindCSS
- **Backend**: Node.js, Express, TypeScript

## Instalasi Cepat

### 1. Backend

```sh
cd backend
npm install
copy .env.example .env
# lalu sesuaikan value DB_* dan JWT_SECRET di file .env
npm run dev
```

### 2. Frontend

```sh
cd frontend
npm install
npm run dev
```

## Struktur Folder

- frontend/ : UI aplikasi
- backend/ : API & server
- akuntansi_bpkad.sql : Contoh/struktur database

## Pengembangan

Lihat README di masing-masing folder untuk detail lebih lanjut.

## Deploy VPS

Template konfigurasi deploy tersedia di:

- `deploy/vps/README.md`
- `deploy/vps/nginx-app.conf`
- `deploy/vps/nginx-api.conf`
- `deploy/vps/ecosystem.config.cjs`
