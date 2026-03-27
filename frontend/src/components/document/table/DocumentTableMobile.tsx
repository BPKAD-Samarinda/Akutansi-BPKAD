import { Document } from "../../../types";
import AppTooltip from "../../ui/app-tooltip";
import { formatIndonesianDate } from "../../../utils/localDate";
import { getUser } from "../../../utils/auth";

type DocumentTableMobileProps = {
  documents: Document[];
  selectedDocuments: Set<number | string>;
  onSelectDocument: (id: number | string) => void;
  onView?: (id: number | string) => void;
  onEdit?: (id: number | string) => void;
  onDelete?: (id: number | string) => void;
};

export default function DocumentTableMobile({
  documents,
  selectedDocuments,
  onSelectDocument,
  onView,
  onEdit,
  onDelete,
}: DocumentTableMobileProps) {
  const user = getUser();
  const canManageDocument =
    user?.role === "Admin" || user?.role === "Admin Akuntansi";

  const getFileFormat = (filePath: string) => {
    return filePath.split(".").pop()?.toLowerCase() || "";
  };

  const getFormatStyle = (filePath: string) => {
    const format = getFileFormat(filePath);

    switch (format) {
      case "pdf":
        return "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-300";
      case "xlsx":
      case "xls":
        return "bg-green-100 text-green-600 dark:bg-emerald-500/15 dark:text-emerald-300";
      case "docx":
      case "doc":
        return "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300";
      case "pptx":
      case "ppt":
        return "bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-200";
    }
  };

  return (
    <div className="md:hidden space-y-3">
      {documents.length > 0 ? (
        documents.map((doc, index) => {
          const format = getFileFormat(doc.file_path);

          return (
            <div
              key={doc.id}
              data-paginated-item
              className={`rounded-2xl p-4 space-y-3 border shadow-sm transition-shadow ${
                selectedDocuments.has(doc.id)
                  ? "border-orange-300 bg-gradient-to-br from-orange-50 to-amber-50 shadow-orange-100/40 dark:border-orange-400/60 dark:bg-slate-900 dark:shadow-black/40"
                  : "border-slate-100 bg-white hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <span className="mt-0.5 inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-orange-100 text-[11px] font-semibold text-orange-700 dark:bg-orange-500/20 dark:text-orange-200">
                    {index + 1}
                  </span>
                  <AppTooltip content="Pilih dokumen">
                    <input
                      type="checkbox"
                      title=""
                      aria-label={`Pilih dokumen ${doc.nama_sppd}`}
                      checked={selectedDocuments.has(doc.id)}
                      onChange={() => onSelectDocument(doc.id)}
                      className="w-5 h-5 text-orange-600 border-gray-300 dark:border-slate-600 rounded"
                    />
                  </AppTooltip>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 dark:text-slate-100 text-sm">
                      {doc.nama_sppd}
                    </h3>

                    <p className="text-xs text-gray-600 dark:text-slate-300 mt-1">
                      {doc.kategori}
                    </p>

                    <div className="flex items-center gap-2 text-xs mt-2 flex-wrap">
                      <span
                        className={`px-2 py-1 ${getFormatStyle(
                          doc.file_path,
                        )} rounded-full font-semibold`}
                      >
                        {format.toUpperCase()}
                      </span>

                      <span className="text-gray-500 dark:text-slate-400">
                        {formatIndonesianDate(doc.tanggal_sppd)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => onView?.(doc.id)}
                  className="flex-1 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-sky-50 text-blue-600 text-xs font-semibold dark:bg-slate-800 dark:text-blue-300"
                >
                  Lihat
                </button>
                {canManageDocument && (
                  <>
                    <button
                      onClick={() => onEdit?.(doc.id)}
                      className="flex-1 py-2 rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 text-amber-700 text-xs font-semibold dark:bg-slate-800 dark:text-amber-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete?.(doc.id)}
                      className="flex-1 py-2 rounded-lg bg-gradient-to-r from-red-50 to-rose-50 text-red-600 text-xs font-semibold dark:bg-slate-800 dark:text-rose-300"
                    >
                      Hapus
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <div className="py-12 text-center text-gray-400 dark:text-slate-500">
          Tidak ada dokumen ditemukan
        </div>
      )}
    </div>
  );
}
