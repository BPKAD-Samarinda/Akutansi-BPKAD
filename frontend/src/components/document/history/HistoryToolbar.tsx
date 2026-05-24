import { Search, RefreshCcw } from "lucide-react";
import AppTooltip from "../../ui/app-tooltip";
import { useState } from "react";
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
  const [isSpinning, setIsSpinning] = useState(false);

  const handleRefresh = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 600);
    onRefresh();
  };

  return (
    <>

      <div className="flex flex-col gap-3 w-full md:flex-row md:items-center md:justify-between">
        <div className="flex w-full flex-col gap-3 md:flex-row md:items-center">
          <div className="flex items-center bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2 focus-within:border-teal-400 transition w-full md:w-64">
            <Search className="w-4 h-4 mr-3 opacity-50 text-gray-500 dark:text-slate-400 shrink-0" />
            <input
              value={searchValue}
              onChange={(event) => onSearchValueChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  onSearchSubmit();
                }
              }}
              placeholder="Cari nama dokumen"
              className="bg-transparent outline-none w-full text-sm font-medium text-gray-700 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex-1 md:flex-initial">
              <Select
                value={statusValue}
                onValueChange={(value) =>
                  onStatusValueChange(
                    value as "all" | "diunggah" | "dihapus" | "diedit",
                  )
                }
              >
                <SelectTrigger
                  className="h-11 w-full rounded-xl border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium text-gray-700 dark:text-slate-100 transition focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 md:w-52"
                  aria-label="Filter status riwayat"
                >
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent className="font-sans dark:bg-slate-900 dark:border-slate-700">
                  <SelectItem
                    value="all"
                    className="hover:bg-teal-50 hover:text-teal-700 data-[highlighted]:bg-teal-50 data-[highlighted]:text-teal-700 dark:hover:bg-slate-800 dark:hover:text-slate-100 dark:data-[highlighted]:bg-slate-800 dark:data-[highlighted]:text-slate-100"
                  >
                    Semua Status
                  </SelectItem>
                  <SelectItem
                    value="diunggah"
                    className="hover:bg-teal-50 hover:text-teal-700 data-[highlighted]:bg-teal-50 data-[highlighted]:text-teal-700 dark:hover:bg-slate-800 dark:hover:text-slate-100 dark:data-[highlighted]:bg-slate-800 dark:data-[highlighted]:text-slate-100"
                  >
                    Diunggah
                  </SelectItem>
                  <SelectItem
                    value="dihapus"
                    className="hover:bg-teal-50 hover:text-teal-700 data-[highlighted]:bg-teal-50 data-[highlighted]:text-teal-700 dark:hover:bg-slate-800 dark:hover:text-slate-100 dark:data-[highlighted]:bg-slate-800 dark:data-[highlighted]:text-slate-100"
                  >
                    Dihapus Sementara
                  </SelectItem>
                  <SelectItem
                    value="diedit"
                    className="hover:bg-teal-50 hover:text-teal-700 data-[highlighted]:bg-teal-50 data-[highlighted]:text-teal-700 dark:hover:bg-slate-800 dark:hover:text-slate-100 dark:data-[highlighted]:bg-slate-800 dark:data-[highlighted]:text-slate-100"
                  >
                    Diedit
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <AppTooltip content="Refresh data">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isSpinning}
                className="inline-flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-500 dark:text-slate-400 transition-all hover:border-teal-300 hover:text-teal-600 active:scale-95 disabled:opacity-70"
              >
                <RefreshCcw className={`h-4 w-4 ${isSpinning ? "animate-[spin-clean_0.8s_linear_infinite]" : ""}`} />
              </button>
            </AppTooltip>
          </div>
        </div>
      </div>
    </>
  );
}
