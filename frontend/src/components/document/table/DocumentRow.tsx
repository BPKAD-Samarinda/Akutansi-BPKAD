import { MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { FaTrashAlt } from "react-icons/fa";
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
        return "bg-red-100 text-red-600";
      case "xlsx":
      case "xls":
        return "bg-green-100 text-green-600";
      case "docx":
      case "doc":
        return "bg-blue-100 text-blue-600";
      case "pptx":
      case "ppt":
        return "bg-orange-100 text-orange-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const format = getFileFormat(doc.file_path);

  return (
    <tr
      data-paginated-item
      className={`border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/60 dark:hover:bg-slate-800/60 transition-colors ${
        isSelected ? "bg-amber-50/60 dark:bg-amber-500/10" : ""
      }`}
    >
      <td className="py-4 px-3 w-12 text-center align-middle">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(doc.id)}
          aria-label={`Select document ${doc.nama_sppd}`}
        className="block mx-auto w-4 h-4 text-orange-600 border-gray-300 dark:border-slate-600 rounded cursor-pointer"
      />
      </td>

      <td className="py-4 px-3 w-12 text-center align-middle text-xs font-semibold text-amber-600">
        {rowNumber}
      </td>

      <td className="py-4 px-3 text-sm font-medium text-gray-800 dark:text-slate-100 max-w-0">
        <AppTooltip content={doc.nama_sppd}>
          <span className="block truncate">{doc.nama_sppd}</span>
        </AppTooltip>
      </td>

      <td className="py-4 px-3 text-sm text-center text-gray-700 dark:text-slate-200">
        {doc.kategori}
      </td>

      <td className="py-4 px-3 text-center">
        <span
          className={`inline-flex min-w-[52px] justify-center px-3 py-1 ${getFormatStyle(
            doc.file_path,
          )} rounded-full text-xs font-semibold ring-1 ring-amber-100`}
        >
          {format.toUpperCase()}
        </span>
      </td>

      <td className="py-4 px-3 text-center text-sm text-gray-600 dark:text-slate-300">
        {formatIndonesianDate(doc.tanggal_sppd)}
      </td>

      <td className="py-4 px-3">
        <div className="flex gap-1.5 justify-center">
          <AppTooltip content="Lihat dokumen">
            <button
              onClick={() => onView?.(doc.id)}
              aria-label="View document"
              className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-blue-600 bg-blue-50/60 hover:bg-blue-100 hover:text-blue-700 transition-colors"
            >
              <IoMdEye className="w-5 h-5" />
            </button>
          </AppTooltip>
          {user && (user.role === "Admin" || user.role === "Admin Akuntansi") && (
            <>
              <AppTooltip content="Edit dokumen">
                <button
                  onClick={() => onEdit?.(doc.id)}
                  aria-label="Edit document"
                  className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-amber-600 bg-amber-50/70 hover:bg-amber-100 hover:text-amber-700 transition-colors"
                >
                  <MdEdit className="w-5 h-5" />
                </button>
              </AppTooltip>
              <AppTooltip content="Hapus dokumen">
                <button
                  onClick={() => onDelete?.(doc.id)}
                  aria-label="Delete document"
                  className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-red-600 bg-red-50/70 hover:bg-red-100 hover:text-red-700 transition-colors"
                >
                  <FaTrashAlt className="w-4 h-4" />
                </button>
              </AppTooltip>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
