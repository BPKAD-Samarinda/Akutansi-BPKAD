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
      <p className="text-xs text-gray-500">
        Menampilkan {start}-{end} dari {totalItems} data
      </p>

      <div className="flex items-center gap-2">
        <AppTooltip content="Pilih jumlah data per halaman">
          <div ref={pageSizeSelectRef}>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger
                aria-label="Pilih jumlah data per halaman"
                className="h-7 w-[72px] min-w-[72px] rounded-md border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 shadow-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
              >
                <SelectValue placeholder="Pilih halaman" />
              </SelectTrigger>
              <SelectContent className="font-['Plus_Jakarta_Sans',sans-serif] !w-[var(--radix-select-trigger-width)] !min-w-[var(--radix-select-trigger-width)] [&_[data-radix-select-viewport]]:w-full [&_[data-radix-select-viewport]]:min-w-0">
                <SelectItem
                  value="5"
                  className="hover:bg-orange-50 hover:text-orange-700 data-[highlighted]:bg-orange-50 data-[highlighted]:text-orange-700"
                >
                  5
                </SelectItem>
                <SelectItem
                  value="10"
                  className="hover:bg-orange-50 hover:text-orange-700 data-[highlighted]:bg-orange-50 data-[highlighted]:text-orange-700"
                >
                  10
                </SelectItem>
                <SelectItem
                  value="20"
                  className="hover:bg-orange-50 hover:text-orange-700 data-[highlighted]:bg-orange-50 data-[highlighted]:text-orange-700"
                >
                  20
                </SelectItem>
                <SelectItem
                  value="50"
                  className="hover:bg-orange-50 hover:text-orange-700 data-[highlighted]:bg-orange-50 data-[highlighted]:text-orange-700"
                >
                  50
                </SelectItem>
                <SelectItem
                  value="100"
                  className="hover:bg-orange-50 hover:text-orange-700 data-[highlighted]:bg-orange-50 data-[highlighted]:text-orange-700"
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
