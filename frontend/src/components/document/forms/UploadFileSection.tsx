import { RefObject } from "react";
import { FiUploadCloud, FiTrash2, FiCheckCircle, FiFileText } from "react-icons/fi";
import { formatFileSize } from "../../../utils/fileUtils";
import "./UploadFileSection.css";

type UploadFileSectionProps = {
  fileInputRef: RefObject<HTMLInputElement | null>;
  selectedFile: File | null;
  isDragging: boolean;
  onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onClickUploadArea: () => void;
  onRemoveFile: () => void;
};

export default function UploadFileSection({
  fileInputRef,
  selectedFile,
  isDragging,
  onFileInputChange,
  onDragOver,
  onDragLeave,
  onDrop,
  onClickUploadArea,
  onRemoveFile,
}: UploadFileSectionProps) {
  const getFileBadge = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase() || "";
    if (ext === "pdf") {
      return { text: "PDF", bg: "bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-450 border border-rose-250 dark:border-rose-900/30" };
    }
    if (["doc", "docx"].includes(ext)) {
      return { text: "WORD", bg: "bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-450 border border-blue-250 dark:border-blue-900/30" };
    }
    if (["xls", "xlsx"].includes(ext)) {
      return { text: "EXCEL", bg: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-450 border border-emerald-250 dark:border-emerald-900/30" };
    }
    if (["jpg", "jpeg", "png", "webp", "heic"].includes(ext)) {
      return { text: "IMAGE", bg: "bg-purple-100 dark:bg-purple-950/40 text-purple-650 dark:text-purple-405 border border-purple-250 dark:border-purple-900/30" };
    }
    return { text: ext.toUpperCase(), bg: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700" };
  };

  const badge = selectedFile ? getFileBadge(selectedFile.name) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 animate-bounce animate-delay-400">
          <FiFileText className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-slate-100">Berkas Dokumen</h2>
      </div>

      <div
        onClick={onClickUploadArea}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`
          border-2 border-dashed rounded-2xl 
          min-h-[280px] lg:min-h-[320px]
          flex flex-col items-center justify-center
          cursor-pointer transition-all duration-350
          relative overflow-hidden group shadow-sm
          ${
            isDragging
              ? "border-indigo-500 bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:from-indigo-950/20 dark:to-blue-950/20 scale-[1.01] shadow-lg shadow-indigo-500/5"
              : "border-slate-300 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-gradient-to-br hover:from-indigo-50/25 hover:to-transparent"
          }
          ${selectedFile ? "border-emerald-500 dark:border-emerald-800 bg-gradient-to-br from-emerald-50/20 via-transparent to-transparent dark:from-emerald-950/10" : ""}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          title=""
          aria-label="File Input"
          onChange={onFileInputChange}
          className="hidden"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.jfif,.heic,.heif"
        />

        {selectedFile ? (
          <div className="text-center p-8 animate-scaleIn w-full max-w-sm mx-auto relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/30 animate-bounce">
              <FiCheckCircle className="w-9 h-9 text-white" />
            </div>
            
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 uppercase tracking-wider shadow-sm select-none animate-fadeIn ${badge?.bg || ""}`}>
              {badge?.text}
            </div>

            <p className="text-base font-bold text-gray-800 dark:text-slate-100 mb-2 truncate max-w-xs mx-auto" title={selectedFile.name}>
              {selectedFile.name}
            </p>
            <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 mb-6">
              {formatFileSize(selectedFile.size)}
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFile();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-rose-200 dark:border-rose-900/30 text-rose-600 hover:text-white hover:bg-rose-600 dark:hover:bg-rose-900/80 rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-rose-500/10 active:scale-95"
            >
              <FiTrash2 className="w-4 h-4" />
              <span>Hapus Berkas</span>
            </button>
          </div>
        ) : (
          <div className="text-center p-8 relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-indigo-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-350">
              <FiUploadCloud className="w-8 h-8 text-white animate-pulse" />
            </div>
            <p className="text-base font-bold text-gray-800 dark:text-slate-100 mb-2">
              Seret berkas ke sini atau klik
            </p>
            <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 mb-1">
              PDF, Word, Excel, JPG, PNG
            </p>
            <p className="text-xs font-bold text-indigo-500 dark:text-indigo-400">Maks. 30MB</p>
          </div>
        )}

        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-400 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-600 rounded-full filter blur-3xl animate-pulse upload-file-glow-delay"></div>
        </div>
      </div>
    </div>
  );
}
