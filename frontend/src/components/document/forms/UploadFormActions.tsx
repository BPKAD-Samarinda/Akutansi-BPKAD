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
        className="px-8 py-3.5 border-2 border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed order-2 sm:order-1"
      >
        Batal
      </button>
      <button
        type="submit"
        disabled={isUploading}
        className="relative px-8 py-3.5 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 bg-[length:200%_auto] hover:bg-[position:100%] text-white rounded-xl font-bold transition-all duration-500 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed order-1 sm:order-2 overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        <span className="relative flex items-center justify-center gap-2">
          {isUploading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
              <span>Mengunggah...</span>
            </>
          ) : (
            <>
              <span>Simpan Dokumen</span>
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </>
          )}
        </span>
      </button>
    </div>
  );
}
