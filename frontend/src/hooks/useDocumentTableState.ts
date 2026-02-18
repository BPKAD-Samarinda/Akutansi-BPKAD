import { useMemo, useState } from "react";
import { Document } from "../types";
import { parseIndonesianDate } from "../utils/dateUtils";

export type SortOrder = "newest" | "oldest" | null;

export function useDocumentTableState(
  documents: Document[],
  totalDocuments: number,
) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const sortedDocuments = useMemo(() => {
    return [...documents].sort((a, b) => {
      if (!sortOrder) return 0;

      const dateA = parseIndonesianDate(a.date);
      const dateB = parseIndonesianDate(b.date);

      if (sortOrder === "newest") {
        return dateB.getTime() - dateA.getTime();
      }

      return dateA.getTime() - dateB.getTime();
    });
  }, [documents, sortOrder]);

  const totalPages = Math.ceil(totalDocuments / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDocuments = sortedDocuments.slice(startIndex, endIndex);

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
    currentDocuments,
    goToPage,
    handleSortClick,
  };
}
