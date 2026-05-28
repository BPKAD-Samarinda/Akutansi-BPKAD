type Props = {
  todayRows: Array<{
    id: number | string;
    name: string;
    kategori: string;
    tanggalDokumen: string;
    tanggalUnggah: string;
    fileName?: string;
  }>;
  latestRows: Array<{
    id: number | string;
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
    <div className="bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/50 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-6 shadow-xl shadow-slate-200/20 dark:shadow-black/40 relative overflow-hidden group">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4 relative z-10">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-100 dark:border-amber-500/20 text-amber-500 shadow-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              Aktivitas Dokumen
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Pantau unggahan dokumen terbaru
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span>
          {todayRows.length + latestRows.length} aktivitas
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 relative z-10">
        {/* Aktivitas Hari Ini */}
        <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 overflow-hidden shadow-sm bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex flex-col">
          <div className="bg-slate-50/90 dark:bg-slate-800/90 px-5 py-4 border-b border-slate-200 dark:border-slate-700 backdrop-blur-md">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]"></span>
              Aktivitas Hari Ini
            </h4>
          </div>

          <div className={`overflow-x-auto custom-scrollbar flex-1 ${todayShouldScroll ? "max-h-[380px] overflow-y-auto" : ""}`}>
            <table className="w-full text-sm">
              <thead className="bg-slate-50/90 dark:bg-slate-800/90 sticky top-0 z-10 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
                <tr className="text-slate-500 dark:text-slate-400">
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-widest">Pengunggah</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-widest">Nama Dokumen</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-widest">Kategori</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-widest">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {todayRows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group/row">
                    <td className="px-5 py-3 text-slate-800 dark:text-slate-200 font-semibold group-hover/row:text-orange-600 dark:group-hover/row:text-orange-400 transition-colors">{row.name}</td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-400 whitespace-normal break-words max-w-[260px] text-xs">
                      {row.fileName || "-"}
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-600 dark:text-slate-300">
                        {row.kategori}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-500 dark:text-slate-400 text-xs">
                      {row.tanggalUnggah}
                    </td>
                  </tr>
                ))}
                {todayRows.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-2">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-sm">Belum ada aktivitas hari ini</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Terakhir Diunggah */}
        <div className="rounded-xl border border-slate-100 dark:border-slate-800/80 overflow-hidden shadow-sm bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex flex-col">
          <div className="bg-slate-50/90 dark:bg-slate-800/90 px-5 py-4 border-b border-slate-200 dark:border-slate-700 backdrop-blur-md">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></span>
              Terakhir Diunggah
            </h4>
          </div>

          <div className={`overflow-x-auto custom-scrollbar flex-1 ${latestShouldScroll ? "max-h-[380px] overflow-y-auto" : ""}`}>
            <table className="w-full text-sm">
              <thead className="bg-slate-50/90 dark:bg-slate-800/90 sticky top-0 z-10 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
                <tr className="text-slate-500 dark:text-slate-400">
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-widest">Pengunggah</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-widest">Nama Dokumen</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-widest">Kategori</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold uppercase tracking-widest">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {latestRows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group/row">
                    <td className="px-5 py-3 text-slate-800 dark:text-slate-200 font-semibold group-hover/row:text-indigo-600 dark:group-hover/row:text-indigo-400 transition-colors">{row.name}</td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-400 whitespace-normal break-words max-w-[260px] text-xs">
                      {row.fileName || "-"}
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-600 dark:text-slate-300">
                        {row.kategori}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-500 dark:text-slate-400 text-xs">
                      {row.tanggalUnggah}
                    </td>
                  </tr>
                ))}
                {latestRows.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-2">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-sm">Belum ada dokumen terbaru</p>
                      </div>
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
