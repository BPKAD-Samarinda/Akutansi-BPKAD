import { MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";
import { FaTrashAlt } from "react-icons/fa";
import { Document } from "../../../types";

interface DocumentRowProps {
  doc: Document;
  isSelected: boolean;
  onSelect: (id: number | string) => void;
  onView?: (id: number | string) => void;
  onEdit?: (id: number | string) => void;
  onDelete?: (id: number | string) => void;
}

export default function DocumentRow({
  doc,
  isSelected,
  onSelect,
  onView,
  onEdit,
  onDelete,
}: DocumentRowProps) {
  // 🔥 ambil format dari file_path
  const getFileFormat = (filePath: string) => {
    return filePath.split(".").pop()?.toLowerCase() || "";
  };

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
      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
        isSelected ? "bg-orange-50" : ""
      }`}
    >
      {/* Checkbox */}
      <td className="py-4 px-2 w-12 text-center align-middle">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(doc.id)}
          aria-label={`Select document ${doc.nama_sppd}`}
          className="block mx-auto w-4 h-4 text-orange-600 border-gray-300 rounded cursor-pointer"
        />
      </td>

      {/* No SPPD */}
      <td className="py-4 px-2 text-sm font-medium text-gray-800">
        {doc.nama_sppd}
      </td>

      {/* Kategori */}
      <td className="py-4 px-2 text-sm text-center text-gray-700">
        {doc.kategori}
      </td>

      {/* Format */}
      <td className="py-4 px-2 text-center">
        <span
          className={`px-3 py-1 ${getFormatStyle(
            doc.file_path,
          )} rounded-full text-xs font-semibold`}
        >
          {format.toUpperCase()}
        </span>
      </td>

      {/* Tanggal */}
      <td className="py-4 px-2 text-center text-sm text-gray-600">
        {new Date(doc.tanggal_sppd).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </td>

      {/* Aksi */}
      <td className="py-4 px-2">
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => onView?.(doc.id)}
            aria-label="View document"
            title="Lihat dokumen"
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            <IoMdEye className="w-6 h-6" />
          </button>
          <button
            onClick={() => onEdit?.(doc.id)}
            aria-label="Edit document"
            title="Edit dokumen"
            className="text-amber-500 hover:text-amber-600 transition-colors"
          >
            <MdEdit className="w-6 h-6" />
          </button>
          <button
            onClick={() => onDelete?.(doc.id)}
            aria-label="Delete document"
            title="Hapus dokumen"
            className="text-red-600 hover:text-red-700 transition-colors"
          >
            <FaTrashAlt className="w-5 h-5" />
          </button>
        </div>
      </td>
    </tr>
  );
}
