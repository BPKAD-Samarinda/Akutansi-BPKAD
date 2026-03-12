import { getUser } from "../../../utils/auth";

type SelectedActionsBarProps = {
  selectedCount: number;
  onDownloadSelected: () => void;
  onDeleteSelected: () => void;
};

export default function SelectedActionsBar({
  selectedCount,
  onDownloadSelected,
  onDeleteSelected,
}: SelectedActionsBarProps) {
  if (selectedCount === 0) {
    return null;
  }
  const user = getUser();

  return (
    <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-xl flex justify-between items-center animate-[slideDown_0.3s_ease-out]">
      <span className="text-orange-700 font-semibold text-sm lg:text-base">
        {selectedCount} dokumen dipilih
      </span>
      <div className="flex gap-2">
        <button
          onClick={onDownloadSelected}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 text-sm shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Unduh Terpilih
        </button>
        {user && (user.role === "Admin" || user.role === "Admin Akuntansi") && (
          <button
            onClick={onDeleteSelected}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2 text-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Hapus Terpilih
          </button>
        )}
      </div>
    </div>
  );
}
