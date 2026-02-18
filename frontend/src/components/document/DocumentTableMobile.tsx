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
  return (
    <div className="md:hidden space-y-3">
      {documents.length > 0 ? (
        documents.map((doc) => (
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
                  title="Pilih Dokumen"
                  checked={selectedDocuments.has(doc.id)}
                  onChange={() => onSelectDocument(doc.id)}
                  className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 cursor-pointer mt-0.5"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-sm mb-2">
                    {doc.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-600 flex-wrap">
                    <span
                      className={`px-2 py-1 ${
                        doc.format.toLowerCase() === "pdf"
                          ? "bg-red-100 text-red-600"
                          : doc.format.toLowerCase() === "xlsx"
                            ? "bg-green-100 text-green-600"
                            : doc.format.toLowerCase() === "docx"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-orange-100 text-orange-600"
                      } rounded-full font-semibold`}
                    >
                      {doc.format}
                    </span>
                    <span>{doc.size}</span>
                    <span>{doc.date}</span>
                    {doc.category && (
                      <span
                        className={`px-2 py-1 rounded-full font-semibold ${
                          doc.category === "Keuangan"
                            ? "bg-purple-100 text-purple-600"
                            : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        {doc.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-2 border-t border-gray-200">
              <button
                onClick={() => onView?.(doc.id)}
                className="flex-1 py-2 rounded-lg bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 transition"
              >
                Lihat
              </button>
              <button
                onClick={() => onEdit?.(doc.id)}
                className="flex-1 py-2 rounded-lg bg-yellow-50 text-yellow-600 text-xs font-medium hover:bg-yellow-100 transition"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete?.(doc.id)}
                className="flex-1 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition"
              >
                Hapus
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="py-12 text-center text-gray-400">
          Tidak ada dokumen ditemukan
        </div>
      )}
    </div>
  );
}
