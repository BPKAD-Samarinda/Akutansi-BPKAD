import { SortOrder } from "../../hooks/useDocumentTableState";
import uploadIcon from "../../assets/icons/upload.svg";

type DocumentTableToolbarProps = {
  sortOrder: SortOrder;
  onSortClick: (order: "newest" | "oldest") => void;
  onUploadClick: () => void;
};

export default function DocumentTableToolbar({
  sortOrder,
  onSortClick,
  onUploadClick,
}: DocumentTableToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
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

      <button
        onClick={onUploadClick}
        className="bg-orange-500 hover:bg-orange-600 text-white px-4 lg:px-5 py-2.5 lg:py-3 rounded-xl flex items-center gap-2 text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 w-full sm:w-auto justify-center"
      >
        <img src={uploadIcon} className="w-4 h-4 lg:w-5 lg:h-5" alt="Upload" />
        Unggah Baru
      </button>
    </div>
  );
}
