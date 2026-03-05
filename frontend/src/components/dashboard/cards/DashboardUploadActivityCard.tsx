type Props = {
  todayRows: Array<{
    id: number;
    name: string;
    kategori: string;
    tanggal: string;
  }>;
  latestRows: Array<{
    id: number;
    name: string;
    kategori: string;
    tanggal: string;
  }>;
};

export default function DashboardUploadActivityCard({
  todayRows,
  latestRows,
}: Props) {
  const todayShouldScroll = todayRows.length > 10;
  const latestShouldScroll = latestRows.length > 10;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4">
        Aktivitas
      </h3>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="rounded-xl border border-orange-100 overflow-hidden">
          <div className="bg-orange-50 px-4 py-3 border-b border-orange-100">
            <h4 className="text-sm font-semibold text-orange-700">Aktivitas Hari Ini</h4>
          </div>

          <div
            className={`overflow-x-auto ${todayShouldScroll ? "max-h-[420px] overflow-y-auto" : ""}`}
          >
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-gray-500">
                  <th className="text-left px-3 py-2 text-xs font-semibold">Nama</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold">Kategori</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {todayRows.map((row) => (
                  <tr key={row.id} className="border-b border-gray-100">
                    <td className="px-3 py-2 text-slate-800">{row.name}</td>
                    <td className="px-3 py-2 text-slate-700">{row.kategori}</td>
                    <td className="px-3 py-2 text-slate-700">{row.tanggal}</td>
                  </tr>
                ))}
                {todayRows.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-3 py-3 text-center text-slate-500">
                      Belum ada upload hari ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-blue-100 overflow-hidden">
          <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
            <h4 className="text-sm font-semibold text-blue-700">Dokumen Terakhir Diunggah</h4>
          </div>

          <div
            className={`overflow-x-auto ${latestShouldScroll ? "max-h-[420px] overflow-y-auto" : ""}`}
          >
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-gray-500">
                  <th className="text-left px-3 py-2 text-xs font-semibold">Nama</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold">Kategori</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {latestRows.map((row) => (
                  <tr key={row.id} className="border-b border-gray-100">
                    <td className="px-3 py-2 text-slate-800">{row.name}</td>
                    <td className="px-3 py-2 text-slate-700">{row.kategori}</td>
                    <td className="px-3 py-2 text-slate-700">{row.tanggal}</td>
                  </tr>
                ))}
                {latestRows.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-3 py-3 text-center text-slate-500">
                      Belum ada dokumen terbaru.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
