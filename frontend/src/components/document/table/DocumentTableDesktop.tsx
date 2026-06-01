import { Document } from "../../../types";
import DocumentRow from "./DocumentRow";
import AppTooltip from "../../ui/app-tooltip";

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
  pageStartIndex: number;
  loading?: boolean;
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
  pageStartIndex,
  loading = false,
}: DocumentTableDesktopProps) {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full min-w-full table-fixed border-collapse text-sm">
        <thead>
          <tr style={{ backgroundColor: '#FF7A00', color: 'white' }}>
            <th className="text-center align-middle py-3.5 px-3 font-bold w-12 uppercase tracking-wider text-xs">
              <AppTooltip content="Pilih Semua">
                <input
                  type="checkbox"
                  title=""
                  aria-label="Pilih semua dokumen"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) {
                      input.indeterminate = someSelected;
                    }
                  }}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="block mx-auto premium-checkbox-orange-header"
                />
              </AppTooltip>
            </th>
            <th className="text-left py-3.5 px-3 font-bold uppercase tracking-wider text-xs w-[30%]">
              JUDUL / NAMA DOKUMEN
            </th>
            <th className="text-center py-3.5 px-3 font-bold uppercase tracking-wider text-xs w-[16%]">
              KATEGORI
            </th>
            <th className="text-center py-3.5 px-3 font-bold uppercase tracking-wider text-xs w-[11%]">
              FORMAT
            </th>
            <th className="text-center py-3.5 px-3 font-bold uppercase tracking-wider text-xs w-[16%]">
              TANGGAL
            </th>
            <th className="text-center py-3.5 px-3 font-bold uppercase tracking-wider text-xs w-[14%]">
              AKSI
            </th>
          </tr>
        </thead>

        <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-100 dark:divide-slate-800">
          {loading ? (
            <tr>
              <td colSpan={6} className="py-16 text-center text-gray-400 dark:text-slate-500 text-sm">
                Mengambil data dari server...
              </td>
            </tr>
          ) : documents.length > 0 ? (
            documents.map((doc) => (
              <DocumentRow
                key={doc.id}
                doc={doc}
                isSelected={selectedDocuments.has(doc.id)}
                onSelect={onSelectDocument}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                rowNumber={0}
              />
            ))
          ) : (
            <tr>
              <td colSpan={6} className="py-16 text-center text-gray-400 dark:text-slate-500 text-sm">
                Belum ada dokumen.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
