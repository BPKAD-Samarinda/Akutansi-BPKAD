import { useState } from "react";
import { SortOrder } from "../../../hooks/document/useDocumentTableState";
import uploadIcon from "../../../assets/icons/upload.svg";
import refreshIcon from "../../../assets/icons/refresh.svg";
import AppTooltip from "../../ui/app-tooltip";

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
  const [showToast, setShowToast] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleRefresh = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 600);

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);

    onRefresh?.();
  };

  return (
    <>
      {/* Animasi spin sekali */}
      <style>{`
        @keyframes spin-once {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-once {
          animation: spin-once 0.6s ease-in-out;
        }
      `}</style>

      {/* Toast Notification */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[99999] transition-all duration-300 ${
          showToast
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      ></div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {/* Sort buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onSortClick("newest")}
            className={`px-4 lg:px-5 py-2 rounded-full text-xs lg:text-sm font-semibold transition-all ${
              sortOrder === "newest"
                ? "bg-orange-100 text-orange-600 shadow-sm"
                : "border border-gray-300 text-gray-400 hover:border-gray-400"
            }`}
          >
            TERBARU
          </button>
          <button
            onClick={() => onSortClick("oldest")}
            className={`px-4 lg:px-5 py-2 rounded-full text-xs lg:text-sm font-semibold transition-all ${
              sortOrder === "oldest"
                ? "bg-orange-100 text-orange-600 shadow-sm"
                : "border border-gray-300 text-gray-400 hover:border-gray-400"
            }`}
          >
            TERLAMA
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onUploadClick}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 lg:px-5 py-2.5 lg:py-3 rounded-xl flex items-center gap-2 text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 flex-1 sm:flex-none justify-center"
          >
            <img
              src={uploadIcon}
              className="w-4 h-4 lg:w-5 lg:h-5"
              alt="Upload"
            />
            Unggah Baru
          </button>

          <AppTooltip content="Refresh">
            <button
              onClick={handleRefresh}
              disabled={isSpinning}
              className="bg-orange-500 hover:bg-orange-600 p-2.5 lg:p-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 shrink-0 disabled:opacity-80"
            >
              <img
                src={refreshIcon}
                key={isSpinning ? "spinning" : "idle"}
                className={`w-4 h-4 lg:w-5 lg:h-5 ${isSpinning ? "spin-once" : ""}`}
                alt="refresh"
              />
            </button>
          </AppTooltip>
        </div>
      </div>
    </>
  );
}
