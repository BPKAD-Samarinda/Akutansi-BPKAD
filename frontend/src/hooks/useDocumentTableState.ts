import { useEffect, useMemo, useState } from "react";
import { Document } from "../types";

export type SortOrder = "newest" | "oldest" | null;

export function useDocumentTableState(documents: Document[]) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const sortedDocuments = useMemo(() => {
    return [...documents].sort((a, b) => {
      if (!sortOrder) return 0;

      const dateA = new Date(a.tanggal_sppd);
      const dateB = new Date(b.tanggal_sppd);

      if (sortOrder === "newest") {
        return dateB.getTime() - dateA.getTime();
      }

      return dateA.getTime() - dateB.getTime();
    });
  }, [documents, sortOrder]);

  const totalPages = Math.max(
    1,
    Math.ceil(sortedDocuments.length / rowsPerPage),
  );
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentDocuments = sortedDocuments.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [rowsPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSortClick = (order: "newest" | "oldest") => {
    setSortOrder(order);
  };

  return {
    sortOrder,
    currentPage,
    totalPages,
    rowsPerPage,
    currentDocuments,
    goToPage,
    setRowsPerPage,
    handleSortClick,
  };
}
