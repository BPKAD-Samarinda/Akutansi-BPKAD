# API Mapping Frontend <-> Backend

Dokumen ini memetakan fungsi API di frontend ke endpoint backend yang aktif saat ini.

## Base URL dan Prefix

- Frontend `apiClient` memakai `baseURL` dari `VITE_API_BASE_URL`.
- Jika env kosong, default ke `/api`.
- Prefix route backend:
- `app.use("/api/auth", authRoutes)`
- `app.use("/api", documentRoutes)`
- `app.use("/api/users", userRoutes)`
- `app.use("/api/skp", skpRoutes)`

## Aturan Auth dan Role

- Semua endpoint selain login butuh header `Authorization: Bearer <token>`.
- Jika respons `401`, frontend otomatis clear token dan redirect ke `/login`.
- Otorisasi role divalidasi di backend via middleware `authorizeRoles(...)`.

## Mapping: Auth

| Frontend function | Method | Frontend path (relative) | Backend endpoint final | Auth | Role | Status |
|---|---|---|---|---|---|---|
| `login(username, password)` | `POST` | `/auth/login` | `/api/auth/login` | Tidak | Public | Aktif |

## Mapping: Dashboard

| Frontend function | Method | Frontend path (relative) | Backend endpoint final | Auth | Role | Status |
|---|---|---|---|---|---|---|
| `getDashboardAnalytics()` | `GET` | `/dashboard/analytics` | `/api/dashboard/analytics` | Ya | `Admin`, `Staff`, `Anak Magang`, `Anak PKL`, `Admin Akuntansi`, `Staff Akuntansi` | Aktif |

## Mapping: Documents

| Frontend function | Method | Frontend path (relative) | Backend endpoint final | Auth | Role | Status |
|---|---|---|---|---|---|---|
| `getDocuments()` | `GET` | `/documents` | `/api/documents` | Ya | Semua user terautentikasi | Aktif |
| `updateDocument(id, data)` | `PUT` | `/documents/:id` | `/api/documents/:id` | Ya | `Admin`, `Admin Akuntansi` | Aktif |
| `deleteDocument(id)` | `DELETE` | `/documents/:id` | `/api/documents/:id` | Ya | `Admin`, `Admin Akuntansi` | Aktif |

Catatan:
- Frontend saat ini tidak punya wrapper fungsi `createDocument`, tetapi backend endpoint upload dokumen tersedia di `POST /api/documents`.

## Mapping: Upload History (Document + SKP Aggregated)

| Frontend function | Method | Frontend path (relative) | Backend endpoint final | Auth | Role | Status |
|---|---|---|---|---|---|---|
| `getUploadHistories(query)` | `GET` | `/documents/history` | `/api/documents/history` | Ya | `Admin`, `Admin Akuntansi` | Aktif |
| `restoreUploadHistory(id)` | `POST` | `/documents/history/:id/restore` | `/api/documents/history/:id/restore` | Ya | `Admin`, `Admin Akuntansi` | Aktif |
| `permanentlyDeleteUploadHistory(id)` | `DELETE` | `/documents/history/:id` | `/api/documents/history/:id` | Ya | `Admin`, `Admin Akuntansi` | Aktif |
| `restoreUploadHistories(ids[])` | loop `POST` | `/documents/history/:id/restore` | `/api/documents/history/:id/restore` | Ya | `Admin`, `Admin Akuntansi` | Aktif |
| `permanentlyDeleteUploadHistories(ids[])` | loop `DELETE` | `/documents/history/:id` | `/api/documents/history/:id` | Ya | `Admin`, `Admin Akuntansi` | Aktif |

Catatan penting id history:
- Untuk history dokumen biasa: `id` numerik.
- Untuk history SKP dari endpoint aggregate: `id` berbentuk string `skp-<historyId>`.

## Mapping: SKP Documents

| Frontend function | Method | Frontend path (relative) | Backend endpoint final | Auth | Role | Status |
|---|---|---|---|---|---|---|
| `getSkpDocuments(query)` | `GET` | `/skp` | `/api/skp` | Ya | `Admin`, `Staff`, `Admin Akuntansi`, `Staff Akuntansi` | Aktif |
| `createSkpDocument(payload)` | `POST` | `/skp` | `/api/skp` | Ya | `Admin`, `Staff`, `Admin Akuntansi`, `Staff Akuntansi` | Aktif |
| `updateSkpDocument(id, payload)` | `PUT` | `/skp/:id` | `/api/skp/:id` | Ya | `Admin`, `Admin Akuntansi` | Aktif |
| `deleteSkpDocument(id)` | `DELETE` | `/skp/:id` | `/api/skp/:id` | Ya | `Admin`, `Admin Akuntansi` | Aktif |
| `getSkpHistories(query)` | `GET` | `/skp/history` | `/api/skp/history` | Ya | `Admin`, `Admin Akuntansi` | Aktif |

## Mapping: SKP Restore/Permanent Delete via History Endpoint

| Frontend function | Method | Frontend path (relative) | Backend endpoint final | Auth | Role | Status |
|---|---|---|---|---|---|---|
| `restoreSkpDocument(historyId)` | `POST` | `/documents/history/skp-:historyId/restore` | `/api/documents/history/skp-:historyId/restore` | Ya | `Admin`, `Admin Akuntansi` | Aktif |
| `permanentlyDeleteSkpDocument(historyId)` | `DELETE` | `/documents/history/skp-:historyId` | `/api/documents/history/skp-:historyId` | Ya | `Admin`, `Admin Akuntansi` | Aktif |

Catatan:
- Fungsi di atas sudah disesuaikan ke endpoint backend aktif.
- Backend saat ini tidak menyediakan endpoint `POST /api/skp/:id/restore` dan `DELETE /api/skp/:id/permanent`.

## Mapping: Users

| Frontend function | Method | Frontend path (relative) | Backend endpoint final | Auth | Role | Status |
|---|---|---|---|---|---|---|
| `getUsers()` | `GET` | `/users` | `/api/users` | Ya | `Admin`, `Admin Akuntansi` | Aktif |
| `createUser(payload)` | `POST` | `/users` | `/api/users` | Ya | `Admin`, `Admin Akuntansi` | Aktif |
| `updateUser(id, payload)` | `PUT` | `/users/:id` | `/api/users/:id` | Ya | `Admin`, `Admin Akuntansi` | Aktif |
| `deleteUser(id)` | `DELETE` | `/users/:id` | `/api/users/:id` | Ya | `Admin`, `Admin Akuntansi` | Aktif |

## Endpoint Backend Aktif yang Belum Dibungkus Fungsi Frontend `api.ts`

- `POST /api/documents` (upload dokumen non-SKP)

## Endpoint Utility

- `uploadsBaseUrl` di frontend dipakai untuk akses static file upload.
- Backend melayani static upload di `/uploads`.
