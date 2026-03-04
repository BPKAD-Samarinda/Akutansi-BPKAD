import { UploadHistory } from "../../../types";
import AppTooltip from "../../ui/app-tooltip";

type HistoryTableProps = {
  items: UploadHistory[];
  selectedIds: Set<string>;
  allRestorableSelected: boolean;
  onToggleSelectAll: (checked: boolean) => void;
  onToggleSelect: (id: number | string, checked: boolean) => void;
};

const getHistoryStatus = (item: UploadHistory) => {
  const normalizedStatus = item.status?.toLowerCase();

  if (normalizedStatus === "diedit") {
    return "Diedit";
  }

  if (normalizedStatus === "dihapus" || item.isDeleted) {
    return "Dihapus";
  }

  return "Diunggah";
};

const getStatusStyles = (status: string) => {
  if (status === "Diedit") {
    return "bg-blue-50 text-blue-700";
  }

  if (status === "Dihapus") {
    return "bg-red-50 text-red-700";
  }

  return "bg-emerald-50 text-emerald-700";
};

const formatDate = (dateValue: string) => {
  if (!dateValue) {
    return "-";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

export default function HistoryTable({
  items,
  selectedIds,
  allRestorableSelected,
  onToggleSelectAll,
  onToggleSelect,
}: HistoryTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed divide-y divide-gray-100">
          <colgroup>
            <col style={{ width: "6%" }} />
            <col style={{ width: "70%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "16%" }} />
          </colgroup>
          <thead className="bg-gradient-to-r from-orange-500 to-orange-600">
            <tr>
              <th className="px-3 py-3 text-center">
                <input
                  type="checkbox"
                  checked={allRestorableSelected}
                  onChange={(event) => onToggleSelectAll(event.target.checked)}
                  className="h-4 w-4 rounded border-white/50 bg-transparent accent-orange-600"
                  aria-label="Pilih semua dokumen terhapus"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-primary-foreground">
                Nama Dokumen
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-primary-foreground">
                Tanggal Upload
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-primary-foreground">
                Informasi
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-primary-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {items.map((item) => {
              const status = getHistoryStatus(item);

              return (
                <tr key={item.id}>
                  <td className="px-3 py-4 text-center align-top">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(String(item.id))}
                      disabled={!item.isDeleted}
                      onChange={(event) =>
                        onToggleSelect(item.id, event.target.checked)
                      }
                      className="h-4 w-4 rounded border-gray-300 accent-orange-600 disabled:opacity-40"
                      aria-label={`Pilih dokumen ${item.documentName}`}
                    />
                  </td>
                  <td className="max-w-0 px-4 py-4 align-top">
                    <AppTooltip content={item.documentName}>
                      <div className="block w-full truncate text-sm font-medium text-gray-900">
                        {item.documentName}
                      </div>
                    </AppTooltip>
                    <div className="mt-1 block w-full truncate text-xs text-gray-500">
                      {item.fileSize}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700 align-top">
                    {formatDate(item.uploadedAt)}
                  </td>
                  <td className="px-4 py-4 align-top text-sm text-gray-600">
                    <AppTooltip content={`Diunggah oleh ${item.uploadedBy}`}>
                      <span className="block truncate">
                        Diunggah oleh {item.uploadedBy}
                      </span>
                    </AppTooltip>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyles(status)}`}
                    >
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
