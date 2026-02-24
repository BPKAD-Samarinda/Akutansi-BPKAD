import { Document } from "../../types";

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

  // 🔥 ambil ekstensi dari file_path
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

  return (
    <div className="md:hidden space-y-3">
      {documents.length > 0 ? (
        documents.map((doc) => {
          const format = getFileFormat(doc.file_path);

          return (
            <div
              key={doc.id}
              className={`bg-gray-50 rounded-xl p-4 space-y-3 border ${
                selectedDocuments.has(doc.id)
                  ? "border-orange-300 bg-orange-50"
                  : "border-gray-100"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={selectedDocuments.has(doc.id)}
                    onChange={() => onSelectDocument(doc.id)}
                    className="w-5 h-5 text-orange-600 border-gray-300 rounded"
                  />

                  <div className="flex-1">
                    {/* No SPPD */}
                    <h3 className="font-semibold text-gray-800 text-sm">
                      {doc.nama_sppd}
                    </h3>

                    {/* Nama Kegiatan */}
                    <p className="text-xs text-gray-600 mt-1">
                      {doc.kategori}
                    </p>

                    <div className="flex items-center gap-2 text-xs mt-2 flex-wrap">
                      {/* Format */}
                      <span
                        className={`px-2 py-1 ${getFormatStyle(
                          doc.file_path
                        )} rounded-full font-semibold`}
                      >
                        {format.toUpperCase()}
                      </span>

                      {/* Tanggal */}
                      <span className="text-gray-500">
                        {new Date(doc.tanggal_sppd).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-gray-200">
                <button
                  onClick={() => onView?.(doc.id)}
                  className="flex-1 py-2 rounded-lg bg-blue-50 text-blue-600 text-xs font-medium"
                >
                  Lihat
                </button>
                <button
                  onClick={() => onEdit?.(doc.id)}
                  className="flex-1 py-2 rounded-lg bg-yellow-50 text-yellow-600 text-xs font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete?.(doc.id)}
                  className="flex-1 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-medium"
                >
                  Hapus
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <div className="py-12 text-center text-gray-400">
          Tidak ada dokumen ditemukan
        </div>
      )}
    </div>
  );
}