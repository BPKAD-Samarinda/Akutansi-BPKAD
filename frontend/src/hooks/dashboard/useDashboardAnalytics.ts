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

async function loadAnalyticsShared() {
  return getDashboardAnalytics();
}

export function useDashboardAnalytics() {
  const [selectedYear, setSelectedYear] = useState<number>(0);
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const [uploads, setUploads] = useState<NormalizedUpload[]>([]);
  const [skpUploads, setSkpUploads] = useState<NormalizedUpload[]>([]);
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

        const safeDocuments = Array.isArray(payload?.documents)
          ? payload.documents
          : [];
        const safeLoginActivities = Array.isArray(payload?.loginActivities)
          ? payload.loginActivities
          : [];
        const safeSkpDocuments = Array.isArray(payload?.skpDocuments)
          ? payload.skpDocuments
          : [];

        const normalizedUploads = safeDocuments
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
              uploadedBy: doc.uploaded_by || "-",
            };
          })
          .filter((item): item is NormalizedUpload => item !== null);

        const normalizedLogins = safeLoginActivities.map(
          (row: DashboardApiLoginActivity) => ({
            id: row.id,
            username: row.username,
            role: normalizeRole(row.role),
            loginAt: normalizeDateTime(row.login_at as unknown),
          }),
        );

        const normalizedSkpUploads = safeSkpDocuments
          .map((doc): NormalizedUpload | null => {
            const createdAtOnly = normalizeDateOnly(doc.created_at) || null;
            if (!createdAtOnly) return null;

            return {
              id: Number(doc.id),
              name: doc.nama_skp || `SKP_${doc.id}.pdf`,
              kategori: toDashboardCategory("Keuangan"),
              uploadedAt: createdAtOnly,
              createdAt: createdAtOnly,
              uploadedBy: doc.uploaded_by || "-",
            };
          })
          .filter((item): item is NormalizedUpload => item !== null);

        setUploads(normalizedUploads);
        setSkpUploads(normalizedSkpUploads);
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
                  uploadedBy: "-",
                };
              })
              .filter((item): item is NormalizedUpload => item !== null);
            setUploads(fallbackUploads);
            setSkpUploads([]);
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

  const dynamicCategories = useMemo(() => {
    const defaultCats = ["Lampiran", "Keuangan", "BKU", "STS", "Rekening Koran"];
    const foundCats = uploads.map((r) => r.kategori);
    return Array.from(new Set([...defaultCats, ...foundCats]));
  }, [uploads]);

  const distributionData = useMemo(() => {
    const target = selectedCategory === "all" ? dynamicCategories : [selectedCategory];
    return target.map((kategori) => ({
      label: kategori,
      value: filteredUploads.filter((r) => r.kategori === kategori).length,
    }));
  }, [filteredUploads, selectedCategory, dynamicCategories]);

  const trendData = useMemo(() => {
    if (selectedYear !== 0 && selectedMonth !== 0) {
      const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
      const daily = Array.from({ length: daysInMonth }, (_, idx) => ({
        label: String(idx + 1),
        value: 0,
      }));

      filteredUploads.forEach((r) => {
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
      label: monthOptions[i + 1]?.label?.slice(0, 3) ?? String(i + 1),
      value: 0,
    }));

    filteredUploads.forEach((r) => {
      const [, monthText] = r.uploadedAt.split("-");
      const monthValue = Number(monthText);
      if (monthValue < 1 || monthValue > 12) return;
      base[monthValue - 1].value += 1;
    });

    return base;
  }, [filteredUploads, selectedYear, selectedMonth]);

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
    return filteredUploads.length;
  }, [
    trendMode,
    filteredUploads,
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
  const totalSkpDocuments = skpUploads.length;
  const totalUsers = usersCount;
  const totalLogins = filteredLogins.length;
  const categoryOptions = useMemo(() => ["all", ...dynamicCategories], [dynamicCategories]);

  const todayUploadCount = useMemo(() => {
    const todayIso = toIsoDate(new Date());
    const documentToday = uploads.filter((record) => record.createdAt === todayIso).length;
    const skpToday = skpUploads.filter((record) => record.createdAt === todayIso).length;
    return documentToday + skpToday;
  }, [uploads, skpUploads]);

  const allUploadsMerged = useMemo(() => {
    const docItems = uploads.map((r) => ({ ...r, uniqueId: `doc-${r.id}` }));
    const skpItems = skpUploads.map((r) => ({ ...r, uniqueId: `skp-${r.id}` }));
    return [...docItems, ...skpItems].sort((a, b) => {
      const dateA = a.createdAt || a.uploadedAt;
      const dateB = b.createdAt || b.uploadedAt;
      return dateB.localeCompare(dateA);
    });
  }, [uploads, skpUploads]);

  const latestUploadedDocument = useMemo(() => {
    if (!allUploadsMerged.length) return null;
    const latest = allUploadsMerged[0];
    return {
      name: latest.name,
      uploadedAt: `${latest.createdAt || latest.uploadedAt} 00:00`,
    };
  }, [allUploadsMerged]);

  const todayUploadRows = useMemo(() => {
    const todayIso = toIsoDate(new Date());
    return allUploadsMerged
      .filter((record) => record.createdAt === todayIso)
      .map((record) => ({
        id: record.uniqueId,
        name: record.uploadedBy || "-",
        kategori: record.kategori,
        tanggalDokumen: formatDateLabel(record.uploadedAt),
        tanggalUnggah: formatDateLabel(record.createdAt),
        fileName: record.name,
      }));
  }, [allUploadsMerged]);

  const latestUploadRows = useMemo(() => {
    return allUploadsMerged
      .slice(0, 10)
      .map((record) => ({
        id: record.uniqueId,
        name: record.uploadedBy || "-",
        kategori: record.kategori,
        tanggalDokumen: formatDateLabel(record.uploadedAt),
        tanggalUnggah: formatDateLabel(record.createdAt),
        fileName: record.name,
      }));
  }, [allUploadsMerged]);

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
    totalSkpDocuments,
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
