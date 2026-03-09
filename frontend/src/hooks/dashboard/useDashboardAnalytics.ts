import { useEffect, useMemo, useState } from "react";
import type {
  DashboardApiDocument,
  DashboardAnalyticsResponse,
  DashboardApiLoginActivity,
} from "../../services/api";
import { getDashboardAnalytics, getDocuments } from "../../services/api";
import {
  categories,
  formatDateLabel,
  isInCurrentLocalWeek,
  isSameLocalDay,
  monthOptions,
  yearOptions,
  normalizeDateOnly,
  normalizeDateTime,
  normalizeRole,
  toDashboardCategory,
  toIsoDate,
  type CategoryFilter,
  type LoginResetMode,
  type NormalizedLogin,
  type NormalizedUpload,
} from "./dashboardAnalytics.helpers";
const LOGIN_RESET_MODE: LoginResetMode = "daily";
type TrendMode = "daily" | "monthly";

let dashboardAnalyticsCache: DashboardAnalyticsResponse | null = null;
let dashboardAnalyticsPromise: Promise<DashboardAnalyticsResponse> | null = null;

async function loadAnalyticsShared() {
  if (dashboardAnalyticsCache) {
    return dashboardAnalyticsCache;
  }

  if (!dashboardAnalyticsPromise) {
    dashboardAnalyticsPromise = getDashboardAnalytics()
      .then((payload) => {
        dashboardAnalyticsCache = payload;
        return payload;
      })
      .catch((error) => {
        dashboardAnalyticsPromise = null;
        throw error;
      });
  }

  return dashboardAnalyticsPromise;
}

