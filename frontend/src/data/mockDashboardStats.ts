export type DashboardCategory = "Lampiran" | "Keuangan" | "BPKU" | "STS";
export type DashboardRole = "Admin" | "Staff";

export type UploadRecord = {
  id: number;
  kategori: DashboardCategory;
  uploadedAt: string; // YYYY-MM-DD
};

export type LoginActivity = {
  id: number;
  username: string;
  role: DashboardRole;
  loginAt: string; // YYYY-MM-DD HH:mm
};

export const categories: DashboardCategory[] = [
  "Lampiran",
  "Keuangan",
  "BPKU",
  "STS",
];

export const monthOptions = [
  { value: 0, label: "Semua Bulan" },
  { value: 1, label: "Januari" },
  { value: 2, label: "Februari" },
  { value: 3, label: "Maret" },
  { value: 4, label: "April" },
  { value: 5, label: "Mei" },
  { value: 6, label: "Juni" },
  { value: 7, label: "Juli" },
  { value: 8, label: "Agustus" },
  { value: 9, label: "September" },
  { value: 10, label: "Oktober" },
  { value: 11, label: "November" },
  { value: 12, label: "Desember" },
];

export const yearOptions = [2025, 2026, 2027];

export const uploadRecords: UploadRecord[] = [
  { id: 1, kategori: "Lampiran", uploadedAt: "2026-01-03" },
  { id: 2, kategori: "Keuangan", uploadedAt: "2026-01-05" },
  { id: 3, kategori: "BPKU", uploadedAt: "2026-01-10" },
  { id: 4, kategori: "STS", uploadedAt: "2026-01-11" },
  { id: 5, kategori: "Lampiran", uploadedAt: "2026-02-12" },
  { id: 6, kategori: "Keuangan", uploadedAt: "2026-02-15" },
  { id: 7, kategori: "BPKU", uploadedAt: "2026-03-02" },
  { id: 8, kategori: "STS", uploadedAt: "2026-03-09" },
  { id: 9, kategori: "STS", uploadedAt: "2026-04-18" },
  { id: 10, kategori: "Lampiran", uploadedAt: "2026-04-20" },
  { id: 11, kategori: "Keuangan", uploadedAt: "2026-05-03" },
  { id: 12, kategori: "BPKU", uploadedAt: "2026-06-10" },
  { id: 13, kategori: "STS", uploadedAt: "2026-06-21" },
  { id: 14, kategori: "Lampiran", uploadedAt: "2026-07-02" },
  { id: 15, kategori: "Keuangan", uploadedAt: "2026-08-14" },
  { id: 16, kategori: "BPKU", uploadedAt: "2026-09-01" },
  { id: 17, kategori: "STS", uploadedAt: "2026-10-05" },
  { id: 18, kategori: "Lampiran", uploadedAt: "2026-11-11" },
  { id: 19, kategori: "Keuangan", uploadedAt: "2026-11-17" },
  { id: 20, kategori: "STS", uploadedAt: "2026-12-29" },
];

export const loginActivities: LoginActivity[] = [
  { id: 1, username: "rahmat", role: "Admin", loginAt: "2026-03-01 08:15" },
  { id: 2, username: "sinta", role: "Staff", loginAt: "2026-03-01 08:31" },
  { id: 3, username: "dina", role: "Staff", loginAt: "2026-03-01 09:03" },
  { id: 4, username: "rahmat", role: "Admin", loginAt: "2026-03-02 07:59" },
  { id: 5, username: "andi", role: "Staff", loginAt: "2026-03-02 08:12" },
  { id: 6, username: "dina", role: "Staff", loginAt: "2026-03-02 08:44" },
];
