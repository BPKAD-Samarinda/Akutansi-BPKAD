import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { getUploadHistories, restoreUploadHistory } from "../services/api";
import { UploadHistory } from "../types";

type UseUploadHistoryParams = {
  initialPage?: number;
  initialLimit?: number;
};

export function useUploadHistory({
  initialPage = 1,
  initialLimit = 10,
}: UseUploadHistoryParams = {}) {
  const [items, setItems] = useState<UploadHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [restoringId, setRestoringId] = useState<number | string | null>(null);
  const [error, setError] = useState<string>("");

  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(initialPage);
  const [limit, setLimit] = useState<number>(initialLimit);
  const [total, setTotal] = useState<number>(0);

  const totalPages = useMemo(() => {
    const value = Math.ceil(total / limit);
    return value > 0 ? value : 1;
  }, [limit, total]);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getUploadHistories({
        page,
        limit,
        search: searchQuery || undefined,
      });

      setItems(result.items);
      setTotal(result.total);
    } catch {
      setError("Gagal memuat riwayat unggah.");
    } finally {
      setLoading(false);
    }
  }, [limit, page, searchQuery]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleSearchSubmit = () => {
    setPage(1);
    setSearchQuery(searchInput.trim());
  };

  const handleRefresh = () => {
    fetchHistory();
  };

  const handleRestore = async (id: number | string): Promise<string> => {
    setRestoringId(id);

    try {
      const response = await restoreUploadHistory(id);
      await fetchHistory();
      return response.message || "Dokumen berhasil direstorasi.";
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return "Endpoint restore belum tersedia di backend.";
      }

      return "Gagal merestorasi dokumen.";
    } finally {
      setRestoringId(null);
    }
  };

  return {
    items,
    loading,
    error,
    restoringId,
    searchInput,
    page,
    limit,
    total,
    totalPages,
    setSearchInput,
    setPage,
    setLimit,
    handleSearchSubmit,
    handleRefresh,
    handleRestore,
  };
}
