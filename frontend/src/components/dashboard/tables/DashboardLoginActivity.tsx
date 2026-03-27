type LoginRow = {
  id: number;
  username: string;
  role: "Admin" | "Staff";
  loginAt: string;
};

type Props = {
  data: LoginRow[];
};

export default function DashboardLoginActivity({ data }: Props) {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-slate-100/60 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">
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

      <div className="max-h-[420px] overflow-y-auto overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-slate-50 to-indigo-50/60 dark:from-slate-900 dark:to-slate-900/60">
            <tr className="text-slate-500 dark:text-slate-400 border-y border-slate-100 dark:border-slate-800">
              <th className="text-left px-4 py-3 text-xs font-semibold">No</th>
              <th className="text-left px-4 py-3 text-xs font-semibold">User</th>
              <th className="text-left px-4 py-3 text-xs font-semibold">Role</th>
              <th className="text-left px-4 py-3 text-xs font-semibold">Waktu login</th>
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
                      row.role === "Admin"
                        ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200"
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
