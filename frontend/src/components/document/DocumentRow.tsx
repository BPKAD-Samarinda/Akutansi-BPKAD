import eyeIcon from "../../assets/icons/eye.svg";
import editIcon from "../../assets/icons/edit.svg";
import deleteIcon from "../../assets/icons/delete.svg";
import { Document } from "../../types";

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
      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
        isSelected ? "bg-orange-50" : ""
      }`}
    >
      {/* Checkbox */}
      <td className="py-4 px-2 w-12 text-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(doc.id)}
        />
      </td>

      {/* No SPPD */}
      <td className="py-4 px-2 text-sm font-medium text-gray-800">
        {doc.nama_sppd}
      </td>

      {/* Nama Kegiatan */}
      <td className="py-4 px-2 text-sm text-gray-700">
        {doc.kategori}
      </td>

      {/* Format */}
      <td className="py-4 px-2 text-center">
        <span
          className={`px-3 py-1 ${getFormatStyle(
            doc.file_path
          )} rounded-full text-xs font-semibold`}
        >
          {format.toUpperCase()}
        </span>
      </td>

      {/* Tanggal */}
      <td className="py-4 px-2 text-center text-sm text-gray-600">
        {new Date(doc.tanggal_sppd).toLocaleDateString("id-ID")}
      </td>

      {/* Aksi */}
      <td className="py-4 px-2">
        <div className="flex gap-3 justify-center">
          <button onClick={() => onView?.(doc.id)}>
            <img src={eyeIcon} className="w-5 h-5 opacity-70" />
          </button>
          <button onClick={() => onEdit?.(doc.id)}>
            <img src={editIcon} className="w-5 h-5 opacity-70" />
          </button>
          <button onClick={() => onDelete?.(doc.id)}>
            <img src={deleteIcon} className="w-5 h-5 opacity-70" />
          </button>
        </div>
      </td>
    </tr>
  );
}