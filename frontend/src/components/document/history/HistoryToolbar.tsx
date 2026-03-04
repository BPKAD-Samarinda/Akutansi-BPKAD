import { Search, RefreshCcw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

type HistoryToolbarProps = {
  searchValue: string;
  statusValue: "all" | "diunggah" | "dihapus" | "diedit";
  onSearchValueChange: (value: string) => void;
  onStatusValueChange: (
    value: "all" | "diunggah" | "dihapus" | "diedit",
  ) => void;
  onSearchSubmit: () => void;
  onRefresh: () => void;
};

export default function HistoryToolbar({
  searchValue,
  statusValue,
  onSearchValueChange,
  onStatusValueChange,
  onSearchSubmit,
  onRefresh,
}: HistoryToolbarProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex w-full flex-col gap-3 md:max-w-3xl md:flex-row">
        <div className="relative w-full md:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={searchValue}
            onChange={(event) => onSearchValueChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onSearchSubmit();
              }
            }}
            placeholder="Cari nama dokumen"
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
          />
        </div>

        <Select
          value={statusValue}
          onValueChange={(value) =>
            onStatusValueChange(
              value as "all" | "diunggah" | "dihapus" | "diedit",
            )
          }
        >
          <SelectTrigger
            className="h-10 w-full rounded-lg border-gray-200 bg-white text-sm text-gray-700 transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100 md:w-52"
            aria-label="Filter status riwayat"
          >
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent className="font-['Plus_Jakarta_Sans',sans-serif] ">
            <SelectItem
              value="all"
              className="hover:bg-orange-50 hover:text-orange-700 data-[highlighted]:bg-orange-50 data-[highlighted]:text-orange-700"
            >
              Semua Status
            </SelectItem>
            <SelectItem
              value="diunggah"
              className="hover:bg-orange-50 hover:text-orange-700 data-[highlighted]:bg-orange-50 data-[highlighted]:text-orange-700"
            >
              Diunggah
            </SelectItem>
            <SelectItem
              value="dihapus"
              className="hover:bg-orange-50 hover:text-orange-700 data-[highlighted]:bg-orange-50 data-[highlighted]:text-orange-700"
            >
              Dihapus
            </SelectItem>
            <SelectItem
              value="diedit"
              className="hover:bg-orange-50 hover:text-orange-700 data-[highlighted]:bg-orange-50 data-[highlighted]:text-orange-700"
            >
              Diedit
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <button
        type="button"
        onClick={onRefresh}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:text-gray-800"
      >
        <RefreshCcw className="h-4 w-4" />
        Refresh
      </button>
    </div>
  );
}
