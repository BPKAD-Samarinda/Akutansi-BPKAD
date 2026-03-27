import { useEffect, useRef } from "react";
import gsap from "gsap";
import AppTooltip from "../../ui/app-tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

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
  const pageSizeSelectRef = useRef<HTMLDivElement | null>(null);

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
  }, [pageSize]);

  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-3 pt-4 md:flex-row md:items-center md:justify-between">
      <p className="text-xs text-gray-500 dark:text-slate-400">
        Menampilkan {start}-{end} dari {totalItems} data
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <AppTooltip content="Pilih jumlah data per halaman">
          <div ref={pageSizeSelectRef}>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger
                aria-label="Pilih jumlah data per halaman"
                className="h-8 w-[76px] min-w-[76px] rounded-lg border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 shadow-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-orange-400 dark:focus:ring-orange-500/20"
              >
                <SelectValue placeholder="Pilih halaman" />
              </SelectTrigger>
              <SelectContent className="font-['Plus_Jakarta_Sans',sans-serif] !w-[var(--radix-select-trigger-width)] !min-w-[var(--radix-select-trigger-width)] bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-slate-100 [&_[data-radix-select-viewport]]:w-full [&_[data-radix-select-viewport]]:min-w-0">
                <SelectItem
                  value="5"
                  className="hover:bg-orange-50 hover:text-orange-700 data-[highlighted]:bg-orange-50 data-[highlighted]:text-orange-700 dark:hover:bg-slate-800 dark:hover:text-orange-300 dark:data-[highlighted]:bg-slate-800 dark:data-[highlighted]:text-orange-300"
                >
                  5
                </SelectItem>
                <SelectItem
                  value="10"
                  className="hover:bg-orange-50 hover:text-orange-700 data-[highlighted]:bg-orange-50 data-[highlighted]:text-orange-700 dark:hover:bg-slate-800 dark:hover:text-orange-300 dark:data-[highlighted]:bg-slate-800 dark:data-[highlighted]:text-orange-300"
                >
                  10
                </SelectItem>
                <SelectItem
                  value="20"
                  className="hover:bg-orange-50 hover:text-orange-700 data-[highlighted]:bg-orange-50 data-[highlighted]:text-orange-700 dark:hover:bg-slate-800 dark:hover:text-orange-300 dark:data-[highlighted]:bg-slate-800 dark:data-[highlighted]:text-orange-300"
                >
                  20
                </SelectItem>
                <SelectItem
                  value="50"
                  className="hover:bg-orange-50 hover:text-orange-700 data-[highlighted]:bg-orange-50 data-[highlighted]:text-orange-700 dark:hover:bg-slate-800 dark:hover:text-orange-300 dark:data-[highlighted]:bg-slate-800 dark:data-[highlighted]:text-orange-300"
                >
                  50
                </SelectItem>
                <SelectItem
                  value="100"
                  className="hover:bg-orange-50 hover:text-orange-700 data-[highlighted]:bg-orange-50 data-[highlighted]:text-orange-700 dark:hover:bg-slate-800 dark:hover:text-orange-300 dark:data-[highlighted]:bg-slate-800 dark:data-[highlighted]:text-orange-300"
                >
                  100
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </AppTooltip>

        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 disabled:opacity-40 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Sebelumnya
        </button>

        <span className="px-1 text-xs text-gray-500 dark:text-slate-400">
          {page} / {totalPages}
        </span>

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-md border border-gray-200 px-2 py-1 text-xs text-gray-600 disabled:opacity-40 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Berikutnya
        </button>
      </div>
    </div>
  );
}
