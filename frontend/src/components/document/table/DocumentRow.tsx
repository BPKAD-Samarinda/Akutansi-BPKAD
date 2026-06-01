import { FiEdit3, FiEye, FiTrash2 } from "react-icons/fi";
import { Document } from "../../../types";
import AppTooltip from "../../ui/app-tooltip";
import { formatIndonesianDate } from "../../../utils/localDate";
import { getUser } from "../../../utils/auth";

interface DocumentRowProps {
  doc: Document;
  isSelected: boolean;
  rowNumber: number;
  onSelect: (id: number | string) => void;
  onView?: (id: number | string) => void;
  onEdit?: (id: number | string) => void;
  onDelete?: (id: number | string) => void;
}

export default function DocumentRow({
  doc,
  isSelected,
  rowNumber,
  onSelect,
  onView,
  onEdit,
  onDelete,
}: DocumentRowProps) {
  const getFileFormat = (filePath: string) => {
    return filePath.split(".").pop()?.toLowerCase() || "";
  };

  const user = getUser();

  const getFormatStyle = (filePath: string) => {
    const format = getFileFormat(filePath);
    switch (format) {
      case "pdf":
        return "bg-red-100 text-red-600 border border-red-200";
      case "xlsx":
      case "xls":
        return "bg-green-100 text-green-600 border border-green-200";
      case "docx":
      case "doc":
        return "bg-blue-100 text-blue-600 border border-blue-200";
      case "pptx":
      case "ppt":
        return "bg-orange-100 text-orange-600 border border-orange-200";
      default:
        return "bg-gray-100 text-gray-600 border border-gray-200";
    }
  };

  const format = getFileFormat(doc.file_path);

  return (
    <tr
      data-paginated-item
      className={`transition-colors duration-150 ${
        isSelected
          ? "bg-orange-50 dark:bg-orange-500/10"
          : "hover:bg-amber-50/60 dark:hover:bg-slate-800/60"
      }`}
    >
      {/* Checkbox */}
      <td className="py-3.5 px-3 w-12 text-center align-middle">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(doc.id)}
          aria-label={`Select document ${doc.nama_sppd}`}
          className="block mx-auto premium-checkbox-orange"
        />
      </td>

      {/* Nama */}
      <td className="py-3.5 px-3 text-sm font-semibold text-slate-950 dark:text-slate-50 max-w-0">
        <div className="flex items-center gap-2">
          <svg className="w-[18px] h-[18px] text-gray-300 dark:text-slate-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <AppTooltip content={doc.nama_sppd}>
            <span className="block truncate">{doc.nama_sppd}</span>
          </AppTooltip>
        </div>
      </td>

      {/* Kategori */}
      <td className="py-3.5 px-3 text-center">
        <span className="inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
          {doc.kategori}
        </span>
      </td>

      {/* Format */}
      <td className="py-3.5 px-3 text-center">
        <span className={`inline-flex min-w-[48px] justify-center px-2.5 py-0.5 rounded text-xs font-bold ${getFormatStyle(doc.file_path)}`}>
          {format.toUpperCase()}
        </span>
      </td>

      {/* Tanggal */}
      <td className="py-3.5 px-3 text-center">
        <div className="flex items-center justify-center gap-1.5 text-sm text-slate-600 dark:text-slate-300">
          {formatIndonesianDate(doc.tanggal_sppd)}
        </div>
      </td>

      {/* Aksi */}
      <td className="py-3.5 px-3">
        <div className="flex gap-2 justify-center">
          <AppTooltip content="Lihat dokumen">
            <button
              onClick={() => onView?.(doc.id)}
              aria-label="View document"
              className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/30 transition-colors"
            >
              <FiEye className="h-4 w-4" />
            </button>
          </AppTooltip>
          {user && (user.role === "Admin" || user.role === "Admin Akuntansi") && (
            <>
              <AppTooltip content="Edit dokumen">
                <button
                  onClick={() => onEdit?.(doc.id)}
                  aria-label="Edit document"
                  className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition-colors"
                >
                  <FiEdit3 className="h-4 w-4" />
                </button>
              </AppTooltip>
              <AppTooltip content="Hapus dokumen">
                <button
                  onClick={() => onDelete?.(doc.id)}
                  aria-label="Delete document"
                  className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                >
                  <FiTrash2 className="h-4 w-4" />
                </button>
              </AppTooltip>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
