import { Document } from "../../../types";
import DocumentRow from "./DocumentRow";

type DocumentTableDesktopProps = {
  documents: Document[];
  selectedDocuments: Set<number | string>;
  allSelected: boolean;
  someSelected: boolean;
  onSelectAll: (checked: boolean) => void;
  onSelectDocument: (id: number | string) => void;
  onView?: (id: number | string) => void;
  onEdit?: (id: number | string) => void;
  onDelete?: (id: number | string) => void;
};

export default function DocumentTableDesktop({
  documents,
  selectedDocuments,
  allSelected,
  someSelected,
  onSelectAll,
  onSelectDocument,
  onView,
  onEdit,
  onDelete,
}: DocumentTableDesktopProps) {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full table-fixed text-sm">
        <thead className="text-gray-950 border-b border-gray-200">
          <tr>
            <th className="text-center align-middle py-4 px-2 font-bold w-12">
              <input
                type="checkbox"
                title="Pilih Semua"
                checked={allSelected}
                ref={(input) => {
                  if (input) {
                    input.indeterminate = someSelected;
                  }
                }}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="block mx-auto w-4 h-4 text-orange-600 border-gray-300 rounded cursor-pointer"
              />
            </th>
            <th className="text-left py-4 px-2 font-bold w-1/5">Nama</th>
            <th className="text-center py-4 px-2 font-bold w-1/5">Kategori</th>
            <th className="text-center py-4 px-2 font-bold w-1/5">Format</th>
            <th className="text-center py-4 px-2 font-bold w-1/5">Tanggal</th>
            <th className="text-center py-4 px-2 font-bold w-1/5">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {documents.length > 0 ? (
            documents.map((doc) => (
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
                Dokumen kosong.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
