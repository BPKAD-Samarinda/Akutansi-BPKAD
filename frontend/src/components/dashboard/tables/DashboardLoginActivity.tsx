type LoginRow = {
  id: number;
  username: string;
  role:
    | "Admin"
    | "Staff"
    | "Anak PKL"
    | "Admin Akuntansi"
    | "Staff Akuntansi";
  loginAt: string;
};

type Props = {
  data: LoginRow[];
};

export default function DashboardLoginActivity({ data }: Props) {
  return (
    <div className="bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/50 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-6 shadow-xl shadow-slate-200/20 dark:shadow-black/40 h-full flex flex-col relative overflow-hidden group">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="mb-6 flex items-start justify-between relative z-10">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-500/20 text-indigo-500 shadow-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              Aktivitas Login
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Riwayat akses masuk ke sistem
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></span>
          {data.length} aktivitas
        </span>
      </div>

      <div className="max-h-[380px] overflow-y-auto overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800/80 custom-scrollbar relative z-10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50/90 dark:bg-slate-800/90 sticky top-0 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-700">
            <tr className="text-slate-500 dark:text-slate-400">
              <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest">No</th>
              <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest">User</th>
              <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest">Role</th>
              <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-widest">Waktu login</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {data.map((row, index) => (
              <tr
                key={row.id}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group/row"
              >
                <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 text-xs">{index + 1}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase">
                      {row.username.charAt(0)}
                    </div>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold text-sm group-hover/row:text-indigo-600 dark:group-hover/row:text-indigo-400 transition-colors">
                      {row.username}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold ${
                      row.role === "Admin" || row.role === "Admin Akuntansi"
                        ? "bg-indigo-50 text-indigo-700 border border-indigo-200/50 dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-500/20"
                        : row.role === "Anak PKL"
                        ? "bg-amber-50 text-amber-700 border border-amber-200/50 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200/50 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20"
                    }`}
                  >
                    {row.role}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 text-xs font-medium">
                  {row.loginAt}
                </td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-3">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-sm">Belum ada aktivitas login</p>
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
