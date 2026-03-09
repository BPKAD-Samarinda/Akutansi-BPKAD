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
  isRestoringSelected: boolean;
  isPermanentlyDeletingSelected: boolean;
  selectedIds: Set<string>;
  selectedRestorableCount: number;
  allRestorableSelected: boolean;
  searchValue: string;
  statusValue: "all" | "diunggah" | "dihapus" | "diedit";
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  onSearchValueChange: (value: string) => void;
  onStatusValueChange: (
    value: "all" | "diunggah" | "dihapus" | "diedit",
  ) => void;
  onSearchSubmit: () => void;
  onRefresh: () => void;
  onToggleSelectAll: (checked: boolean) => void;
  onToggleSelect: (id: number | string, checked: boolean) => void;
  onRestoreSelected: () => void;
  onPermanentDeleteSelected: () => void;
  onPageChange: (nextPage: number) => void;
  onPageSizeChange: (nextSize: number) => void;
};

export default function HistoryContentSection({
  items,
  loading,
  error,
  isRestoringSelected,
  isPermanentlyDeletingSelected,
  selectedIds,
  selectedRestorableCount,
  allRestorableSelected,
  searchValue,
  statusValue,
  page,
  pageSize,
  totalItems,
  totalPages,
  onSearchValueChange,
  onStatusValueChange,
  onSearchSubmit,
  onRefresh,
  onToggleSelectAll,
  onToggleSelect,
  onRestoreSelected,
  onPermanentDeleteSelected,
  onPageChange,
  onPageSizeChange,
}: HistoryContentSectionProps) {
  const selectedToolbarRef = useRef<HTMLDivElement | null>(null);
  const tableContentRef = useRef<HTMLDivElement | null>(null);
  const previousSelectedCountRef = useRef<number>(selectedRestorableCount);
  const hasStatusAnimatedRef = useRef<boolean>(false);

  useEffect(() => {
    if (selectedRestorableCount <= 0 || !selectedToolbarRef.current) {
      return;
    }

    gsap.killTweensOf(selectedToolbarRef.current);
    gsap.fromTo(
      selectedToolbarRef.current,
      { autoAlpha: 0, y: -8 },
      { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" },
    );
  }, [selectedRestorableCount]);

  useEffect(() => {
    const previousCount = previousSelectedCountRef.current;
    const isToolbarJustShown =
      previousCount <= 0 && selectedRestorableCount > 0;
    const isToolbarJustHidden =
      previousCount > 0 && selectedRestorableCount <= 0;

    if (isToolbarJustShown && tableContentRef.current) {
      gsap.killTweensOf(tableContentRef.current);
      gsap.fromTo(
        tableContentRef.current,
        { y: -10 },
        { y: 0, duration: 0.55, ease: "power2.out" },
      );
    }

    if (isToolbarJustHidden && tableContentRef.current) {
      gsap.killTweensOf(tableContentRef.current);
      gsap.fromTo(
        tableContentRef.current,
        { y: 8 },
        { y: 0, duration: 0.55, ease: "power2.out" },
      );
    }

    previousSelectedCountRef.current = selectedRestorableCount;
  }, [selectedRestorableCount]);

  useEffect(() => {
    if (!tableContentRef.current) {
      return;
    }

    if (!hasStatusAnimatedRef.current) {
      hasStatusAnimatedRef.current = true;
      return;
    }

    gsap.killTweensOf(tableContentRef.current);
    gsap.fromTo(
      tableContentRef.current,
      { autoAlpha: 0.5, y: 10 },
      { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" },
    );
  }, [statusValue]);

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
      <div className="mb-4">
        <HistoryToolbar
          searchValue={searchValue}
          statusValue={statusValue}
          onSearchValueChange={onSearchValueChange}
          onStatusValueChange={onStatusValueChange}
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
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRestoreSelected}
              disabled={isRestoringSelected || isPermanentlyDeletingSelected}
              className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-3 py-1.5 text-xs h-10 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isRestoringSelected ? "Memproses..." : "Restorasi File Ini"}
            </button>
            <button
              type="button"
              onClick={onPermanentDeleteSelected}
              disabled={isPermanentlyDeletingSelected || isRestoringSelected}
              className="inline-flex items-center justify-center rounded-lg bg-red-600 px-3 py-1.5 text-xs h-10 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPermanentlyDeletingSelected
                ? "Menghapus..."
                : "Hapus Permanen File Ini"}
            </button>
          </div>
        </div>
      )}

      <div ref={tableContentRef}>
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
              selectedIds={selectedIds}
              allRestorableSelected={allRestorableSelected}
              onToggleSelectAll={onToggleSelectAll}
              onToggleSelect={onToggleSelect}
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
      </div>
    </section>
  );
}
