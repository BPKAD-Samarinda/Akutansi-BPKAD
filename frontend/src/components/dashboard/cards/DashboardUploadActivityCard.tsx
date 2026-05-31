import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { FiFileText, FiClock, FiFolder } from "react-icons/fi";

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
  const [sortOrder, setSortOrder] = useState<"terbaru" | "terlama">("terbaru");

  const sortedActivities = useMemo(() => {
    return [...activities].sort((a, b) => {
      if (sortOrder === "terbaru") {
        return b.rawDate.localeCompare(a.rawDate);
      } else {
        return a.rawDate.localeCompare(b.rawDate);
      }
    });
  }, [activities, sortOrder]);

  const getCategoryBadgeClass = (kategori: string) => {
    switch (kategori.toLowerCase()) {
      case "keuangan":
        return "bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 border-violet-100/50 dark:border-violet-900/30";
      case "sts":
        return "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-100/50 dark:border-amber-900/30";
      case "bku":
        return "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-100/50 dark:border-rose-900/30";
      case "rekening koran":
        return "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-100/50 dark:border-emerald-900/30";
      case "lampiran":
        return "bg-sky-50 dark:bg-sky-950/30 text-sky-600 dark:text-sky-400 border-sky-100/50 dark:border-sky-900/30";
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700";
    }
  };

  const selectClass =
    "h-9 w-32 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 text-xs text-slate-700 dark:text-slate-200 " +
    "focus:outline-none focus:ring-0 focus:border-slate-200 dark:focus:border-slate-600 focus-visible:ring-0 cursor-pointer";

  return (
    <div className="bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/50 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-4 sm:p-5 shadow-lg shadow-slate-200/20 dark:shadow-black/40 relative overflow-hidden group">
      {/* Background soft glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Header section with sorting select dropdown */}
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 relative z-10">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
              Aktivitas Dokumen
            </h3>
            <span className="inline-flex items-center rounded-full bg-slate-150 dark:bg-slate-800/80 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 border border-slate-200/40 dark:border-slate-700/40">
              {activities.length} Berkas
            </span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            Daftar aktivitas unggahan dokumen SPPD dan SKP di lingkungan sistem
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Urutkan:</span>
          <Select
            value={sortOrder}
            onValueChange={(value) => setSortOrder(value as "terbaru" | "terlama")}
          >
            <SelectTrigger className={selectClass}>
              <SelectValue placeholder="Pilih Urutan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="terbaru">Terbaru</SelectItem>
              <SelectItem value="terlama">Terlama</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Single activity table */}
      <div className="overflow-y-auto overflow-x-auto rounded-xl border border-slate-150 dark:border-slate-800/80 custom-scrollbar relative z-10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm max-h-[320px]">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-slate-50/90 dark:bg-slate-800/90 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700 backdrop-blur-md">
            <tr className="text-slate-450 dark:text-slate-500">
              <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider">Pengunggah</th>
              <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider">Nama Dokumen</th>
              <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider">Kategori</th>
              <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider">Tanggal Dokumen</th>
              <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider">Tanggal Unggah</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-850/60">
            {sortedActivities.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group/row"
              >
                {/* Uploader Name */}
                <td className="px-5 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      {row.name.charAt(0)}
                    </div>
                    <span className="text-slate-800 dark:text-slate-200 font-bold text-xs group-hover/row:text-orange-600 dark:group-hover/row:text-orange-400 transition-colors truncate max-w-[150px]">
                      {row.name}
                    </span>
                  </div>
                </td>

                {/* File Name */}
                <td className="px-5 py-2.5">
                  <div className="flex items-center gap-2 max-w-[280px]">
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
                <td className="px-5 py-2.5">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[9px] uppercase font-extrabold tracking-wider ${getCategoryBadgeClass(
                      row.kategori
                    )}`}
                  >
                    <FiFolder className="w-2.5 h-2.5" />
                    {row.kategori}
                  </span>
                </td>

                {/* Document Date */}
                <td className="px-5 py-2.5 text-slate-500 dark:text-slate-400 text-xs">
                  {row.tanggalDokumen}
                </td>

                {/* Upload Time */}
                <td className="px-5 py-2.5">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-450 text-xs">
                    <FiClock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                    <span>{row.tanggalUnggah}</span>
                  </div>
                </td>
              </tr>
            ))}

            {sortedActivities.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-3">
                      <FiFileText className="w-6 h-6 text-slate-350" />
                    </div>
                    <p className="text-sm font-medium">Belum ada aktivitas unggahan dokumen</p>
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
