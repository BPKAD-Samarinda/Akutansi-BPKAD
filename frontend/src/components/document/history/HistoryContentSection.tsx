import { useEffect, useRef } from "react";
import gsap from "gsap";
import HistoryToolbar from "./HistoryToolbar";
import HistoryTable from "./HistoryTable";
import HistoryPagination from "./HistoryPagination";
import HistoryState from "./HistoryState";
import { UploadHistory } from "../../../types";

type HistoryContentSectionProps = {
  items: UploadHistory[];
  loading: boolean;
  error: string;
  restoringId: number | string | null;
  isRestoringSelected: boolean;
  selectedIds: Set<string>;
  selectedRestorableCount: number;
  allRestorableSelected: boolean;
  searchValue: string;
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  onSearchValueChange: (value: string) => void;
  onSearchSubmit: () => void;
  onRefresh: () => void;
  onToggleSelectAll: (checked: boolean) => void;
  onToggleSelect: (id: number | string, checked: boolean) => void;
  onRestore: (id: number | string) => void;
  onRestoreSelected: () => void;
  onPageChange: (nextPage: number) => void;
  onPageSizeChange: (nextSize: number) => void;
};

export default function HistoryContentSection({
  items,
  loading,
  error,
  restoringId,
  isRestoringSelected,
  selectedIds,
  selectedRestorableCount,
  allRestorableSelected,
  searchValue,
  page,
  pageSize,
  totalItems,
  totalPages,
  onSearchValueChange,
  onSearchSubmit,
  onRefresh,
  onToggleSelectAll,
  onToggleSelect,
  onRestore,
  onRestoreSelected,
  onPageChange,
  onPageSizeChange,
}: HistoryContentSectionProps) {
  const selectedToolbarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedRestorableCount <= 0 || !selectedToolbarRef.current) {
      return;
    }

    gsap.killTweensOf(selectedToolbarRef.current);
    gsap.fromTo(
      selectedToolbarRef.current,
      { autoAlpha: 0, y: -8 },
      { autoAlpha: 1, y: 0, duration: 0.28, ease: "power2.out" },
    );
  }, [selectedRestorableCount]);

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
      <div className="mb-4">
        <HistoryToolbar
          searchValue={searchValue}
          onSearchValueChange={onSearchValueChange}
          onSearchSubmit={onSearchSubmit}
          onRefresh={onRefresh}
        />
      </div>

      {selectedRestorableCount > 0 && (
        <div
          ref={selectedToolbarRef}
          className="mb-4 flex items-center justify-between rounded-lg border border-orange-100 bg-orange-50 px-3 py-2"
        >
          <p className="text-xs font-medium text-orange-700">
            {selectedRestorableCount} dokumen dipilih
          </p>
          <button
            type="button"
            onClick={onRestoreSelected}
            disabled={isRestoringSelected}
            className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isRestoringSelected ? "Memproses..." : "Restorasi Terpilih"}
          </button>
        </div>
      )}

      {loading || error || items.length === 0 ? (
        <HistoryState
          loading={loading}
          error={error}
          isEmpty={items.length === 0}
        />
      ) : (
        <>
          <HistoryTable
            items={items}
            restoringId={restoringId}
            selectedIds={selectedIds}
            allRestorableSelected={allRestorableSelected}
            onToggleSelectAll={onToggleSelectAll}
            onToggleSelect={onToggleSelect}
            onRestore={onRestore}
          />
          <HistoryPagination
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </>
      )}
    </section>
  );
}
