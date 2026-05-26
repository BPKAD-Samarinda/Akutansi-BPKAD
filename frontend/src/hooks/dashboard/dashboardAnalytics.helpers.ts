export type DashboardCategory = string;
export type CategoryFilter = string;

export type NormalizedUpload = {
  id: number;
  name: string;
  kategori: DashboardCategory;
  uploadedAt: string; // YYYY-MM-DD (tanggal_sppd)
  createdAt: string; // YYYY-MM-DD (waktu upload real)
  uploadedBy: string;
};

export type NormalizedLogin = {
  id: number;
  username: string;
  role: "Admin" | "Staff" | "Anak PKL" | "Admin Akuntansi" | "Staff Akuntansi";
  loginAt: string; // YYYY-MM-DD HH:mm
};

export type LoginResetMode = "daily" | "weekly";

export const categories: DashboardCategory[] = [
  "Lampiran",
  "Keuangan",
  "BKU",
  "STS",
  "Rekening Koran",
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
] as const;

export const yearOptions = Array.from({ length: 11 }, (_, idx) => 2020 + idx);

export function toLocalIsoDate(value: Date): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function normalizeDateOnly(dateValue?: unknown): string | null {
  if (!dateValue) return null;

  if (dateValue instanceof Date) {
    return toLocalIsoDate(dateValue);
  }

  const raw = String(dateValue).trim();
  if (!raw) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;

  const startsWithDate = /^\d{4}-\d{2}-\d{2}/.test(raw);
  const hasIsoTime = raw.includes("T") || raw.endsWith("Z");
  if (startsWithDate && !hasIsoTime) {
    return raw.slice(0, 10);
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;
  return toLocalIsoDate(parsed);
}

export function normalizeDateTime(dateValue?: unknown): string {
  if (!dateValue) return "";

  if (dateValue instanceof Date) {
    const date = toLocalIsoDate(dateValue);
    const hh = String(dateValue.getHours()).padStart(2, "0");
    const mm = String(dateValue.getMinutes()).padStart(2, "0");
    return `${date} ${hh}:${mm}`;
  }

  const raw = String(dateValue).trim();
  if (!raw) return "";

  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) {
    if (raw.includes("T") || raw.endsWith("Z")) {
      const parsedIso = new Date(raw);
      if (!Number.isNaN(parsedIso.getTime())) {
        const date = toLocalIsoDate(parsedIso);
        const hh = String(parsedIso.getHours()).padStart(2, "0");
        const mm = String(parsedIso.getMinutes()).padStart(2, "0");
        return `${date} ${hh}:${mm}`;
      }
    }
    return raw.replace("T", " ").slice(0, 16);
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return raw.slice(0, 16);
  const date = toLocalIsoDate(parsed);
  const hh = String(parsed.getHours()).padStart(2, "0");
  const mm = String(parsed.getMinutes()).padStart(2, "0");
  return `${date} ${hh}:${mm}`;
}

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isSameLocalDay(dateText: string, targetIso: string) {
  const parsed = new Date(dateText.replace(" ", "T"));
  if (Number.isNaN(parsed.getTime())) {
    return dateText.slice(0, 10) === targetIso;
  }
  return toIsoDate(parsed) === targetIso;
}

export function isInCurrentLocalWeek(dateText: string) {
  const parsed = new Date(dateText.replace(" ", "T"));
  if (Number.isNaN(parsed.getTime())) return false;

  const now = new Date();
  const nowDay = now.getDay();
  const mondayOffset = nowDay === 0 ? 6 : nowDay - 1;
  const weekStart = new Date(now);
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(now.getDate() - mondayOffset);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);
  return parsed >= weekStart && parsed < weekEnd;
}

export function formatDateLabel(dateText: string) {
  const [year, month, day] = dateText.split("-");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  const monthIndex = Number(month) - 1;
  if (monthIndex < 0 || monthIndex > 11) return dateText;
  return `${day} ${monthNames[monthIndex]} ${year}`;
}

export function toDashboardCategory(category: string): string {
  const trimmed = String(category || "").trim();
  if (trimmed === "BPKU" || trimmed === "BKU") return "BKU";
  if (trimmed === "Rekening Koran") return "Rekening Koran";
  if (trimmed === "Keuangan") return "Keuangan";
  if (trimmed === "Lampiran") return "Lampiran";
  if (trimmed === "STS") return "STS";
  return trimmed || "STS";
}

// Deterministic coloring helpers
const CATEGORY_COLOR_PAIRS: Record<string, { light: string; dark: string }> = {
  Lampiran: { light: "#E0E7FF", dark: "#6366F1" }, // indigo
  Keuangan: { light: "#CFFAFE", dark: "#06B6D4" }, // cyan
  BKU: { light: "#CCFBF1", dark: "#14B8A6" },      // teal
  STS: { light: "#EDE9FE", dark: "#8B5CF6" },      // violet
  "Rekening Koran": { light: "#FFE4E6", dark: "#F43F5E" }, // rose
};

const FALLBACK_PAIRS = [
  { light: "#D1FAE5", dark: "#10B981" }, // Emerald
  { light: "#FEF3C7", dark: "#F59E0B" }, // Amber
  { light: "#FFEDD5", dark: "#F97316" }, // Orange
  { light: "#FDF4FF", dark: "#D946EF" }, // Fuchsia
  { light: "#DBEAFE", dark: "#3B82F6" }, // Blue
  { light: "#FCE7F3", dark: "#EC4899" }, // Pink
  { light: "#F3E8FF", dark: "#A855F7" }, // Purple
];

function getHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function getCategoryColorPair(category: string): { light: string; dark: string } {
  if (CATEGORY_COLOR_PAIRS[category]) {
    return CATEGORY_COLOR_PAIRS[category];
  }
  const hash = getHash(category);
  const index = hash % FALLBACK_PAIRS.length;
  return FALLBACK_PAIRS[index];
}

export function normalizeRole(
  role: string,
): "Admin" | "Staff" | "Anak PKL" | "Admin Akuntansi" | "Staff Akuntansi" {
  const normalizedRole = String(role || "").trim().toLowerCase();
  if (!normalizedRole) return "Staff";
  if (normalizedRole.includes("admin akuntansi")) return "Admin Akuntansi";
  if (normalizedRole.includes("staff akuntansi")) return "Staff Akuntansi";
  if (normalizedRole.includes("pkl")) return "Anak PKL";
  if (normalizedRole.includes("admin")) return "Admin";
  return "Staff";
}