export function useDashboardAnalytics() {
  const [selectedYear, setSelectedYear] = useState<number>(0);
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const [uploads, setUploads] = useState<NormalizedUpload[]>([]);
  const [logins, setLogins] = useState<NormalizedLogin[]>([]);
  const [usersCount, setUsersCount] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [todayKey, setTodayKey] = useState<string>(() => toIsoDate(new Date()));

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const scheduleMidnightRefresh = () => {
      const now = new Date();
      const nextMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0,
        0,
        1,
      );
      const delay = nextMidnight.getTime() - now.getTime();

      timer = setTimeout(() => {
        setTodayKey(toIsoDate(new Date()));
        scheduleMidnightRefresh();
      }, Math.max(delay, 1000));
    };

    scheduleMidnightRefresh();

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let mounted = true;

    loadAnalyticsShared()
      .then((payload) => {
        if (!mounted) return;

        const normalizedUploads = payload.documents
          .map((doc: DashboardApiDocument) => {
            const dateOnly = normalizeDateOnly(doc.tanggal_sppd) || null;
            const createdAtOnly = normalizeDateOnly(doc.created_at) || null;
            if (!dateOnly) return null;

            return {
              id: doc.id,
              name: doc.nama_sppd || `Dokumen_${doc.id}.pdf`,
              kategori: toDashboardCategory(doc.kategori),
              uploadedAt: dateOnly,
              createdAt: createdAtOnly || dateOnly,
            };
          })
          .filter((item): item is NormalizedUpload => item !== null);

        const normalizedLogins = payload.loginActivities.map(
          (row: DashboardApiLoginActivity) => ({
            id: row.id,
            username: row.username,
            role: normalizeRole(row.role),
            loginAt: normalizeDateTime(row.login_at as unknown),
          }),
        );

        setUploads(normalizedUploads);
        setLogins(normalizedLogins);
        setUsersCount(Number(payload.totalUsers ?? 0));
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error("Gagal memuat analytics dashboard:", error);

        // Fallback: tetap isi dashboard dari endpoint dokumen agar tidak kosong.
        getDocuments()
          .then((docs) => {
            if (!mounted) return;
            const fallbackUploads = docs
              .map((doc) => {
                const dateOnly = normalizeDateOnly(doc.tanggal_sppd) || null;
                if (!dateOnly) return null;
                return {
                  id: doc.id,
                  name: doc.nama_sppd || `Dokumen_${doc.id}.pdf`,
                  kategori: toDashboardCategory(doc.kategori),
                  uploadedAt: dateOnly,
                  createdAt: normalizeDateOnly(doc.created_at) || dateOnly,
                };
              })
              .filter((item): item is NormalizedUpload => item !== null);
            setUploads(fallbackUploads);
            setUsersCount(0);
            setIsLoaded(true);
          })
          .catch((fallbackError) => {
            console.error("Fallback dokumen dashboard gagal:", fallbackError);
            setIsLoaded(true);
          });
      });

    return () => {
      mounted = false;
    };
  }, []);

  const filteredUploads = useMemo(() => {
    return uploads.filter((r) => {
      const [yearText, monthText] = r.uploadedAt.split("-");
      const yearValue = Number(yearText);
      const monthValue = Number(monthText);
      const yearMatch = selectedYear === 0 || yearValue === selectedYear;
      const monthMatch = selectedMonth === 0 || monthValue === selectedMonth;
      const categoryMatch = selectedCategory === "all" || r.kategori === selectedCategory;
      return yearMatch && monthMatch && categoryMatch;
    });
  }, [uploads, selectedYear, selectedMonth, selectedCategory]);

  const distributionData = useMemo(() => {
    const target = selectedCategory === "all" ? categories : [selectedCategory];
    return target.map((kategori) => ({
      label: kategori,
      value: filteredUploads.filter((r) => r.kategori === kategori).length,
    }));
  }, [filteredUploads, selectedCategory]);

  const trendData = useMemo(() => {
    if (selectedYear !== 0 && selectedMonth !== 0) {
      const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
      const daily = Array.from({ length: daysInMonth }, (_, idx) => ({
        label: String(idx + 1),
        value: 0,
      }));

      uploads.forEach((r) => {
        const categoryMatch = selectedCategory === "all" || r.kategori === selectedCategory;
        if (!categoryMatch) return;
        const [yearText, monthText, dayText] = r.uploadedAt.split("-");
        const yearValue = Number(yearText);
        const monthValue = Number(monthText);
        const dayValue = Number(dayText);
        if (yearValue !== selectedYear) return;
        if (monthValue !== selectedMonth) return;
        if (dayValue < 1 || dayValue > daysInMonth) return;
        // Mode harian menampilkan status upload:
        // 1 = ada upload di tanggal tersebut, 0 = tidak ada upload.
        daily[dayValue - 1].value = 1;
      });

      return daily;
    }

    const base = Array.from({ length: 12 }, (_, i) => ({
      label: monthOptions[i + 1].label.slice(0, 3),
      value: 0,
    }));

    uploads.forEach((r) => {
      const [yearText, monthText] = r.uploadedAt.split("-");
      const yearValue = Number(yearText);
      const monthValue = Number(monthText);
      const yearMatch = selectedYear === 0 || yearValue === selectedYear;
      const categoryMatch = selectedCategory === "all" || r.kategori === selectedCategory;
      if (!yearMatch || !categoryMatch) return;
      if (monthValue < 1 || monthValue > 12) return;
      base[monthValue - 1].value += 1;
    });

    return base;
  }, [uploads, selectedYear, selectedMonth, selectedCategory]);

  const trendMode: TrendMode =
    selectedYear !== 0 && selectedMonth !== 0 ? "daily" : "monthly";

  const trendUploadDays = useMemo(
    () => trendData.filter((item) => item.value > 0).length,
    [trendData],
  );

  const trendEmptyDays = useMemo(
    () => trendData.filter((item) => item.value === 0).length,
    [trendData],
  );

  const trendUploadCount = useMemo(() => {
    if (trendMode !== "daily") return 0;

    return uploads.filter((r) => {
      const [yearText, monthText] = r.uploadedAt.split("-");
      const yearValue = Number(yearText);
      const monthValue = Number(monthText);
      const yearMatch = yearValue === selectedYear;
      const monthMatch = monthValue === selectedMonth;
      const categoryMatch = selectedCategory === "all" || r.kategori === selectedCategory;
      return yearMatch && monthMatch && categoryMatch;
    }).length;
  }, [
    trendMode,
    uploads,
    selectedYear,
    selectedMonth,
    selectedCategory,
  ]);

  const filteredLogins = useMemo(() => {
    return [...logins]
      .filter((item) => {
        if (LOGIN_RESET_MODE === "weekly") return isInCurrentLocalWeek(item.loginAt);
        return isSameLocalDay(item.loginAt, todayKey);
      })
      .sort((a, b) => (a.loginAt < b.loginAt ? 1 : -1));
  }, [logins, todayKey]);

  const totalDocuments = filteredUploads.length;
  const totalUsers = usersCount;
  const totalLogins = filteredLogins.length;
  const categoryOptions = useMemo(() => ["all", ...categories] as const, []);

  const todayUploadCount = useMemo(() => {
    const todayIso = toIsoDate(new Date());
    return uploads.filter((record) => record.createdAt === todayIso).length;
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
      .filter((record) => record.createdAt === todayIso)
      .sort((a, b) => (a.id < b.id ? 1 : -1))
      .map((record) => ({
        id: record.id,
        name: record.name,
        kategori: record.kategori,
        tanggal: formatDateLabel(record.createdAt),
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
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    selectedCategory,
    setSelectedCategory,
    monthOptions: [...monthOptions],
    yearOptions,
    categoryOptions,
    totalDocuments,
    totalUsers,
    totalLogins,
    todayUploadCount,
    latestUploadedDocument,
    todayUploadRows,
    latestUploadRows,
    distributionData,
    trendData,
    trendMode,
    trendUploadDays,
    trendEmptyDays,
    trendUploadCount,
    filteredLogins,
    isLoaded,
  };
}
