import { useEffect, useRef } from "react";
import gsap from "gsap";

type HistoryPaginationProps = {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (nextPage: number) => void;
  onPageSizeChange: (nextSize: number) => void;
};

export default function HistoryPagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: HistoryPaginationProps) {
  const pageSizeSelectRef = useRef<HTMLSelectElement | null>(null);

  useEffect(() => {
    if (!pageSizeSelectRef.current) {
      return;
    }

    gsap.killTweensOf(pageSizeSelectRef.current);
    gsap.fromTo(
      pageSizeSelectRef.current,
      { autoAlpha: 0, y: 6 },
      { autoAlpha: 1, y: 0, duration: 0.24, ease: "power2.out" },
    );
  }, []);

  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-3 pt-4 md:flex-row md:items-center md:justify-between">
      <p className="text-xs text-gray-500">
        Menampilkan {start}-{end} dari {totalItems} data
      </p>

      <div className="flex items-center gap-2">
        <select
          ref={pageSizeSelectRef}
          title="pilih halaman"
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 outline-none"
        >
          <option value={5}>5 / halaman</option>
          <option value={10}>10 / halaman</option>
          <option value={20}>20 / halaman</option>
        </select>

        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 disabled:opacity-40"
        >
          Sebelumnya
        </button>

        <span className="px-1 text-xs text-gray-500">
          {page} / {totalPages}
        </span>

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 disabled:opacity-40"
        >
          Berikutnya
        </button>
      </div>
    </div>
  );
}
