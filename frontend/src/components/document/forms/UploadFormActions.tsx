import { FiX, FiCheck } from "react-icons/fi";

type UploadFormActionsProps = {
  isUploading: boolean;
  onCancel: () => void;
};

export default function UploadFormActions({
  isUploading,
  onCancel,
}: UploadFormActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-end mt-10 lg:mt-12">
      <button
        type="button"
        onClick={onCancel}
        disabled={isUploading}
        className="px-8 py-3.5 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-350 font-semibold bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed order-2 sm:order-1 flex items-center justify-center gap-2 shadow-sm"
      >
        <FiX className="w-4 h-4" />
        <span>Batal</span>
      </button>
      <button
        type="submit"
        disabled={isUploading}
        className="relative px-8 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[length:200%_auto] hover:bg-[position:100%] text-white rounded-xl font-bold transition-all duration-500 shadow-lg shadow-indigo-600/20 hover:shadow-xl hover:shadow-indigo-600/35 hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed order-1 sm:order-2 overflow-hidden group min-w-[190px] flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        <span className="relative flex items-center gap-2 leading-none">
          {isUploading ? (
            <>
              <svg className="animate-spin h-5 w-5 shrink-0 align-middle animate-delay-75" viewBox="0 0 24 24" style={{ verticalAlign: "middle" }}>
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="block leading-none">Mengunggah...</span>
            </>
          ) : (
            <>
              <span className="block">Simpan Dokumen</span>
              <FiCheck className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
            </>
          )}
        </span>
      </button>
    </div>
  );
}
