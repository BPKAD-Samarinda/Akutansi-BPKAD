import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import DocumentTableToolbar from "./DocumentTableToolbar";
import DocumentTableDesktop from "./DocumentTableDesktop";
import DocumentTableMobile from "./DocumentTableMobile";
import DocumentTablePagination from "./DocumentTablePagination";
import { Document } from "../../../types";
import { useDocumentTableState } from "../../../hooks/useDocumentTableState";

interface DocumentTableProps {
  documents: Document[];
  totalDocuments: number;
  selectedDocuments: Set<number | string>;
  onView?: (id: number | string) => void;
  onEdit?: (id: number | string) => void;
  onDelete?: (id: number | string) => void;
  onSelectDocument: (id: number | string) => void;
  onSelectAll: (checked: boolean) => void;
}

export default function DocumentTable({
  documents,
  totalDocuments,
  selectedDocuments,
  onView,
  onEdit,
  onDelete,
  onSelectDocument,
  onSelectAll,
}: DocumentTableProps) {
  const navigate = useNavigate();
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

  const handleUploadClick = () => {
    navigate("/upload");
  };

  const allSelected =
    currentDocuments.length > 0 &&
    currentDocuments.every((doc) => selectedDocuments.has(doc.id));
  const someSelected =
    currentDocuments.some((doc) => selectedDocuments.has(doc.id)) &&
    !allSelected;

  useEffect(() => {
    if (!documentsContentRef.current) {
      return;
    }

    const paginatedItems = documentsContentRef.current.querySelectorAll(
      "[data-paginated-item]",
    );

    gsap.killTweensOf(documentsContentRef.current);
    gsap.killTweensOf(paginatedItems);

    if (paginatedItems.length > 0) {
      gsap.fromTo(
        paginatedItems,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 1,
          ease: "power2.out",
          stagger: 0.025,
        },
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
    <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-6">
      <DocumentTableToolbar
        sortOrder={sortOrder}
        onSortClick={handleSortClick}
        onUploadClick={handleUploadClick}
      />

      <div ref={documentsContentRef} className="overflow-hidden">
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

      <DocumentTablePagination
        totalDocuments={totalDocuments}
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        onPageChange={goToPage}
        onRowsPerPageChange={setRowsPerPage}
      />
    </div>
  );
}
