type DocumentTablePaginationProps = {
  totalDocuments: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function DocumentTablePagination({
  totalDocuments,
  currentPage,
  totalPages,
  onPageChange,
}: DocumentTablePaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4 text-xs lg:text-sm text-gray-500">
      <span className="font-semibold">TOTAL {totalDocuments} DOKUMEN</span>

      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
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
              onClick={() => onPageChange(pageNum)}
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
          onClick={() => onPageChange(currentPage + 1)}
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
  );
}
