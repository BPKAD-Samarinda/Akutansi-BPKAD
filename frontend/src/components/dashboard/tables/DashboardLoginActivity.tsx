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
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-6 shadow-sm hover:shadow-xl dark:hover:shadow-indigo-500/5 transition-all duration-300 h-full flex flex-col">
      <div className="mb-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
            Aktivitas Login
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Riwayat akses pengguna ke sistem.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-200">
          {data.length} aktivitas
        </span>
      </div>

      <div className="max-h-[380px] overflow-y-auto overflow-x-auto rounded-xl border border-slate-200/60 dark:border-slate-800/60 custom-scrollbar">
        <table className="w-full text-sm">
          <thead className="bg-slate-50/80 dark:bg-slate-800/50 sticky top-0 backdrop-blur-sm z-10">
            <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-200/60 dark:border-slate-800/60">
              <th className="text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider">No</th>
              <th className="text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider">User</th>
              <th className="text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider">Role</th>
              <th className="text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider">Waktu login</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-900">
            {data.map((row, index) => (
              <tr
                key={row.id}
                className="border-b border-slate-100 dark:border-slate-800 hover:bg-indigo-50/50 dark:hover:bg-slate-800/60 transition-colors"
              >
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{index + 1}</td>
                <td className="px-4 py-3 text-slate-900 dark:text-slate-100 font-semibold">
                  {row.username}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                      row.role === "Admin" || row.role === "Admin Akuntansi"
                        ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200"
                        : row.role === "Anak PKL"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200"
                        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200"
                    }`}
                  >
                    {row.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{row.loginAt}</td>
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-5 text-sm text-gray-500 dark:text-slate-400 text-center">
                  Belum ada aktivitas login.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
