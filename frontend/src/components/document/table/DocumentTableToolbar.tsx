import { useState } from "react";
import { SortOrder } from "../../../hooks/document/useDocumentTableState";
import { FiUploadCloud, FiRefreshCw } from "react-icons/fi";
import AppTooltip from "../../ui/app-tooltip";
import { getUser } from "../../../utils/auth";

type DocumentTableToolbarProps = {
  sortOrder: SortOrder;
  onSortClick: (order: "newest" | "oldest") => void;
  onUploadClick: () => void;
  onRefresh?: () => void;
};

export default function DocumentTableToolbar({
  sortOrder,
  onSortClick,
  onUploadClick,
  onRefresh,
}: DocumentTableToolbarProps) {
  const user = getUser();
  const canUploadDocument = [
    "Admin",
    "Anak PKL",
    "Admin Akuntansi",
  ].includes(user?.role ?? "");
  const [isSpinning, setIsSpinning] = useState(false);

  const handleRefresh = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 600);
    onRefresh?.();
  };

  return (
    <div className="flex items-center gap-2 flex-nowrap">
      {/* Sort buttons */}
      <div className="flex gap-1.5">
        <button
          onClick={() => onSortClick("newest")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            sortOrder === "newest"
              ? "bg-[#FF7A00] text-white shadow-sm"
              : "border border-gray-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-orange-300 hover:text-orange-600"
          }`}
        >
          TERBARU
        </button>
        <button
          onClick={() => onSortClick("oldest")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            sortOrder === "oldest"
              ? "bg-[#FF7A00] text-white shadow-sm"
              : "border border-gray-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-orange-300 hover:text-orange-600"
          }`}
        >
          TERLAMA
        </button>
      </div>

      <div className="w-px h-5 bg-gray-200 dark:bg-slate-700" />

      {canUploadDocument && (
        <button
          onClick={onUploadClick}
          className="bg-[#FF7A00] text-white px-4 py-1.5 rounded-lg inline-flex items-center gap-1.5 text-xs font-bold transition-all hover:bg-orange-600 active:scale-95"
        >
          <FiUploadCloud className="w-3.5 h-3.5" />
          Unggah
        </button>
      )}

      <AppTooltip content="Refresh data">
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isSpinning}
          className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-gray-200 dark:border-slate-700 text-slate-500 hover:border-orange-300 hover:text-[#FF7A00] transition-all active:scale-95 disabled:opacity-60"
        >
          <FiRefreshCw
            className={`h-3.5 w-3.5 ${isSpinning ? "animate-[spin-clean_0.8s_linear_infinite]" : ""}`}
          />
        </button>
      </AppTooltip>
    </div>
  );
}
