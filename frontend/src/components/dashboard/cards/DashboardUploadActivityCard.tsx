type Props = {
  todayUploadCount: number;
  latestDocument: {
    name: string;
    uploadedAt: string;
  } | null;
  rows: Array<{
    id: number;
    name: string;
    kategori: string;
    tanggal: string;
  }>;
};

export default function DashboardUploadActivityCard({
  todayUploadCount,
  latestDocument,
  rows,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">
        Aktivitas Upload
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div className="rounded-xl border border-orange-100 bg-orange-50/40 px-4 py-3">
          <p className="text-xs font-medium text-slate-500">Aktivitas Hari Ini</p>
          <p className="text-lg font-bold text-orange-500">{todayUploadCount} dokumen</p>
        </div>

        <div className="rounded-xl border border-blue-100 bg-blue-50/40 px-4 py-3">
          <p className="text-xs font-medium text-slate-500">Dokumen Terakhir Diunggah</p>
          {latestDocument ? (
            <>
              <p className="text-sm font-semibold text-slate-900 mt-1 truncate">{latestDocument.name}</p>
              <p className="text-xs text-slate-500">{latestDocument.uploadedAt}</p>
            </>
          ) : (
            <p className="text-sm text-slate-500 mt-1">Belum ada dokumen</p>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-gray-500">
              <th className="text-left px-3 py-2 text-xs font-semibold">Nama</th>
              <th className="text-left px-3 py-2 text-xs font-semibold">Kategori</th>
              <th className="text-left px-3 py-2 text-xs font-semibold">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-gray-100">
                <td className="px-3 py-2 text-slate-800">{row.name}</td>
                <td className="px-3 py-2 text-slate-700">{row.kategori}</td>
                <td className="px-3 py-2 text-slate-700">{row.tanggal}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={3} className="px-3 py-3 text-center text-slate-500">
                  Belum ada data upload.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
