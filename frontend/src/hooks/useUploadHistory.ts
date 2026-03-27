import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  getUploadHistories,
  permanentlyDeleteUploadHistories,
  permanentlyDeleteUploadHistory,
  restoreUploadHistories,
  restoreUploadHistory,
} from "../services/api";
import { UploadHistory } from "../types";

type UseUploadHistoryParams = {
  initialPage?: number;
  initialLimit?: number;
};

export function useUploadHistory({
  initialPage = 1,
  initialLimit = 10,
}: UseUploadHistoryParams = {}) {
  const hasFetchedRef = useRef(false);
  const [items, setItems] = useState<UploadHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [restoringId, setRestoringId] = useState<number | string | null>(null);
  const [permanentlyDeletingId, setPermanentlyDeletingId] = useState<
    number | string | null
  >(null);
  const [isRestoringSelected, setIsRestoringSelected] =
    useState<boolean>(false);
  const [isPermanentlyDeletingSelected, setIsPermanentlyDeletingSelected] =
    useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string>("");

  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "diunggah" | "dihapus" | "diedit"
  >("all");
  const [page, setPage] = useState<number>(initialPage);
  const [limit, setLimit] = useState<number>(initialLimit);
  const [total, setTotal] = useState<number>(0);

  const totalPages = useMemo(() => {
    const value = Math.ceil(total / limit);
    return value > 0 ? value : 1;
  }, [limit, total]);

  const restorableItems = useMemo(
    () => items.filter((item) => item.isDeleted),
    [items],
  );

  const selectedRestorableCount = useMemo(
    () =>
      restorableItems.filter((item) => selectedIds.has(String(item.id))).length,
    [restorableItems, selectedIds],
  );

  const allRestorableSelected =
    restorableItems.length > 0 &&
    restorableItems.every((item) => selectedIds.has(String(item.id)));

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getUploadHistories({
        page,
        limit,
        search: searchQuery || undefined,
        status: statusFilter,
      });

      setItems(result.items);
      setTotal(result.total);
    } catch {
      setError("Gagal memuat riwayat unggah.");
    } finally {
      setLoading(false);
    }
  }, [limit, page, searchQuery, statusFilter]);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchHistory();
  }, [fetchHistory]);

  useEffect(() => {
    if (items.length === 0) {
      setSelectedIds(new Set());
      return;
    }

    const validSelectedIds = new Set(
      items.filter((item) => item.isDeleted).map((item) => String(item.id)),
    );

    setSelectedIds((previous) => {
      const next = new Set(
        Array.from(previous).filter((id) => validSelectedIds.has(id)),
      );

      if (next.size === previous.size) {
        return previous;
      }

      return next;
    });
  }, [items]);

  const handleSearchSubmit = () => {
    setPage(1);
    setSearchQuery(searchInput.trim());
  };

  const handleRefresh = () => {
    fetchHistory();
  };

  const handleStatusFilterChange = (
    nextStatus: "all" | "diunggah" | "dihapus" | "diedit",
  ) => {
    setPage(1);
    setStatusFilter(nextStatus);
  };

  const handleToggleSelect = (id: number | string, checked: boolean) => {
    const stringId = String(id);
    setSelectedIds((previous) => {
      const next = new Set(previous);
      if (checked) {
        next.add(stringId);
      } else {
        next.delete(stringId);
      }
      return next;
    });
  };

  const handleToggleSelectAll = (checked: boolean) => {
    if (!checked) {
      setSelectedIds(new Set());
      return;
    }

    setSelectedIds(new Set(restorableItems.map((item) => String(item.id))));
  };

  const handleRestore = async (id: number | string): Promise<string> => {
    setRestoringId(id);

    try {
      const response = await restoreUploadHistory(id);
      await fetchHistory();
      return response.message || "Dokumen berhasil direstorasi.";
    } catch {
      return "Gagal merestorasi dokumen.";
    } finally {
      setRestoringId(null);
    }
  };

  const handleRestoreSelected = async (): Promise<string> => {
    if (selectedIds.size === 0) {
      return "Pilih minimal satu dokumen yang sudah dihapus.";
    }

    setIsRestoringSelected(true);

    try {
      const selectedRestorableIds = Array.from(selectedIds);
      const response = await restoreUploadHistories(selectedRestorableIds);
      await fetchHistory();
      setSelectedIds(new Set());
      return response.message;
    } catch {
      return "Gagal merestorasi dokumen terpilih.";
    } finally {
      setIsRestoringSelected(false);
    }
  };

  const handlePermanentDelete = async (
    id: number | string,
  ): Promise<string> => {
    setPermanentlyDeletingId(id);

    try {
      const response = await permanentlyDeleteUploadHistory(id);
      await fetchHistory();
      setSelectedIds((previous) => {
        const next = new Set(previous);
        next.delete(String(id));
        return next;
      });

      return response.message;
    } catch {
      return "Gagal menghapus dokumen secara permanen.";
    } finally {
      setPermanentlyDeletingId(null);
    }
  };

  const handlePermanentDeleteSelected = async (): Promise<string> => {
    if (selectedIds.size === 0) {
      return "Pilih minimal satu dokumen yang sudah dihapus.";
    }

    setIsPermanentlyDeletingSelected(true);

    try {
      const selectedRestorableIds = Array.from(selectedIds);
      const response =
        await permanentlyDeleteUploadHistories(selectedRestorableIds);
      await fetchHistory();
      setSelectedIds(new Set());
      return response.message;
    } catch {
      return "Gagal menghapus dokumen terpilih secara permanen.";
    } finally {
      setIsPermanentlyDeletingSelected(false);
    }
  };

  return {
    items,
    loading,
    error,
    restoringId,
    permanentlyDeletingId,
    isRestoringSelected,
    isPermanentlyDeletingSelected,
    selectedIds,
    selectedRestorableCount,
    allRestorableSelected,
    searchInput,
    statusFilter,
    page,
    limit,
    total,
    totalPages,
    setSearchInput,
    setPage,
    setLimit,
    handleSearchSubmit,
    handleStatusFilterChange,
    handleRefresh,
    handleToggleSelect,
    handleToggleSelectAll,
    handleRestore,
    handleRestoreSelected,
    handlePermanentDelete,
    handlePermanentDeleteSelected,
  };
}
