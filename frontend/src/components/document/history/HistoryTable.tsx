import { UploadHistory } from "../../../types";

type HistoryTableProps = {
  items: UploadHistory[];
  restoringId: number | string | null;
  onRestore: (id: number | string) => void;
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
  restoringId,
  onRestore,
}: HistoryTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100">
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-[34%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Nama Dokumen
              </th>
              <th className="w-[20%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Tanggal Upload
              </th>
              <th className="w-[30%] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Informasi
              </th>
              <th className="w-[16%] px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-4 align-top">
                  <div
                    className="truncate text-sm font-medium text-gray-900"
                    title={item.documentName}
                  >
                    {item.documentName}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {item.fileSize}
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-700 align-top">
                  {formatDate(item.uploadedAt)}
                </td>
                <td
                  className="px-4 py-4 align-top text-sm text-gray-600"
                  title={`Diunggah oleh ${item.uploadedBy}`}
                >
                  <span className="block truncate">
                    Diunggah oleh {item.uploadedBy}
                  </span>
                </td>
                <td className="px-4 py-4 text-right align-top">
                  <button
                    type="button"
                    disabled={restoringId === item.id}
                    onClick={() => onRestore(item.id)}
                    className="inline-flex items-center justify-center rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600 transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {restoringId === item.id
                      ? "Memproses..."
                      : "Restorasi File"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
