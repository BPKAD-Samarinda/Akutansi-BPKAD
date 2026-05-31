import { useMemo } from "react";
import { FiFileText } from "react-icons/fi";

type Props = {
  activities: Array<{
    id: number | string;
    name: string; // Pengunggah
    kategori: string;
    tanggalDokumen: string;
    tanggalUnggah: string;
    fileName?: string;
    rawDate: string; // for sorting
  }>;
};

export default function DashboardUploadActivityCard({ activities }: Props) {
  const sortOrder = "terbaru";

  const getDaysAgo = (rawDate: string) => {
    if (!rawDate) return 999;
    const parts = rawDate.split("-");
    if (parts.length < 3) return 999;
    const year = Number(parts[0]);
    const month = Number(parts[1]) - 1;
    const day = Number(parts[2]);
    
    const uploadDate = new Date(year, month, day);
    const today = new Date();
    
    uploadDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - uploadDate.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const filteredAndSortedActivities = useMemo(() => {
    return activities
      .filter((row) => {
        const daysAgo = getDaysAgo(row.rawDate);
        if (sortOrder === "terbaru") {
          // Hanya tampilkan dokumen dalam 3 hari terakhir (0, 1, 2, 3 hari)
          return daysAgo >= 0 && daysAgo <= 3;
        } else {
          // Tampilkan dokumen yang ter-reset dari Terbaru (> 3 hari) tapi masih di bawah 7 hari (4, 5, 6, 7 hari)
          return daysAgo > 3 && daysAgo <= 7;
        }
      })
      .sort((a, b) => {
        if (sortOrder === "terbaru") {
          return b.rawDate.localeCompare(a.rawDate);
        } else {
          return a.rawDate.localeCompare(b.rawDate);
        }
      });
  }, [activities, sortOrder]);

  const getCategoryBadgeClass = (kategori: string) => {
    switch (kategori.toLowerCase()) {
      case "lampiran":
        return "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border-indigo-150/50 dark:border-indigo-900/30";
      case "keuangan":
        return "bg-cyan-50 dark:bg-cyan-950/30 text-cyan-600 dark:text-cyan-400 border-cyan-150/50 dark:border-cyan-900/30";
      case "bku":
        return "bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400 border-teal-150/50 dark:border-teal-900/30";
      case "sts":
        return "bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 border-violet-150/50 dark:border-violet-900/30";
      case "rekening koran":
        return "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-150/50 dark:border-rose-900/30";
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  };



  return (
    <div className="bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/50 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-4 sm:p-5 shadow-lg shadow-slate-200/20 dark:shadow-black/40 relative overflow-hidden group">
      {/* Background soft glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Header section */}
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 relative z-10">
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            Aktivitas Dokumen
          </h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            Menampilkan dokumen yang diunggah dalam 3 hari terakhir
          </p>
        </div>
      </div>

      {/* Single activity table */}
      <div className="overflow-y-auto overflow-x-hidden rounded-xl border border-slate-150 dark:border-slate-800/80 custom-scrollbar relative z-10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm max-h-[320px]">
        <table className="w-full text-sm table-fixed">
          <thead className="sticky top-0 z-10 text-white" style={{ backgroundColor: "#FF7A00" }}>
            <tr>
              <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider w-[18%]">Pengunggah</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider w-[30%]">Nama Dokumen</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider w-[14%]">Kategori</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider w-[19%]">Tgl Dokumen</th>
              <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider w-[19%]">Tgl Unggah</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-850/60">
            {filteredAndSortedActivities.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group/row"
              >
                {/* Uploader Name */}
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider shrink-0">
                      {row.name.charAt(0)}
                    </div>
                    <span className="text-slate-800 dark:text-slate-200 font-bold text-xs group-hover/row:text-orange-600 dark:group-hover/row:text-orange-400 transition-colors truncate">
                      {row.name}
                    </span>
                  </div>
                </td>

                {/* File Name */}
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <FiFileText className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                    <span
                      className="text-slate-600 dark:text-slate-400 font-medium text-xs truncate"
                      title={row.fileName}
                    >
                      {row.fileName || "-"}
                    </span>
                  </div>
                </td>

                {/* Category Badge */}
                <td className="px-4 py-2.5">
                  <span
                    className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[9px] font-extrabold tracking-wider ${getCategoryBadgeClass(
                      row.kategori
                    )}`}
                  >
                    {row.kategori}
                  </span>
                </td>

                {/* Document Date */}
                <td className="px-4 py-2.5 text-slate-500 dark:text-slate-400 text-xs truncate">
                  {row.tanggalDokumen}
                </td>

                {/* Upload Time */}
                <td className="px-4 py-2.5 text-slate-500 dark:text-slate-455 text-xs truncate">
                  {row.tanggalUnggah}
                </td>
              </tr>
            ))}

            {filteredAndSortedActivities.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-3">
                      <FiFileText className="w-6 h-6 text-slate-350" />
                    </div>
                    <p className="text-sm font-medium">
                      {sortOrder === "terbaru"
                        ? "Tidak ada dokumen baru yang diunggah dalam 3 hari terakhir"
                        : "Tidak ada dokumen terlama (4-7 hari lalu) yang tersimpan"}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
