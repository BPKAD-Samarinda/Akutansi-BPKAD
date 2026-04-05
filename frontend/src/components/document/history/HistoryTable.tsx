import { UploadHistory } from "../../../types";
import AppTooltip from "../../ui/app-tooltip";
import { toLocalDateOnly } from "../../../utils/localDate";

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
    return "Dihapus Sementara";
  }

  return "Diunggah";
};

const getStatusStyles = (status: string) => {
  if (status === "Diedit") {
    return "bg-blue-50 text-blue-700";
  }

  if (status === "Dihapus Sementara") {
    return "bg-red-50 text-red-700";
  }

  return "bg-emerald-50 text-emerald-700";
};

const formatDate = (dateValue: string) => {
  if (!dateValue) {
    return "-";
  }

  const dateOnly = toLocalDateOnly(dateValue);
  const [year, month, day] = dateOnly.split("-").map(Number);
  if (!year || !month || !day) {
    return dateValue;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
};

const getFileName = (value?: string | null) => {
  if (!value) return "-";
  const normalized = value.replace(/\\/g, "/");
  return normalized.split("/").pop() || value;
};

const getEditChanges = (item: UploadHistory) => {
  const before = item.editBefore || null;
  const after = item.editAfter || null;
  if (!before || !after) return [];

  const fields: Array<{
    key: string;
    label: string;
    type?: "date" | "file";
  }> = [
    { key: "nama_sppd", label: "Nama" },
    { key: "kategori", label: "Kategori" },
    { key: "tanggal_sppd", label: "Tanggal", type: "date" },
    { key: "file_path", label: "File", type: "file" },
  ];

  const formatValue = (
    value: string | null | undefined,
    type?: "date" | "file",
  ) => {
    if (!value) return "-";
    if (type === "file") return getFileName(value);
    if (type === "date") return formatDate(value);
    return String(value);
  };

  return fields
    .map((field) => {
      const beforeValue = before[field.key] ?? "";
      const afterValue = after[field.key] ?? "";
      if (String(beforeValue) === String(afterValue)) {
        return null;
      }

      return {
        label: field.label,
        before: formatValue(beforeValue, field.type),
        after: formatValue(afterValue, field.type),
      };
    })
    .filter(Boolean) as Array<{ label: string; before: string; after: string }>;
};

const formatEditSummary = (
  changes: Array<{ label: string; before: string; after: string }>,
) => {
  return {
    before: changes.map((change) => `${change.label}: ${change.before}`),
    after: changes.map((change) => `${change.label}: ${change.after}`),
  };
};

export default function HistoryTable({
  items,
  selectedIds,
  allRestorableSelected,
  onToggleSelectAll,
  onToggleSelect,
}: HistoryTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-slate-800">
      <div className="md:hidden divide-y divide-gray-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
        {items.map((item) => {
          const status = getHistoryStatus(item);
          const editChanges = status === "Diedit" ? getEditChanges(item) : [];
          const isDeleted = status === "Dihapus Sementara";
          const editSummary = formatEditSummary(editChanges);
          return (
            <div key={item.id} className="p-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selectedIds.has(String(item.id))}
                  disabled={!item.isDeleted}
                  onChange={(event) =>
                    onToggleSelect(item.id, event.target.checked)
                  }
                  className="mt-1 h-4 w-4 rounded border-gray-300 dark:border-slate-600 accent-orange-600 disabled:opacity-40"
                  aria-label={`Pilih dokumen ${item.documentName}`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <AppTooltip content={item.documentName}>
                      <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 truncate">
                        {item.documentName}
                      </p>
                    </AppTooltip>
                    <span
                      className={`inline-flex shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusStyles(
                        status,
                      )}`}
                    >
                      {status}
                    </span>
                  </div>
                  {item.fileSize && item.fileSize !== "-" && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                      {item.fileSize}
                    </p>
                  )}
                  {editChanges.length > 0 && (
                    <div className="mt-2 grid gap-2 text-[11px] text-gray-500 dark:text-slate-400">
                      <div>
                        <p className="font-semibold text-gray-600 dark:text-slate-300">
                          Sebelum:
                        </p>
                        {editSummary.before.map((line) => (
                          <p key={line} className="truncate">
                            {line}
                          </p>
                        ))}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-600 dark:text-slate-300">
                          Sesudah:
                        </p>
                        {editSummary.after.map((line) => (
                          <p key={line} className="truncate">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-slate-300">
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-slate-500">
                        Tanggal
                      </p>
                      <p className="font-medium text-gray-700 dark:text-slate-200">
                        {formatDate(item.uploadedAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-slate-500">
                        {editChanges.length > 0
                          ? "Perubahan"
                          : isDeleted
                            ? "Dihapus oleh"
                            : "Diunggah oleh"}
                      </p>
                      {editChanges.length > 0 ? (
                        <p className="font-medium text-gray-700 dark:text-slate-200 truncate">
                          {editChanges.map((change) => change.label).join(", ")}
                        </p>
                      ) : (
                        <p className="font-medium text-gray-700 dark:text-slate-200 truncate">
                          {item.uploadedBy}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full table-fixed divide-y divide-gray-100 dark:divide-slate-800">
          <colgroup>
            <col style={{ width: "6%" }} />
            <col style={{ width: "40%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "16%" }} />
          </colgroup>
          <thead className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-b border-orange-600">
            <tr>
              <th className="px-3 py-3 text-center">
                <input
                  type="checkbox"
                  checked={allRestorableSelected}
                  onChange={(event) => onToggleSelectAll(event.target.checked)}
                  className="h-4 w-4 rounded border-white/60 bg-transparent accent-orange-400"
                  aria-label="Pilih semua dokumen terhapus"
                />
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-white">
                Nama Dokumen
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-white">
                Tanggal
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-white">
                Informasi
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-white">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
            {items.map((item) => {
              const status = getHistoryStatus(item);
              const editChanges = status === "Diedit" ? getEditChanges(item) : [];
              const isDeleted = status === "Dihapus Sementara";
              const editSummary = formatEditSummary(editChanges);

              return (
                <tr
                  key={item.id}
                  className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors odd:bg-white dark:odd:bg-slate-900 even:bg-slate-50/40 dark:even:bg-slate-900/40"
                >
                  <td className="px-3 py-4 text-center align-top">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(String(item.id))}
                      disabled={!item.isDeleted}
                      onChange={(event) =>
                        onToggleSelect(item.id, event.target.checked)
                      }
                      className="h-4 w-4 rounded border-gray-300 dark:border-slate-600 accent-orange-500 disabled:opacity-40"
                      aria-label={`Pilih dokumen ${item.documentName}`}
                    />
                  </td>
                  <td className="max-w-0 px-4 py-4 align-top">
                    <AppTooltip content={item.documentName}>
                      <div className="block w-full truncate text-sm font-medium text-gray-900 dark:text-slate-100">
                        {item.documentName}
                      </div>
                    </AppTooltip>
                    {item.fileSize && item.fileSize !== "-" && (
                      <div className="mt-1 block w-full truncate text-xs text-gray-500 dark:text-slate-400">
                        {item.fileSize}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700 dark:text-slate-200 align-top">
                    {formatDate(item.uploadedAt)}
                  </td>
                  <td className="px-4 py-4 align-top text-sm text-gray-600 dark:text-slate-300">
                    {editChanges.length > 0 ? (
                      <div className="grid gap-2 text-xs text-gray-500 dark:text-slate-400">
                        <div>
                          <span className="block font-medium text-gray-600 dark:text-slate-300">
                            Sebelum:
                          </span>
                          {editSummary.before.map((line) => (
                            <div key={line} className="truncate">
                              {line}
                            </div>
                          ))}
                        </div>
                        <div>
                          <span className="block font-medium text-gray-600 dark:text-slate-300">
                            Sesudah:
                          </span>
                          {editSummary.after.map((line) => (
                            <div key={line} className="truncate">
                              {line}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <AppTooltip
                        content={
                          isDeleted
                            ? `Dihapus oleh ${item.uploadedBy}`
                            : `Diunggah oleh ${item.uploadedBy}`
                        }
                      >
                        <span className="block truncate">
                          {isDeleted ? "Dihapus oleh" : "Diunggah oleh"}{" "}
                          {item.uploadedBy}
                        </span>
                      </AppTooltip>
                    )}
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
