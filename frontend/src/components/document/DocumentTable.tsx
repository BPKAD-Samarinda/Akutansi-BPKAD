import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DocumentRow from "./DocumentRow";
import { Document } from "../../types";
import uploadIcon from "../../assets/icons/upload.svg";

interface DocumentTableProps {
  documents: Document[];
  totalDocuments: number;
  selectedDocuments: Set<number | string>;
  onView?: (id: number | string) => void;
  onEdit?: (id: number | string) => void;
  onDelete?: (id: number | string) => void;
  onSelectDocument: (id: number | string) => void;
  onSelectAll: (checked: boolean) => void;
}

type SortOrder = "newest" | "oldest" | null;

export default function DocumentTable({
  documents,
  totalDocuments,
  selectedDocuments,
  onView,
  onEdit,
  onDelete,
  onSelectDocument,
  onSelectAll,
}: DocumentTableProps) {
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Parse tanggal Indonesia
  const parseIndonesianDate = (dateStr: string): Date => {
    const months: { [key: string]: number } = {
      Januari: 0, Februari: 1, Maret: 2, April: 3, Mei: 4, Juni: 5,
      Juli: 6, Agustus: 7, September: 8, Oktober: 9, November: 10, Desember: 11
    };
    
    const parts = dateStr.split(" ");
    const day = parseInt(parts[0]);
    const month = months[parts[1]];
    const year = parseInt(parts[2]);
    
    return new Date(year, month, day);
  };

  // Sorting logic - FIXED
  const sortedDocuments = [...documents].sort((a, b) => {
    if (!sortOrder) return 0;
    
    const dateA = parseIndonesianDate(a.date);
    const dateB = parseIndonesianDate(b.date);

    if (sortOrder === "newest") {
      return dateB.getTime() - dateA.getTime(); // Terbaru di atas
    } else {
      return dateA.getTime() - dateB.getTime(); // Terlama di atas
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(totalDocuments / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDocuments = sortedDocuments.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleUploadClick = () => {
    navigate("/upload");
  };

  const handleSortClick = (order: "newest" | "oldest") => {
    setSortOrder(order);
  };

  // Check if all current page documents are selected
  const allSelected = currentDocuments.length > 0 && currentDocuments.every(doc => selectedDocuments.has(doc.id));
  const someSelected = currentDocuments.some(doc => selectedDocuments.has(doc.id)) && !allSelected;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-6">
      {/* Header table */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => handleSortClick("newest")}
            className={`px-4 lg:px-5 py-2 rounded-full text-xs lg:text-sm font-semibold transition-all ${
              sortOrder === "newest"
                ? "bg-orange-100 text-orange-600 shadow-sm"
                : "border border-gray-300 text-gray-400 hover:border-gray-400"
            }`}
          >
            TERBARU
          </button>
          <button
            onClick={() => handleSortClick("oldest")}
            className={`px-4 lg:px-5 py-2 rounded-full text-xs lg:text-sm font-semibold transition-all ${
              sortOrder === "oldest"
                ? "bg-orange-100 text-orange-600 shadow-sm"
                : "border border-gray-300 text-gray-400 hover:border-gray-400"
            }`}
          >
            TERLAMA
          </button>
        </div>

        <button
          onClick={handleUploadClick}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 lg:px-5 py-2.5 lg:py-3 rounded-xl flex items-center gap-2 text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 w-full sm:w-auto justify-center"
        >
          <img src={uploadIcon} className="w-4 h-4 lg:w-5 lg:h-5" alt="Upload" />
          Unggah Baru
        </button>
      </div>

      {/* Table - Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-gray-500 border-b border-gray-200">
            <tr>
              <th className="text-center py-4 px-2 font-semibold w-12">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={input => {
                    if (input) {
                      input.indeterminate = someSelected;
                    }
                  }}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 cursor-pointer"
                />
              </th>
              <th className="text-left py-4 px-2 font-semibold">Nama</th>
              <th className="text-center py-4 px-2 font-semibold">Format</th>
              <th className="text-center py-4 px-2 font-semibold">Size</th>
              <th className="text-center py-4 px-2 font-semibold">Tanggal</th>
              <th className="text-center py-4 px-2 font-semibold">Kategori</th>
              <th className="text-center py-4 px-2 font-semibold">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {currentDocuments.length > 0 ? (
              currentDocuments.map((doc) => (
                <DocumentRow
                  key={doc.id}
                  doc={doc}
                  isSelected={selectedDocuments.has(doc.id)}
                  onSelect={onSelectDocument}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center text-gray-400">
                  Tidak ada dokumen ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card View - Mobile */}
      <div className="md:hidden space-y-3">
        {currentDocuments.length > 0 ? (
          currentDocuments.map((doc) => (
            <div
              key={doc.id}
              className={`bg-gray-50 rounded-xl p-4 space-y-3 border ${
                selectedDocuments.has(doc.id) ? "border-orange-300 bg-orange-50" : "border-gray-100"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <input
                    type="checkbox"
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
                        <span className={`px-2 py-1 rounded-full font-semibold ${
                          doc.category === "Keuangan"
                            ? "bg-purple-100 text-purple-600"
                            : "bg-amber-100 text-amber-600"
                        }`}>
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

      {/* Footer - Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4 text-xs lg:text-sm text-gray-500">
        <span className="font-semibold">
          TOTAL {totalDocuments} DOKUMEN
        </span>

        <div className="flex gap-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`w-8 h-8 lg:w-9 lg:h-9 border rounded-lg flex items-center justify-center transition ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            ‹
          </button>

          {[...Array(Math.min(totalPages, 3))].map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`w-8 h-8 lg:w-9 lg:h-9 rounded-lg transition ${
                  currentPage === pageNum
                    ? "bg-orange-500 text-white shadow-md"
                    : "border hover:bg-gray-100"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`w-8 h-8 lg:w-9 lg:h-9 border rounded-lg flex items-center justify-center transition ${
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}