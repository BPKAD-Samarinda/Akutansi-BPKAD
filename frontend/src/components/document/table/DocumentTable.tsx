import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import DocumentTableToolbar from "./DocumentTableToolbar";
import DocumentTableDesktop from "./DocumentTableDesktop";
import DocumentTableMobile from "./DocumentTableMobile";
import DocumentTablePagination from "./DocumentTablePagination";
import { Document } from "../../../types";
import { useDocumentTableState } from "../../../hooks/document/useDocumentTableState";

interface DocumentTableProps {
  documents: Document[];
  totalDocuments: number;
  selectedDocuments: Set<number | string>;
  onView?: (id: number | string) => void;
  onEdit?: (id: number | string) => void;
  onDelete?: (id: number | string) => void;
  onRefresh?: () => void;
  onSelectDocument: (id: number | string) => void;
  onSelectAll: (checked: boolean) => void;
  onUploadClick?: () => void;
}

export default function DocumentTable({
  documents,
  totalDocuments,
  selectedDocuments,
  onView,
  onEdit,
  onDelete,
  onRefresh,
  onSelectDocument,
  onSelectAll,
  onUploadClick,
}: DocumentTableProps) {
  const documentsContentRef = useRef<HTMLDivElement | null>(null);
  const {
    sortOrder,
    currentPage,
    totalPages,
    rowsPerPage,
    currentDocuments,
    goToPage,
    setRowsPerPage,
    handleSortClick,
  } = useDocumentTableState(documents);

  const allSelected =
    currentDocuments.length > 0 &&
    currentDocuments.every((doc) => selectedDocuments.has(doc.id));
  const someSelected =
    currentDocuments.some((doc) => selectedDocuments.has(doc.id)) &&
    !allSelected;

  useEffect(() => {
    if (!documentsContentRef.current) return;

    const paginatedItems = documentsContentRef.current.querySelectorAll(
      "[data-paginated-item]",
    );

    gsap.killTweensOf(documentsContentRef.current);
    gsap.killTweensOf(paginatedItems);

    if (paginatedItems.length > 0) {
      gsap.fromTo(
        paginatedItems,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 1, ease: "power2.out", stagger: 0.025 },
      );
      return;
    }

    gsap.fromTo(
      documentsContentRef.current,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.18, ease: "power2.out" },
    );
  }, [currentPage]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-5 py-3.5 border-b border-gray-100 dark:border-slate-800">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-1 h-6 bg-[#FF7A00] rounded-full" />
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
            Daftar Dokumen
          </h2>
        </div>
        <div className="flex justify-end overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <DocumentTableToolbar
            sortOrder={sortOrder}
            onSortClick={handleSortClick}
            onUploadClick={onUploadClick || (() => {})}
            onRefresh={onRefresh}
          />
        </div>
      </div>

      <div ref={documentsContentRef}>
        <DocumentTableDesktop
          documents={currentDocuments}
          selectedDocuments={selectedDocuments}
          allSelected={allSelected}
          someSelected={someSelected}
          onSelectAll={onSelectAll}
          onSelectDocument={onSelectDocument}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          pageStartIndex={(currentPage - 1) * rowsPerPage + 1}
        />

        <DocumentTableMobile
          documents={currentDocuments}
          selectedDocuments={selectedDocuments}
          onSelectDocument={onSelectDocument}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>

      <div className="px-5 py-4 border-t border-gray-100 dark:border-slate-800">
        <DocumentTablePagination
          totalDocuments={totalDocuments}
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          onPageChange={goToPage}
          onRowsPerPageChange={setRowsPerPage}
        />
      </div>
    </div>
  );
}
