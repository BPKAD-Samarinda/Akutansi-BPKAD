import { useEffect, useMemo, useState } from "react";
import type {
  DashboardAnalyticsResponse,
  DashboardApiDocument,
  DashboardApiLoginActivity,
} from "../../services/api";
import { getDashboardAnalytics, getDocuments } from "../../services/api";

type DashboardCategory = "Lampiran" | "Keuangan" | "BPKU" | "STS";
type CategoryFilter = "all" | DashboardCategory;

const categories: DashboardCategory[] = ["Lampiran", "Keuangan", "BPKU", "STS"];

const monthOptions = [
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

type NormalizedUpload = {
  id: number;
  name: string;
  kategori: DashboardCategory;
  uploadedAt: string; // YYYY-MM-DD
};

type NormalizedLogin = {
  id: number;
  username: string;
  role: "Admin" | "Staff";
  loginAt: string; // YYYY-MM-DD HH:mm
};

let analyticsCache: DashboardAnalyticsResponse | null = null;
let analyticsPromise: Promise<DashboardAnalyticsResponse> | null = null;

function normalizeDateOnly(dateText?: string | null): string | null {
  if (!dateText) return null;
  const value = String(dateText);
  if (value.length >= 10) return value.slice(0, 10);
  return null;
}

function normalizeDateTime(dateText?: string | null): string {
  if (!dateText) return "";
  const value = String(dateText).replace("T", " ").slice(0, 16);
  return value;
}

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateLabel(dateText: string) {
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

function toDashboardCategory(category: string): DashboardCategory {
  if (category === "Lampiran") return "Lampiran";
  if (category === "Keuangan") return "Keuangan";
  if (category === "BPKU") return "BPKU";
  return "STS";
}

async function loadAnalyticsShared() {
  if (analyticsCache) return analyticsCache;
  if (!analyticsPromise) {
    analyticsPromise = getDashboardAnalytics().then((result) => {
      analyticsCache = result;
      return result;
    });
  }
  return analyticsPromise;
}

export function useDashboardAnalytics() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const [uploads, setUploads] = useState<NormalizedUpload[]>([]);
  const [logins, setLogins] = useState<NormalizedLogin[]>([]);

  useEffect(() => {
    let mounted = true;

    loadAnalyticsShared()
      .then((payload) => {
        if (!mounted) return;

        const normalizedUploads = payload.documents
          .map((doc: DashboardApiDocument) => {
            const dateOnly =
              normalizeDateOnly(doc.created_at) ||
              normalizeDateOnly(doc.tanggal_sppd) ||
              null;
            if (!dateOnly) return null;

            return {
              id: doc.id,
              name: doc.nama_sppd || `Dokumen_${doc.id}.pdf`,
              kategori: toDashboardCategory(doc.kategori),
              uploadedAt: dateOnly,
            };
          })
          .filter((item): item is NormalizedUpload => item !== null);

        const normalizedLogins = payload.loginActivities.map(
          (row: DashboardApiLoginActivity) => ({
            id: row.id,
            username: row.username,
            role: normalizeRole(row.role),
            loginAt: normalizeDateTime(row.login_at),
          }),
        );

        setUploads(normalizedUploads);
        setLogins(normalizedLogins);
      })
      .catch((error) => {
        console.error("Gagal memuat analytics dashboard:", error);

        // Fallback: tetap isi dashboard dari endpoint dokumen agar tidak kosong.
        getDocuments()
          .then((docs) => {
            if (!mounted) return;
            const fallbackUploads = docs
              .map((doc) => {
                const dateOnly =
                  normalizeDateOnly(doc.created_at) ||
                  normalizeDateOnly(doc.tanggal_sppd) ||
                  null;
                if (!dateOnly) return null;
                return {
                  id: doc.id,
                  name: doc.nama_sppd || `Dokumen_${doc.id}.pdf`,
                  kategori: toDashboardCategory(doc.kategori),
                  uploadedAt: dateOnly,
                };
              })
              .filter((item): item is NormalizedUpload => item !== null);
            setUploads(fallbackUploads);
          })
          .catch((fallbackError) => {
            console.error("Fallback dokumen dashboard gagal:", fallbackError);
          });
      });

    return () => {
      mounted = false;
    };
  }, []);

  const yearOptions = useMemo(() => {
    const years = uploads
      .map((u) => new Date(u.uploadedAt).getFullYear())
      .filter((y) => !Number.isNaN(y));
    const uniqueYears = Array.from(new Set(years)).sort((a, b) => a - b);
    if (uniqueYears.length === 0) return [currentYear];
    return uniqueYears;
  }, [uploads, currentYear]);

  const effectiveSelectedYear = yearOptions.includes(selectedYear)
    ? selectedYear
    : yearOptions[yearOptions.length - 1];

  const filteredUploads = useMemo(() => {
    return uploads.filter((r) => {
      const d = new Date(r.uploadedAt);
      const yearMatch = d.getFullYear() === effectiveSelectedYear;
      const monthMatch = selectedMonth === 0 || d.getMonth() + 1 === selectedMonth;
      const categoryMatch = selectedCategory === "all" || r.kategori === selectedCategory;
      return yearMatch && monthMatch && categoryMatch;
    });
  }, [uploads, effectiveSelectedYear, selectedMonth, selectedCategory]);

  const distributionData = useMemo(() => {
    const target = selectedCategory === "all" ? categories : [selectedCategory];
    return target.map((kategori) => ({
      label: kategori,
      value: filteredUploads.filter((r) => r.kategori === kategori).length,
    }));
  }, [filteredUploads, selectedCategory]);

  const trendData = useMemo(() => {
    const base = Array.from({ length: 12 }, (_, i) => ({
      label: monthOptions[i + 1].label.slice(0, 3),
      value: 0,
    }));

    uploads.forEach((r) => {
      const d = new Date(r.uploadedAt);
      const yearMatch = d.getFullYear() === effectiveSelectedYear;
      const categoryMatch = selectedCategory === "all" || r.kategori === selectedCategory;
      if (!yearMatch || !categoryMatch) return;
      base[d.getMonth()].value += 1;
    });

    return base;
  }, [uploads, effectiveSelectedYear, selectedCategory]);

  const filteredLogins = useMemo(() => {
    return [...logins].sort((a, b) => (a.loginAt < b.loginAt ? 1 : -1));
  }, [logins]);

  const totalDocuments = filteredUploads.length;
  const totalStaffUsers = new Set(
    filteredLogins.filter((x) => x.role === "Staff").map((x) => x.username),
  ).size;
  const totalLogins = filteredLogins.length;
  const categoryOptions = useMemo(() => ["all", ...categories] as const, []);

  const todayUploadCount = useMemo(() => {
    const todayIso = toIsoDate(new Date());
    return uploads.filter((record) => record.uploadedAt === todayIso).length;
  }, [uploads]);

  const latestUploadedDocument = useMemo(() => {
    if (!uploads.length) return null;
    const latest = [...uploads].sort((a, b) => (a.uploadedAt < b.uploadedAt ? 1 : -1))[0];
    return {
      name: latest.name,
      uploadedAt: `${latest.uploadedAt} 00:00`,
    };
  }, [uploads]);

  const todayUploadRows = useMemo(() => {
    const todayIso = toIsoDate(new Date());
    return uploads
      .filter((record) => record.uploadedAt === todayIso)
      .sort((a, b) => (a.id < b.id ? 1 : -1))
      .map((record) => ({
        id: record.id,
        name: record.name,
        kategori: record.kategori,
        tanggal: formatDateLabel(record.uploadedAt),
      }));
  }, [uploads]);

  const latestUploadRows = useMemo(() => {
    return [...uploads]
      .sort((a, b) => (a.uploadedAt < b.uploadedAt ? 1 : -1))
      .slice(0, 7)
      .map((record) => ({
        id: record.id,
        name: record.name,
        kategori: record.kategori,
        tanggal: formatDateLabel(record.uploadedAt),
      }));
  }, [uploads]);

  return {
    selectedYear: effectiveSelectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    selectedCategory,
    setSelectedCategory,
    monthOptions: [...monthOptions],
    yearOptions,
    categoryOptions,
    totalDocuments,
    totalStaffUsers,
    totalLogins,
    todayUploadCount,
    latestUploadedDocument,
    todayUploadRows,
    latestUploadRows,
    distributionData,
    trendData,
    filteredLogins,
  };
}
function normalizeRole(role: string): "Admin" | "Staff" {
  return role.toLowerCase() === "admin" ? "Admin" : "Staff";
}
