type Props = {
  todayRows: Array<{
    id: number;
    name: string;
    kategori: string;
    tanggalDokumen: string;
    tanggalUnggah: string;
    fileName?: string;
  }>;
  latestRows: Array<{
    id: number;
    name: string;
    kategori: string;
    tanggalDokumen: string;
    tanggalUnggah: string;
    fileName?: string;
  }>;
};

export default function DashboardUploadActivityCard({
  todayRows,
  latestRows,
}: Props) {
  const todayShouldScroll = todayRows.length > 10;
  const latestShouldScroll = latestRows.length > 10;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-6 shadow-sm hover:shadow-xl dark:hover:shadow-indigo-500/5 transition-all duration-300">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden shadow-sm">
          <div className="bg-slate-50/80 dark:bg-slate-800/50 px-5 py-3.5 border-b border-slate-200/60 dark:border-slate-800/60">
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              Aktivitas Hari Ini
            </h4>
          </div>

          <div
            className={`overflow-x-auto custom-scrollbar ${todayShouldScroll ? "max-h-[400px] overflow-y-auto" : ""}`}
          >
            <table className="w-full text-sm">
              <thead className="bg-white dark:bg-slate-900 sticky top-0 z-10 backdrop-blur-sm">
                <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/60">
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider">Pengunggah</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider">Nama Dokumen</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider">Kategori</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider">Tanggal Dokumen</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider">Tanggal Unggah</th>
                </tr>
              </thead>
              <tbody>
                {todayRows.map((row) => (
                  <tr key={row.id} className="border-b border-slate-50 dark:border-slate-800/40 hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="px-4 py-3 text-slate-900 dark:text-slate-100 font-semibold">{row.name}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300 whitespace-normal break-words max-w-[260px]">
                      {row.fileName || "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                      <span className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                        {row.kategori}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">{row.tanggalDokumen}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">{row.tanggalUnggah}</td>
                  </tr>
                ))}
                {todayRows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-3 py-3 text-center text-slate-500 dark:text-slate-400">
                      Belum ada upload hari ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden shadow-sm">
          <div className="bg-slate-50/80 dark:bg-slate-800/50 px-5 py-3.5 border-b border-slate-200/60 dark:border-slate-800/60">
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              Dokumen Terakhir Diunggah
            </h4>
          </div>

          <div
            className={`overflow-x-auto custom-scrollbar ${latestShouldScroll ? "max-h-[400px] overflow-y-auto" : ""}`}
          >
            <table className="w-full text-sm">
              <thead className="bg-white dark:bg-slate-900 sticky top-0 z-10 backdrop-blur-sm">
                <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800/60">
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider">Pengunggah</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider">Nama Dokumen</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider">Kategori</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider">Tanggal Dokumen</th>
                  <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider">Tanggal Unggah</th>
                </tr>
              </thead>
              <tbody>
                {latestRows.map((row) => (
                  <tr key={row.id} className="border-b border-slate-50 dark:border-slate-800/40 hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="px-4 py-3 text-slate-900 dark:text-slate-100 font-semibold">{row.name}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300 whitespace-normal break-words max-w-[260px]">
                      {row.fileName || "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                      <span className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                        {row.kategori}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">{row.tanggalDokumen}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">{row.tanggalUnggah}</td>
                  </tr>
                ))}
                {latestRows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-3 py-3 text-center text-slate-500 dark:text-slate-400">
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
