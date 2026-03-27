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
    <div className="bg-gradient-to-br from-slate-50 via-white to-slate-100/60 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
            Aktivitas Dokumen
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pantau unggahan terbaru dan hari ini.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 dark:bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-200">
          {todayRows.length + latestRows.length} aktivitas
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-orange-100 dark:border-slate-800 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 px-4 py-3 border-b border-orange-100 dark:border-slate-800">
            <h4 className="text-sm font-semibold text-orange-700 dark:text-slate-200">
              Aktivitas Hari Ini
            </h4>
          </div>

          <div
            className={`overflow-x-auto ${todayShouldScroll ? "max-h-[420px] overflow-y-auto" : ""}`}
          >
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900">
                <tr className="text-slate-500 dark:text-slate-400">
                  <th className="text-left px-3 py-2 text-xs font-semibold">Nama</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold">Kategori</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {todayRows.map((row) => (
                  <tr key={row.id} className="border-b border-gray-100 dark:border-slate-800 hover:bg-orange-50/40 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="px-3 py-2 text-slate-900 dark:text-slate-100 font-medium">{row.name}</td>
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.kategori}</td>
                    <td className="px-3 py-2 text-slate-600 dark:text-slate-300">{row.tanggal}</td>
                  </tr>
                ))}
                {todayRows.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-3 py-3 text-center text-slate-500 dark:text-slate-400">
                      Belum ada upload hari ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-indigo-100 dark:border-slate-800 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-50 via-sky-50 to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 px-4 py-3 border-b border-indigo-100 dark:border-slate-800">
            <h4 className="text-sm font-semibold text-indigo-700 dark:text-slate-200">
              Dokumen Terakhir Diunggah
            </h4>
          </div>

          <div
            className={`overflow-x-auto ${latestShouldScroll ? "max-h-[420px] overflow-y-auto" : ""}`}
          >
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900">
                <tr className="text-slate-500 dark:text-slate-400">
                  <th className="text-left px-3 py-2 text-xs font-semibold">Nama</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold">Kategori</th>
                  <th className="text-left px-3 py-2 text-xs font-semibold">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {latestRows.map((row) => (
                  <tr key={row.id} className="border-b border-gray-100 dark:border-slate-800 hover:bg-indigo-50/40 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="px-3 py-2 text-slate-900 dark:text-slate-100 font-medium">{row.name}</td>
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.kategori}</td>
                    <td className="px-3 py-2 text-slate-600 dark:text-slate-300">{row.tanggal}</td>
                  </tr>
                ))}
                {latestRows.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-3 py-3 text-center text-slate-500 dark:text-slate-400">
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
