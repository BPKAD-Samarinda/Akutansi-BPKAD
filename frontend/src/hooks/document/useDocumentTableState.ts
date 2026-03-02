import { useMemo, useState } from "react";
import { Document } from "../../types";

export type SortOrder = "newest" | "oldest" | null;

const toTimestamp = (value: string) => {
  const dateOnly = (value || "").slice(0, 10);
  const [year, month, day] = dateOnly.split("-").map(Number);
  if (!year || !month || !day) return 0;
  return new Date(year, month - 1, day).getTime();
};

export function useDocumentTableState(documents: Document[]) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPageState] = useState(10);

  const sortedDocuments = useMemo(() => {
    return [...documents].sort((a, b) => {
      if (!sortOrder) return 0;
      const dateA = toTimestamp(a.tanggal_sppd);
      const dateB = toTimestamp(b.tanggal_sppd);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  }, [documents, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedDocuments.length / rowsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (safeCurrentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentDocuments = sortedDocuments.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const setRowsPerPage = (value: number) => {
    setRowsPerPageState(value);
    setCurrentPage(1); // pindah ke page 1 saat rows berubah (tanpa useEffect)
  };

  const handleSortClick = (order: "newest" | "oldest") => {
    setSortOrder(order);
  };

  return {
    sortOrder,
    currentPage: safeCurrentPage,
    totalPages,
    rowsPerPage,
    currentDocuments,
    goToPage,
    setRowsPerPage,
    handleSortClick,
  };
}
