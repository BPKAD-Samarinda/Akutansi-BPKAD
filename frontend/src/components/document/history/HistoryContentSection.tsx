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
  searchValue: string;
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  onSearchValueChange: (value: string) => void;
  onSearchSubmit: () => void;
  onRefresh: () => void;
  onRestore: (id: number | string) => void;
  onPageChange: (nextPage: number) => void;
  onPageSizeChange: (nextSize: number) => void;
};

export default function HistoryContentSection({
  items,
  loading,
  error,
  restoringId,
  searchValue,
  page,
  pageSize,
  totalItems,
  totalPages,
  onSearchValueChange,
  onSearchSubmit,
  onRefresh,
  onRestore,
  onPageChange,
  onPageSizeChange,
}: HistoryContentSectionProps) {
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
